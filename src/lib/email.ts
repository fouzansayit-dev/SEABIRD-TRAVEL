import { createServerFn } from "@tanstack/react-start";

export interface EmailPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  type: string;
  details: string;
  refNumber?: string;
  preferredContact?: string;
}

export const sendEnquiryEmail = createServerFn({ method: "POST" })
  .validator((data: any) => {
    if (!data) return {};
    if (typeof data === "object") {
      if ("data" in data && data.data) {
        return data.data;
      }
      return data;
    }
    return {};
  })
  .handler(async ({ data }) => {
    const gmailUser = process.env.GMAIL_USER || "seabirdtravelcanada@gmail.com";
    const gmailPass = process.env.GMAIL_APP_PASS;
    const toEmails = process.env.GMAIL_TO || "contact@seabirdtravel.ca, seabirdtravelcanada@gmail.com";

    if (!gmailPass) {
      console.log("\n------------------ DEV MODE EMAIL LOG ------------------");
      console.log(`[MOCK EMAIL SENT TO: ${toEmails}]`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Ref Code: ${data.refNumber || "N/A"}`);
      console.log(`From: ${data.name} <${data.email}> (${data.phone})`);
      console.log(`Preferred Contact: ${data.preferredContact}`);
      console.log(`Type: ${data.type}`);
      console.log(`Details:\n${data.details}`);
      console.log("---------------------------------------------------------\n");
      return { success: true, isDemo: true };
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0B2545; border-bottom: 2px solid #5BB8E8; padding-bottom: 8px; margin-top: 0;">New Travel Inquiry</h2>
        
        <div style="margin-top: 15px; margin-bottom: 20px; background-color: #F4F6F9; padding: 12px; border-radius: 8px; border-left: 4px solid #0B2545;">
          <strong>Reference Code:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #1A3D6E;">${data.refNumber || "N/A"}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-weight: bold; width: 35%; text-align: left;">Name:</td>
            <td style="padding: 6px 0; color: #0B2545; text-align: left;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-weight: bold; text-align: left;">Email:</td>
            <td style="padding: 6px 0; color: #0B2545; text-align: left;"><a href="mailto:${data.email}" style="color: #5BB8E8; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-weight: bold; text-align: left;">Phone:</td>
            <td style="padding: 6px 0; color: #0B2545; text-align: left;"><a href="tel:${data.phone}" style="color: #5BB8E8; text-decoration: none;">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-weight: bold; text-align: left;">Preferred Contact:</td>
            <td style="padding: 6px 0; color: #0B2545; text-transform: capitalize; text-align: left;">${data.preferredContact || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B; font-weight: bold; text-align: left;">Inquiry Type:</td>
            <td style="padding: 6px 0; color: #0B2545; text-transform: capitalize; font-weight: bold; text-align: left;">${data.type}</td>
          </tr>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
          <h4 style="color: #0B2545; margin-top: 0; margin-bottom: 8px;">Request / Message Details:</h4>
          <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155; background-color: #fafafa; padding: 12px; border-radius: 8px; margin: 0;">${data.details}</p>
        </div>

        <footer style="margin-top: 30px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Sent automatically from Seabird Travel Agency platform.
        </footer>
      </div>
    `;

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"Seabird Travel Notification" <${gmailUser}>`,
        to: toEmails.split(",").map(e => e.trim()),
        subject: `${data.subject} [${data.refNumber || "Inquiry"}]`,
        html: html,
      });

      return { success: true };
    } catch (err: any) {
      console.error("[SERVER] Gmail SMTP failed to send:", err);
      return { success: false, error: err?.message || "Failed to send email via SMTP" };
    }
  });
