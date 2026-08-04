import cron from "node-cron";
import User from "../models/User.js";
import DailyReport from "../models/DailyReport.js";
import { sendReportReminderEmail } from "./mailer.js";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function remindMissingReports() {
  const date = todayStr();
  try {
    const activeUsers = await User.find({ status: "Active" }).select("name email");
    const submitted = await DailyReport.find({ date }).select("user");
    const submittedIds = new Set(submitted.map((r) => String(r.user)));

    const missing = activeUsers.filter((u) => !submittedIds.has(String(u._id)));
    for (const u of missing) {
      const sent = await sendReportReminderEmail({ to: u.email, name: u.name });
      if (!sent) {
        console.log(`[REMINDER 6PM] Daily report reminder for ${u.name} (${u.email}) — SMTP not configured, logging only.`);
      }
    }
    console.log(`[REMINDER 6PM] Daily report reminders processed for ${missing.length} user(s) on ${date}.`);
  } catch (err) {
    console.error("[REMINDER 6PM] Failed to run daily report reminder job:", err.message);
  }
}

// Office hours are 10:00 AM – 7:00 PM, Monday–Saturday (see PRD §6.6).
// Fires at 6:00 PM server time, Mon–Sat, matching the Daily Work Report deadline.
export function startSchedulers() {
  cron.schedule("0 18 * * 1-6", remindMissingReports);
  console.log("[scheduler] Daily report 6:00 PM reminder job scheduled (Mon–Sat).");
}

// Exported for manual/testing use as well.
export { remindMissingReports };
