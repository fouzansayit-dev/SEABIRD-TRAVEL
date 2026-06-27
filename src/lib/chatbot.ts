import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";
import { sendEnquiryEmailInternal } from "./email";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ChatbotBookingSlots {
  name?: string;
  email?: string;
  phone?: string;
  type?: string; // flights, hotels, packages, visas, general
  destination?: string;
  departureDate?: string;
  details?: string;
  refNumber?: string;
  state?: string; // IDLE, COLLECTING_NAME, COLLECTING_TYPE, etc.
}

export interface ChatbotMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatbotResponse {
  answer: string;
  slots: ChatbotBookingSlots;
  isComplete: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TRAVEL_TYPES = ["flights", "hotels", "packages", "visas", "general"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateRefNumber(): string {
  return "SBT-" + Math.floor(100000 + Math.random() * 900000);
}

// Simple regex-based fallback slot extraction if OpenAI API key is missing/fails
function extractSlotsRegex(text: string): Partial<ChatbotBookingSlots> {
  const slots: Partial<ChatbotBookingSlots> = {};

  // Email regex
  const emailMatch = text.match(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) slots.email = emailMatch[0];

  // Phone regex
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\d{3}[\s-]?){2}\d{4}/);
  if (phoneMatch) slots.phone = phoneMatch[0].replace(/\s/g, "");

  // Date detection (simple)
  const dateMatch = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/);
  if (dateMatch) {
    slots.departureDate = dateMatch[0];
  }

  // Travel Type matching
  const lower = text.toLowerCase();
  if (lower.includes("flight") || lower.includes("plane") || lower.includes("fly")) slots.type = "flights";
  else if (lower.includes("hotel") || lower.includes("resort") || lower.includes("stay")) slots.type = "hotels";
  else if (lower.includes("package") || lower.includes("tour") || lower.includes("trip")) slots.type = "packages";
  else if (lower.includes("visa")) slots.type = "visas";

  return slots;
}

// Helper to determine the next missing slot
function getNextMissingSlot(slots: ChatbotBookingSlots): keyof ChatbotBookingSlots | null {
  if (!slots.name) return "name";
  if (!slots.type) return "type";
  if (!slots.email) return "email";
  if (!slots.phone) return "phone";
  if (["flights", "hotels", "packages"].includes(slots.type || "") && !slots.destination) return "destination";
  if (["flights", "hotels", "packages"].includes(slots.type || "") && !slots.departureDate) return "departureDate";
  return null;
}

// ─── TanStack Server Function ────────────────────────────────────────────────

