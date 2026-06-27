import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare, Send, X, RefreshCw, CheckCircle,
  User, Mail, Phone, Calendar, MapPin, Clipboard,
  Sparkles, Bot, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { processChatMessage, type ChatbotBookingSlots, type ChatbotMessage } from "@/lib/chatbot";
import { toast } from "sonner";

// ─── Constants ───
const SESSION_KEY = "seabird_travel_chatbot_session_v1";

const SLOT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  name: { label: "Name", icon: <User className="h-3 w-3" /> },
  email: { label: "Email", icon: <Mail className="h-3 w-3" /> },
  phone: { label: "Phone", icon: <Phone className="h-3 w-3" /> },
  type: { label: "Type", icon: <Clipboard className="h-3 w-3" /> },
  destination: { label: "Destination", icon: <MapPin className="h-3 w-3" /> },
  departureDate: { label: "Departure Date", icon: <Calendar className="h-3 w-3" /> },
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const [slots, setSlots] = useState<ChatbotBookingSlots>({});
  const [isPending, setIsPending] = useState(false);
  const [showSlots, setShowSlots] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { messages: savedMsgs, slots: savedSlots } = JSON.parse(saved);
        setMessages(savedMsgs || []);
        setSlots(savedSlots || {});
      } catch (e) {
        console.error("Failed to load chatbot session:", e);
      }
    } else {
      // Default greeting
      setMessages([
        {
          role: "assistant",
          content: "Hi! 👋 I'm **Seabird Travel AI**. I can help you book flights, hotels, tour packages, visas, or answer questions about your next destination!\n\nWhat are you planning today?",
        },
      ]);
    }
  }, []);

  // Save session to localStorage
  const saveSession = (msgs: ChatbotMessage[], currentSlots: ChatbotBookingSlots) => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ messages: msgs, slots: currentSlots })
    );
  };

  // Reset chat session
  const handleReset = () => {
    if (confirm("Reset conversation and start over?")) {
      const initialMsgs: ChatbotMessage[] = [
        {
          role: "assistant",
          content: "Hi! 👋 Let's start a new request. How can I help you today? (e.g. flights to India, tour package, hotel booking)",
        },
      ];
      setMessages(initialMsgs);
      setSlots({});
      saveSession(initialMsgs, {});
      toast.success("Session reset!");
    }
  };

  // Send message
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isPending) return;

    setInput("");
    const updatedMsgs = [...messages, { role: "user", content: text } as ChatbotMessage];
    setMessages(updatedMsgs);
    setIsPending(true);

    try {
      const response = await processChatMessage({
        data: {
          messages: updatedMsgs,
          slots,
          userMessage: text,
        },
      });

      const nextMsgs = [
        ...updatedMsgs,
        { role: "assistant", content: response.answer } as ChatbotMessage,
      ];
      setMessages(nextMsgs);
      setSlots(response.slots);
      saveSession(nextMsgs, response.slots);

      if (response.isComplete) {
        toast.success("Enquiry submitted!");
      }
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Oops! Something went wrong.");
      setMessages([
        ...updatedMsgs,
        { role: "assistant", content: "Sorry, I encountered an issue. Let's try again." } as ChatbotMessage,
      ]);
    } finally {
      setIsPending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Progress calculations
  const filledSlots = Object.entries(slots).filter(([key, val]) => val && key !== "state" && key !== "refNumber");
  const totalRequired = 4; // name, email, phone, type
  const filledRequired = ["name", "email", "phone", "type"].filter(k => (slots as any)[k]).length;
  const progressPercent = Math.min(Math.round((filledRequired / totalRequired) * 100), 100);

  // Markdown-lite formatting helper
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="bg-accent/20 text-accent-dark px-1.5 py-0.5 rounded font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part === "\n") {
        return <br key={index} />;
      }
      return part;
    });
  };

  return (
    <>
      {/* CSS keyframe animations */}
      <style>{`
        @keyframes abPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .ab-dot {
          animation: abPulse 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Seabird Chatbot"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated transition hover:scale-105 hover:bg-primary-dark cursor-pointer"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-bounce" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-22 right-5 z-50 flex w-[92vw] max-w-[420px] h-[80vh] max-h-[580px] flex-col rounded-2xl border border-border bg-card shadow-elevated overflow-hidden transition-all duration-300 md:w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Seabird Travel AI</h3>
                <p className="text-[11px] text-accent/80 font-medium">Virtual Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                title="Reset Chat"
                className="rounded-full p-1.5 text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground transition cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress / Context Bar */}
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>Booking Progress: {progressPercent}%</span>
            </div>
            <button
              onClick={() => setShowSlots(!showSlots)}
              className="flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer"
            >
              <span>{showSlots ? "Hide Details" : "Show Details"}</span>
              {showSlots ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Slots Details Panel (Accordion style) */}
          {showSlots && (
            <div className="border-b border-border bg-muted/40 p-3 max-h-[160px] overflow-y-auto text-xs flex flex-col gap-2">
              <div className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Information Gathered</div>
              {filledSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {filledSlots.map(([key, val]) => {
                    const labelCfg = SLOT_LABELS[key];
                    if (!labelCfg) return null;
                    return (
                      <div key={key} className="flex items-center gap-1.5 bg-card border border-border p-1.5 rounded-lg shadow-sm">
                        <span className="text-accent-dark">{labelCfg.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] text-muted-foreground uppercase leading-none font-medium">{labelCfg.label}</div>
                          <div className="font-semibold truncate text-[11px] mt-0.5">{String(val)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-2">No details captured yet. Start typing to begin.</div>
              )}
              {slots.refNumber && (
                <div className="flex items-center justify-center gap-1 bg-green-500/10 text-green-600 border border-green-500/20 py-1.5 px-3 rounded-lg text-center mt-1 font-bold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Ref: {slots.refNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent-dark font-bold text-xs border border-accent/20">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow"
                      : "bg-card text-card-foreground border border-border rounded-tl-none shadow-sm"
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isPending && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/25 text-accent-dark font-bold text-xs border border-accent/20">
                  AI
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3 flex gap-1 items-center shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 ab-dot" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 ab-dot" style={{ animationDelay: "200ms" }}></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 ab-dot" style={{ animationDelay: "400ms" }}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length === 1 && !isPending && (
            <div className="flex gap-1.5 overflow-x-auto px-4 py-2 border-t border-border bg-card scrollbar-none">
              {[
                { text: "Book Flights ✈️", query: "I want to book flights" },
                { text: "Tour Package 🌍", query: "I need a tour package" },
                { text: "Hotel Booking 🏨", query: "I need to book a hotel stay" },
                { text: "Visa Services 🛂", query: "I need help with visa application" },
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q.query);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="shrink-0 text-[10px] font-bold text-primary bg-secondary/80 border border-primary/10 rounded-full px-3 py-1.5 hover:bg-secondary transition cursor-pointer"
                >
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 border-t border-border bg-card p-3 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type message... (Enter to send)"
              className="flex-1 max-h-[80px] min-h-[38px] bg-muted/40 border border-border rounded-xl px-3 py-2 text-xs leading-normal resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 placeholder:text-muted-foreground/75"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow hover:bg-primary-dark transition disabled:opacity-40 disabled:hover:scale-100 cursor-pointer hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
