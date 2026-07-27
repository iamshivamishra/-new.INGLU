# INGLU EMS — MERN Stack

Full MERN implementation of the INGLU Employee Management System.

## Structure
- `frontend/` — React + Vite + Tailwind
- `backend/` — Node.js + Express + MongoDB (Mongoose), JWT auth, RBAC

## ⚠️ Fixed in this version
1. **Login wasn't working** — the shipped project had no `backend/.env` file, so the
   server had no `MONGO_URI`/`JWT_SECRET` and either crashed or silently failed to
   connect to MongoDB. A working `.env` is now included, and connection errors now
   print a clear diagnostic instead of failing silently.
2. **Login with OTP wasn't working** — it was a UI-only mockup with no backend call.
   It's now fully wired: `/api/auth/otp/send` and `/api/auth/otp/verify`. Since no
   SMS/email provider is configured yet, the generated code is returned in the API
   response and printed in the backend console (dev mode only) so you can test it
   end-to-end — just check the terminal running `npm run dev` in `backend/`, or the
   green "Dev mode" hint on screen.
3. **Signup didn't exist** — there was no sign-up screen or endpoint at all. Added a
   full Sign Up screen (link on the Login page) + `POST /api/auth/signup`, which
   auto-generates an Employee ID and logs the new user straight in.
4. Forgot/reset password is now wired the same way (code shown in dev mode, since
   no email provider is configured).

## Setup

### 0. Make sure MongoDB is actually running
This is the #1 cause of "login doesn't work": the backend can't reach the database.
- Local install: run `mongod` (or start the MongoDB service) before `npm run dev`.
- Or use a free MongoDB Atlas cluster and paste its connection string into
  `backend/.env` as `MONGO_URI`.
You'll see `MongoDB connected: ...` in the backend terminal when it's working. If you
instead see `❌ MongoDB connection failed`, fix that first — nothing else will work
until the backend can reach the database.

### 1. Backend
```
cd backend
npm install
npm run seed        # loads 8 demo users (one per role), password: Welcome@123
npm run dev          # starts on http://localhost:5000
```
A working `.env` is already included (`backend/.env`), pointing at
`mongodb://127.0.0.1:27017/inglu_ems`. Edit it if your MongoDB runs elsewhere.

### 2. Frontend
```
cd frontend
npm install
npm run dev          # starts on http://localhost:5173, proxies /api to :5000
```

## Try it
- **Password login**: any seeded Employee ID or email (e.g. `EMP-2024-0011` /
  `aditi@inglu.com`), password `Welcome@123`.
- **OTP login**: click "Login with OTP", enter the same email/Employee ID, click
  "Send OTP" — the 6-digit code appears on screen (dev mode) and in the backend
  terminal log. Enter it to log in.
- **Sign up**: click "Sign up" on the login screen, fill the form — creates a new
  Employee/Intern account and logs you straight in.
- **Forgot password**: click "Forgot?", enter your email, use the on-screen dev
  code to set a new password.

## Troubleshooting "login doesn't work"
1. Is `backend` actually running (`npm run dev` in a terminal, no errors)?
2. Does that terminal say `MongoDB connected: ...`? If not, see step 0 above.
3. Is `frontend` running on port 5173 (so the `/api` proxy to port 5000 works)?
4. Open the browser dev console (F12) → Network tab → try logging in → check what
   the `/api/auth/login` request actually returns. The on-screen error message
   (red text under the form) now shows the real backend error, including
   "Can't reach the server..." if the backend isn't running at all.

## Backend API coverage (all under `/api`)
auth (login, signup, OTP login, forgot/reset password, first-time setup), employees,
attendance (clock-in/out with **server-enforced** timesheet gate), timesheets,
leaves (apply/approve with balance + LOP logic), tasks, daily-reports, social-submissions,
payroll (salary structures, payroll run, payslips), recruitment (candidates/pipeline/interviews/offers),
crm (clients/deals/invoices), leads, assets, announcements, knowledge-base, performance, dashboard summaries.

Every route is protected by JWT (`protect` middleware); mutating/admin routes are further
restricted by role via `allowRoles(...)`, mirroring the Permissions Matrix in the PRD.

## Next steps to fully finish the build
The remaining screens (Recruitment board, CRM, Leads, Assets, KB, Announcements, Reports,
Settings, Employee Profile tabs) still render against in-file mock arrays. The backend
already exposes matching REST endpoints for all of them — swap each screen's local mock
array for an `api.get(...)` call in a `useEffect`, the same pattern used in `LoginScreen`.
