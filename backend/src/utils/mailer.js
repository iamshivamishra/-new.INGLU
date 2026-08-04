import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[mailer] SMTP_HOST / SMTP_USER / SMTP_PASS not set in .env — emails will NOT be sent. " +
        "Falling back to logging OTPs to the console only."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true", // true for port 465, false for 587/25 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Sends an email. Resolves to true if sent, false if SMTP isn't configured
 * (in which case the caller should fall back to logging, e.g. in dev mode).
 */
export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) return false;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await t.sendMail({
    from: `"INGLU EMS" <${from}>`,
    to,
    subject,
    text,
    html,
  });

  return true;
}

export async function sendOtpEmail({ to, code, purpose }) {
  const isReset = purpose === "reset";
  const subject = isReset ? "Your INGLU EMS password reset code" : "Your INGLU EMS login OTP";
  const heading = isReset ? "Password Reset Code" : "Login OTP";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="color: #111; margin-bottom: 8px;">${heading}</h2>
      <p style="color: #444; font-size: 14px;">Use the code below to ${isReset ? "reset your password" : "log in to your account"}. This code expires in 5 minutes.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f4f4f5; border-radius: 6px; margin: 16px 0;">
        ${code}
      </div>
      <p style="color: #888; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const text = `${heading}: ${code} (expires in 5 minutes)`;

  return sendMail({ to, subject, html, text });
}

/**
 * Daily Work Report reminder — fired automatically at 6:00 PM for anyone who
 * hasn't submitted today's report (see utils/scheduler.js), and available for
 * managers to trigger manually via the "Nudge" action on the Review Queue.
 */
export async function sendReportReminderEmail({ to, name }) {
  const subject = "Reminder: Submit your Daily Work Report";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="color: #111; margin-bottom: 8px;">Don't forget today's report</h2>
      <p style="color: #444; font-size: 14px;">Hi ${name || "there"}, you haven't submitted your Daily Work Report for today yet. Please log in to INGLU EMS and submit it before the end of your day.</p>
    </div>
  `;
  const text = `Hi ${name || "there"}, you haven't submitted your Daily Work Report for today yet. Please log in to INGLU EMS and submit it.`;
  return sendMail({ to, subject, html, text });
}
