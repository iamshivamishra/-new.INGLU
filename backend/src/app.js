import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import timesheetRoutes from "./routes/timesheetRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dailyReportRoutes from "./routes/dailyReportRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import recruitmentRoutes from "./routes/recruitmentRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import kbRoutes from "./routes/kbRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Uploaded attachments (Daily Work Report proofs, etc.) served as static files.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "INGLU EMS API" }));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/daily-reports", dailyReportRoutes);
app.use("/api/social-submissions", socialRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/knowledge-base", kbRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;