export const processChatMessage = createServerFn({ method: "POST" })
  .validator((data: any) => {
    return data as {
      messages: ChatbotMessage[];
      slots: ChatbotBookingSlots;
      userMessage: string;
    };
  })
  .handler(async ({ data }) => {
    const { messages, slots: currentSlots, userMessage } = data;
    const trimmed = userMessage.trim();
    const apiKey = process.env.OPENAI_API_KEY;

    let slots: ChatbotBookingSlots = { ...currentSlots };

    // Reset flow check
    const cancelWords = ["cancel", "stop", "reset", "clear", "restart", "start over"];
    if (cancelWords.some(w => trimmed.toLowerCase().includes(w))) {
      return {
        answer: "Sure, let's start over! 🔄 What would you like to book today? (e.g. flights to India, tour package, hotel booking)",
        slots: { state: "COLLECTING_NAME" },
        isComplete: false,
      };
    }

    // Determine if this is the very first message in the session
    const isFirstMessage = !currentSlots.state || currentSlots.state === "IDLE";

    // Initialize state if not present
    if (!slots.state || slots.state === "IDLE") {
      slots.state = "COLLECTING_NAME";
    }

    // ─── Phase 1: Slot Extraction ───────────────────────────────────────────
    
    // First, try OpenAI if API key exists
    let extractedByOpenAI = false;
    if (apiKey) {
      const openai = new OpenAI({ apiKey });
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI travel assistant for Seabird Travel extracting structured booking details.
              Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
              Current slots: ${JSON.stringify(slots)}.
              Extract any new travel-relevant details from the user's message.
              For travel types, return one of: "flights", "hotels", "packages", "visas", "general".`,
            },
            {
              role: "user",
              content: `User message: "${trimmed}"`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_travel_slots",
                description: "Extract travel details from user message",
                parameters: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Customer full name" },
                    email: { type: "string", description: "Customer email address" },
                    phone: { type: "string", description: "Customer phone number" },
                    type: { type: "string", enum: TRAVEL_TYPES, description: "Type of inquiry" },
                    destination: { type: "string", description: "Destination city or country" },
                    departureDate: { type: "string", description: "Departure date (e.g. July 15, 2026 or ISO date)" },
                    details: { type: "string", description: "Additional details (e.g. passengers, return date, cabin class, hotel preferences)" },
                  },
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "extract_travel_slots" } },
          temperature: 0.1,
        });

        const toolCall = response.choices[0]?.message?.tool_calls?.[0] as any;
        if (toolCall?.function?.arguments) {
          const extracted = JSON.parse(toolCall.function.arguments) as Partial<ChatbotBookingSlots>;
          Object.entries(extracted).forEach(([key, val]) => {
            if (val && String(val).trim().length > 0) {
              (slots as any)[key] = val;
            }
          });
          extractedByOpenAI = true;
        }
      } catch (err) {
        console.error("[Chatbot] OpenAI slot extraction failed (quota/connection issue):", err);
      }
    }

    // ─── Phase 2: Bulletproof Fallback/Deterministic Extraction ───────────────
    // If OpenAI wasn't used or didn't extract the active slot, we assign it directly based on the active state:
    if (!extractedByOpenAI) {
      // First try standard regex (great for emails, phone numbers, type keywords)
      const regexSlots = extractSlotsRegex(trimmed);
      Object.entries(regexSlots).forEach(([key, val]) => {
        if (val) (slots as any)[key] = val;
      });

      // State-specific direct assignment fallback (ONLY if not the very first intent/greeting message!)
      if (!isFirstMessage) {
        if (slots.state === "COLLECTING_NAME" && !slots.name) {
          slots.name = trimmed;
        } else if (slots.state === "COLLECTING_TYPE" && !slots.type) {
          const lower = trimmed.toLowerCase();
          if (lower.includes("flight") || lower.includes("plane")) slots.type = "flights";
          else if (lower.includes("hotel") || lower.includes("resort") || lower.includes("stay")) slots.type = "hotels";
          else if (lower.includes("package") || lower.includes("tour") || lower.includes("trip")) slots.type = "packages";
          else if (lower.includes("visa")) slots.type = "visas";
          else slots.type = "general"; // default fallback
        } else if (slots.state === "COLLECTING_EMAIL" && !slots.email) {
          if (trimmed.includes("@")) {
            slots.email = trimmed;
          }
        } else if (slots.state === "COLLECTING_PHONE" && !slots.phone) {
          slots.phone = trimmed;
        } else if (slots.state === "COLLECTING_DESTINATION" && !slots.destination) {
          slots.destination = trimmed;
        } else if (slots.state === "COLLECTING_DATE" && !slots.departureDate) {
          slots.departureDate = trimmed;
        }
      }
    }

    // ─── Phase 3: State Machine Transitions & Prompts ────────────────────────
    let answer = "";
    let isComplete = false;

    // Handle confirmation screen
    if (slots.state === "CONFIRMING") {
      const confirmWords = ["yes", "confirm", "correct", "right", "ok", "sure", "proceed", "✓", "👍", "yup"];
      const isConfirm = confirmWords.some(w => trimmed.toLowerCase().includes(w));

      if (isConfirm) {
        slots.refNumber = slots.refNumber || generateRefNumber();
        slots.state = "DONE";
        isComplete = true;

        // Submit via email
        try {
          const emailData = {
            name: slots.name || "Client",
            email: slots.email || "",
            phone: slots.phone || "",
            subject: `Seabird Travel Inquiry: ${slots.type ? slots.type.toUpperCase() : "General"} Booking`,
            type: slots.type || "general",
            preferredContact: "email",
            refNumber: slots.refNumber,
            details: `
Destination: ${slots.destination || "Not specified"}
Departure Date: ${slots.departureDate || "Not specified"}
Additional Details: ${slots.details || "None"}
            `.trim(),
          };

          await sendEnquiryEmailInternal(emailData);
        } catch (err) {
          console.error("[Chatbot] Failed to send enquiry email:", err);
        }

        answer = `🎉 **Booking Inquiry Submitted Successfully!**\n\nHere are your booking details:\n\n🔑 **Reference Code:** \`${slots.refNumber}\`\n👤 **Name:** ${slots.name}\n📧 **Email:** ${slots.email}\n📞 **Phone:** ${slots.phone}\n✈️ **Type:** ${slots.type}\n📍 **Destination:** ${slots.destination || "Not specified"}\n📅 **Departure Date:** ${slots.departureDate || "Not specified"}\n\nOur travel agents will get back to you shortly to confirm availability and price. Check your email for confirmation!\n\nIs there anything else I can assist you with?`;
        return { answer, slots, isComplete };
      } else {
        // Reset or adjust
        slots.state = "COLLECTING_NAME";
        slots.name = undefined;
        slots.email = undefined;
        slots.phone = undefined;
        slots.type = undefined;
        slots.destination = undefined;
        slots.departureDate = undefined;
        answer = "No worries, let's start over and correct that. Could you please tell me your **full name**?";
        return { answer, slots, isComplete };
      }
    }

    // Determine the next missing slot
    const nextMissing = getNextMissingSlot(slots);

    if (nextMissing) {
      if (nextMissing === "name") {
        slots.state = "COLLECTING_NAME";
        answer = "I'd be glad to help you book your next trip! ✈️ First, could you please tell me your **full name**?";
      } else if (nextMissing === "type") {
        slots.state = "COLLECTING_TYPE";
        answer = `Thanks, ${slots.name}! 😊 What type of travel inquiry is this? Please reply with one of the following:\n\n• **Flights** ✈️\n• **Hotels** 🏨\n• **Packages** 🌍\n• **Visas** 🛂\n• **General** 💬`;
      } else if (nextMissing === "email") {
        slots.state = "COLLECTING_EMAIL";
        answer = `Got it. What is your **email address** so we can send you confirmation details?`;
      } else if (nextMissing === "phone") {
        slots.state = "COLLECTING_PHONE";
        answer = `Thank you! Lastly, what is your **phone number** so a travel agent can reach you if needed?`;
      } else if (nextMissing === "destination") {
        slots.state = "COLLECTING_DESTINATION";
        answer = `Great. Where is your **destination**? (e.g. Toronto, Vancouver, Delhi, London)`;
      } else if (nextMissing === "departureDate") {
        slots.state = "COLLECTING_DATE";
        answer = "When are you planning to **depart**? (e.g. July 15, next Friday, August 2026)";
      }
    } else {
      // All basic slots gathered! Move to confirmation state.
      slots.state = "CONFIRMING";
      answer = `Perfect! I've gathered all your information. Let's review it:\n\n👤 **Name:** ${slots.name}\n📧 **Email:** ${slots.email}\n📞 **Phone:** ${slots.phone}\n🏷️ **Type:** ${slots.type}\n📍 **Destination:** ${slots.destination || "Not specified"}\n📅 **Departure Date:** ${slots.departureDate || "Not specified"}\n\nDoes this look correct? Please reply **"Yes, confirm"** to submit this enquiry to our team.`;
    }

    return {
      answer,
      slots,
      isComplete,
    };
  });
