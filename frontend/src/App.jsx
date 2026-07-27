import React, { useState, useMemo } from "react";
import {
  Home, ListChecks, Clock, FileText, Send, CalendarDays, Users, UserPlus,
  ClipboardList, Fingerprint, TrendingUp, Wallet, Briefcase, Target,
  Boxes, BookOpen, Megaphone, BarChart3, Settings as SettingsIcon,
  Search, Bell, ChevronDown, ChevronRight, Plus, X, Eye, EyeOff,
  Check, XCircle, MessageSquare, Paperclip, Upload, Download, Filter,
  ArrowLeft, Sparkles, LogOut, Menu, MoreHorizontal, AlertTriangle,
  Circle, CheckCircle2, Star, Link2, MapPin, Cake, ShieldCheck,
} from "lucide-react";
import api from "./api/client.js";

/* ============================== DESIGN TOKENS ==============================
Palette: zinc-950 base, lime-300 signature accent (INGLU's youth-culture jolt),
violet-400 secondary (creator/brand energy), amber for caution, rose for late/risk.
Display face: Space Grotesk (bold, slightly technical, streetwear-adjacent).
Body: Inter. Data/IDs: JetBrains Mono — every person, asset & doc in this system
carries a generated ID, so the signature motif is the monospace "badge tag"
(EMP-2026-0142 style) used consistently across avatars, cards & headers.
============================================================================ */

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
.f-display{font-family:'Space Grotesk',sans-serif;}
.f-body{font-family:'Inter',sans-serif;}
.f-mono{font-family:'JetBrains Mono',monospace;}
.scrollbar-thin::-webkit-scrollbar{width:6px;height:6px;}
.scrollbar-thin::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:3px;}
.scrollbar-thin::-webkit-scrollbar-track{background:transparent;}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
.anim-in{animation:fadeIn .15s ease-out;}
`;

/* ============================== MOCK DATA ============================== */

const ROLES = ["Founder","Super Admin","HR","Finance","Dept Head","Team Lead","Employee","Intern"];

const EMPLOYEES = [
  { id:"EMP-2024-0011", name:"Aditi Rao", role:"Founder", dept:"Leadership", designation:"Founder & CEO", status:"Active", joined:"12 Jan 2022", type:"Full-Time" },
  { id:"EMP-2024-0032", name:"Nandini Kapoor", role:"Dept Head", dept:"Campus Marketing", designation:"Sr. Category Manager", status:"Active", joined:"03 Mar 2023", type:"Full-Time" },
  { id:"EMP-2025-0087", name:"Karan Mehta", role:"Employee", dept:"Sales", designation:"Sales Executive", status:"Active", joined:"18 Aug 2024", type:"Full-Time" },
  { id:"EMP-2025-0091", name:"Priya Desai", role:"Team Lead", dept:"Content", designation:"Team Lead, Content", status:"Active", joined:"02 Sep 2024", type:"Full-Time" },
  { id:"INT-2026-0142", name:"Riya Sharma", role:"Intern", dept:"Marketing", designation:"Content Intern", status:"Active", joined:"15 Jun 2026", type:"Intern" },
  { id:"EMP-2023-0004", name:"Simran Oberoi", role:"Finance", dept:"Finance", designation:"Finance Manager", status:"Active", joined:"20 Feb 2022", type:"Full-Time" },
  { id:"EMP-2022-0002", name:"Rohan Iyer", role:"HR", dept:"People", designation:"HR Manager", status:"Active", joined:"11 Nov 2021", type:"Full-Time" },
  { id:"EMP-2025-0060", name:"Devika Nair", role:"Super Admin", dept:"Ops/IT", designation:"Ops & Systems Lead", status:"Active", joined:"05 Apr 2024", type:"Full-Time" },
];

const CANDIDATES = {
  Applied: [ {name:"Ananya Bose", role:"Content Intern", meta:"Applied via LinkedIn"}, {name:"Yash Thakur", role:"Sales Exec", meta:"Applied via Referral"} ],
  Screened: [ {name:"Karan Vora", role:"Content Intern", meta:"Score 8/10"} ],
  Interview: [ {name:"Meher Kaur", role:"Campus Ambassador", meta:"Slot: Fri 3 PM"} ],
  Assignment: [ {name:"Ishaan Rathi", role:"Content Intern", meta:"Due Mon"} ],
  Offer: [ {name:"Riya Sharma", role:"Content Intern", meta:"Sent 2d ago"} ],
  Hired: [ {name:"Tanvi Seth", role:"Sales Exec", meta:"Joins 1 Jul"} ],
};

const TASKS = {
  "To Do": [ {t:"Reel script — BrandX", p:"High", due:"7 Jul", who:"Karan"}, {t:"Vendor onboarding form", p:"Med", due:"9 Jul", who:"Priya"} ],
  "In Progress": [ {t:"Client deck — Rio Bubbly", p:"Med", due:"8 Jul", who:"Nandini"} ],
  "In Review": [ {t:"Post caption — Society OS", p:"Low", due:"6 Jul", who:"Riya"} ],
  "Done": [ {t:"Vendor invoice", p:"—", due:"Done", who:"Karan"}, {t:"Onboarding checklist — Riya", p:"—", due:"Done", who:"Rohan"} ],
};

const LEADS = [
  { name:"Anita Rathore", source:"Website", score:82, owner:"Karan Mehta", status:"New", nextFU:"06 Jul" },
  { name:"Rohit Verma", source:"Referral", score:65, owner:"Unassigned", status:"New", nextFU:"—" },
  { name:"Sana Iqbal", source:"Instagram", score:74, owner:"Priya Desai", status:"Contacted", nextFU:"08 Jul" },
];

const CLIENTS = [
  { name:"Rio Bubbly", industry:"F&B", owner:"Nandini Kapoor", stage:"Negotiation", value:"₹9L" },
  { name:"Bausch + Lomb", industry:"Eyecare", owner:"Karan Mehta", stage:"Proposal", value:"₹4L" },
  { name:"French Essence", industry:"Fragrance", owner:"Priya Desai", stage:"Won", value:"₹6L" },
  { name:"Society OS Partners", industry:"Platform", owner:"Nandini Kapoor", stage:"New", value:"₹12L" },
];

const ASSETS = [
  { id:"LAP-0012", type:"Laptop", assignedTo:"Riya Sharma", issued:"15 Jun 2026", status:"Issued" },
  { id:"SIM-0044", type:"SIM", assignedTo:"—", issued:"—", status:"In Stock" },
  { id:"ACC-0091", type:"Access Card", assignedTo:"Karan Mehta", issued:"18 Aug 2024", status:"Issued" },
];

const ANNOUNCEMENTS = [
  { pin:true, title:"Office closed 15 Aug — Independence Day", date:"15 Aug" },
  { pin:false, title:"Company Town Hall", date:"10 Jul, 4 PM" },
  { pin:false, title:"Birthdays this week: Riya (12 Jul), Karan (14 Jul)", date:"This week" },
];

const LEAVE_QUEUE = [
  { name:"Karan Mehta", type:"Sick", dates:"8–9 Jul (2d)", balance:"4 left" },
  { name:"Priya Desai", type:"Casual", dates:"12 Jul (1d)", balance:"6 left" },
];

const PAYROLL_ROWS = [
  { name:"Karan Mehta", base:"₹35,000", ded:"-₹500 (2 late marks)", bonus:"₹0", net:"₹34,500" },
  { name:"Riya Sharma", base:"₹12,000", ded:"-₹1,000 (missed 2 posts)", bonus:"₹500", net:"₹11,500" },
  { name:"Priya Desai", base:"₹48,000", ded:"₹0", bonus:"₹2,000", net:"₹50,000" },
];

const SOCIAL_QUEUE = [
  { name:"Riya Sharma", platform:"Instagram", status:"Pending" },
  { name:"Karan Mehta", platform:"LinkedIn", status:"Pending" },
];

const KB = [
  { cat:"Policies", title:"Leave Policy 2026" },
  { cat:"SOPs", title:"Social Media SOP" },
  { cat:"Training Videos", title:"Onboarding Walkthrough" },
  { cat:"Brand Decks", title:"INGLU Brand Guidelines" },
];

/* ============================== NAV STRUCTURE ============================== */

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:Home, group:null },
  { id:"tasks", label:"Tasks", icon:ListChecks, group:"MY WORK" },
  { id:"timesheet", label:"Timesheet", icon:Clock, group:"MY WORK" },
  { id:"dailyreport", label:"Daily Report", icon:FileText, group:"MY WORK" },
  { id:"social", label:"Social Submissions", icon:Send, group:"MY WORK" },
  { id:"leaves", label:"Leaves", icon:CalendarDays, group:"MY WORK" },
  { id:"directory", label:"Employee Directory", icon:Users, group:"PEOPLE" },
  { id:"recruitment", label:"Recruitment (ATS)", icon:UserPlus, group:"PEOPLE", roles:["Founder","Super Admin","HR","Dept Head"] },
  { id:"onboarding", label:"Onboarding", icon:ClipboardList, group:"PEOPLE", roles:["Founder","Super Admin","HR","Dept Head"] },
  { id:"attendance", label:"Attendance", icon:Fingerprint, group:"PEOPLE" },
  { id:"performance", label:"Performance", icon:TrendingUp, group:"PEOPLE" },
  { id:"payroll", label:"Payroll", icon:Wallet, group:"PEOPLE", roles:["Founder","Super Admin","HR","Finance","Employee","Intern","Dept Head","Team Lead"] },
  { id:"crm", label:"CRM", icon:Briefcase, group:"BUSINESS", roles:["Founder","Super Admin","Finance","Dept Head","Team Lead","Employee"] },
  { id:"leads", label:"Lead Allocation", icon:Target, group:"BUSINESS", roles:["Founder","Super Admin","Dept Head","Team Lead","Employee"] },
  { id:"operations", label:"Operations", icon:Boxes, group:"BUSINESS", roles:["Founder","Super Admin","Dept Head","Team Lead"] },
  { id:"assets", label:"Assets", icon:Boxes, group:"RESOURCES" },
  { id:"kb", label:"Knowledge Base", icon:BookOpen, group:"RESOURCES" },
  { id:"announcements", label:"Announcements", icon:Megaphone, group:"RESOURCES" },
  { id:"reports", label:"Reports", icon:BarChart3, group:null },
  { id:"settings", label:"Settings", icon:SettingsIcon, group:null, roles:["Founder","Super Admin","HR","Finance"] },
];

const GROUP_ORDER = ["MY WORK","PEOPLE","BUSINESS","RESOURCES"];

/* ============================== SHARED UI ============================== */

function Badge({ children, tone="zinc" }) {
  const tones = {
    zinc:"bg-zinc-800 text-zinc-300 border-zinc-700",
    lime:"bg-lime-300/10 text-lime-300 border-lime-300/30",
    violet:"bg-violet-400/10 text-violet-300 border-violet-400/30",
    amber:"bg-amber-400/10 text-amber-300 border-amber-400/30",
    rose:"bg-rose-400/10 text-rose-300 border-rose-400/30",
    emerald:"bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${tones[tone]}`}>{children}</span>;
}

function IdTag({ id }) {
  return <span className="f-mono text-[11px] text-lime-300/90 bg-lime-300/5 border border-lime-300/20 rounded px-1.5 py-0.5">{id}</span>;
}

function Avatar({ name, size=32 }) {
  const initials = name.split(" ").map(n=>n[0]).slice(0,2).join("");
  const colors = ["bg-violet-500","bg-lime-500","bg-amber-500","bg-rose-500","bg-cyan-500"];
  const idx = name.length % colors.length;
  return (
    <div className={`${colors[idx]} rounded-full flex items-center justify-center text-zinc-950 font-semibold f-display shrink-0`} style={{width:size,height:size,fontSize:size*0.38}}>
      {initials}
    </div>
  );
}

function Card({ children, className="" }) {
  return <div className={`bg-zinc-900 border border-zinc-800 rounded-xl ${className}`}>{children}</div>;
}

function StatCard({ label, value, sub, tone="lime" }) {
  const toneText = { lime:"text-lime-300", violet:"text-violet-300", amber:"text-amber-300", rose:"text-rose-300" }[tone];
  return (
    <Card className="p-4">
      <div className="text-zinc-500 text-xs f-body mb-2">{label}</div>
      <div className={`f-display text-2xl ${toneText}`}>{value}</div>
      {sub && <div className="text-zinc-500 text-[11px] mt-1">{sub}</div>}
    </Card>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="f-display text-lg text-zinc-100">{title}</h2>
      {action}
    </div>
  );
}

function Btn({ children, onClick, variant="primary", className="", icon:Icon, size="md", disabled=false }) {
  const variants = {
    primary:"bg-lime-300 text-zinc-950 hover:bg-lime-200",
    secondary:"bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700",
    ghost:"text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
    danger:"bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20",
  };
  const sizes = { md:"px-3.5 py-2 text-sm", sm:"px-2.5 py-1.5 text-xs" };
  return (
    <button disabled={disabled} onClick={disabled?undefined:onClick} className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${disabled?"opacity-40 cursor-not-allowed":""} ${className}`}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 anim-in">
      <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[85vh] overflow-y-auto scrollbar-thin`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <h3 className="f-display text-zinc-100">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200"><X size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div className="mb-3"><label className="block text-xs text-zinc-500 mb-1">{label}</label>{children}</div>;
}
const inputCls = "w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-lime-300/60 focus:ring-1 focus:ring-lime-300/30";

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto scrollbar-thin mb-4">
      {tabs.map(t => (
        <button key={t} onClick={()=>onChange(t)}
          className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${active===t ? "border-lime-300 text-lime-300" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Th({ children }) { return <th className="text-left text-[11px] uppercase tracking-wide text-zinc-500 font-medium px-3 py-2">{children}</th>; }
function Td({ children, className="" }) { return <td className={`px-3 py-2.5 text-sm text-zinc-200 ${className}`}>{children}</td>; }

function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full">
        <thead><tr className="border-b border-zinc-800">{columns.map(c=><Th key={c}>{c}</Th>)}</tr></thead>
        <tbody className="divide-y divide-zinc-800/70">{rows}</tbody>
      </table>
    </div>
  );
}

/* ============================== AUTH SCREENS ============================== */

function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-lime-300/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-sm anim-in">{children}</div>
    </div>
  );
}

function LoginScreen({ onLogin, goto }) {
  const [showPw, setShowPw] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!identifier || !password) {
      setError("Please enter both Email/Employee ID and password.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { identifier, password });
      localStorage.setItem("inglu_token", data.token);
      localStorage.setItem("inglu_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err?.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 f-display text-2xl text-zinc-50 mb-1">
          <div className="w-8 h-8 rounded-lg bg-lime-300 text-zinc-950 flex items-center justify-center font-bold">i</div>
          INGLU EMS
        </div>
        <p className="text-zinc-500 text-sm">Sign in to your workspace</p>
      </div>
      <Card className="p-5">
        <Field label="Email / Employee ID">
          <input
            className={inputCls}
            placeholder="you@inglu.com or EMP-2025-0087"
            value={identifier}
            onChange={(e)=>setIdentifier(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==="Enter") handleLogin(); }}
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              type={showPw?"text":"password"}
              className={inputCls}
              placeholder="••••••••"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==="Enter") handleLogin(); }}
            />
            <button onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-2.5 text-zinc-500">{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
        </Field>
        {error && <div className="text-rose-400 text-xs mb-3 -mt-1">{error}</div>}
        <div className="flex items-center justify-between text-xs mb-4">
          <label className="flex items-center gap-1.5 text-zinc-500"><input type="checkbox" className="accent-lime-300"/> Remember me</label>
          <button onClick={()=>goto("forgot")} className="text-lime-300 hover:underline">Forgot?</button>
        </div>
        <Btn className="w-full justify-center" onClick={handleLogin} disabled={loading}>{loading ? "Signing in…" : "Log in"}</Btn>
        <div className="text-center text-zinc-600 text-xs my-3">— or —</div>
        <Btn variant="secondary" className="w-full justify-center" onClick={()=>goto("otp")}>Login with OTP</Btn>
        <div className="text-center text-zinc-500 text-xs mt-4">
          Don't have an account? <button onClick={()=>goto("signup")} className="text-lime-300 hover:underline">Sign up</button>
        </div>
        <div className="text-center text-zinc-600 text-[11px] mt-3">
          Demo: any seeded Employee ID/email · password <span className="f-mono text-zinc-400">Welcome@123</span>
        </div>
      </Card>
      <p className="text-center text-zinc-600 text-xs mt-5">© INGLU · Privacy · Terms · Help</p>
    </AuthShell>
  );
}

function OtpScreen({ goto, onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [digits, setDigits] = useState(["","","","","",""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = React.useRef([]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSend() {
    setError(""); setInfo("");
    if (!identifier) { setError("Enter your registered email or Employee ID."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/send", { identifier });
      setSent(true);
      setCooldown(30);
      if (data.devCode) setInfo(`Dev mode — no SMS/email provider configured, your OTP is: ${data.devCode}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDigit(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val; setDigits(next);
    if (val && i < 5) inputsRef.current[i+1]?.focus();
  }

  async function handleVerify() {
    setError("");
    const code = digits.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit OTP."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/verify", { identifier, code });
      localStorage.setItem("inglu_token", data.token);
      localStorage.setItem("inglu_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <Card className="p-5">
        <button onClick={()=>goto("login")} className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-xs mb-4"><ArrowLeft size={14}/> Back to login</button>
        <h3 className="f-display text-zinc-100 mb-4">Login with OTP</h3>
        {error && <div className="text-rose-400 text-xs mb-3">{error}</div>}
        {info && <div className="text-lime-300 text-xs mb-3 f-mono">{info}</div>}
        {!sent ? (
          <>
            <Field label="Registered Email / Employee ID">
              <input className={inputCls} placeholder="you@inglu.com or EMP-2025-0087" value={identifier} onChange={(e)=>setIdentifier(e.target.value)}/>
            </Field>
            <Btn className="w-full justify-center" onClick={handleSend} disabled={loading}>{loading ? "Sending…" : "Send OTP"}</Btn>
          </>
        ) : (
          <>
            <Field label="Enter 6-digit OTP">
              <div className="flex gap-2">
                {digits.map((d,i)=>(
                  <input key={i} ref={el=>inputsRef.current[i]=el} maxLength={1} value={d}
                    onChange={(e)=>handleDigit(i, e.target.value)}
                    className={`${inputCls} text-center`}/>
                ))}
              </div>
            </Field>
            <p className="text-xs text-zinc-500 mb-4">
              {cooldown > 0 ? `Resend OTP in 00:${String(cooldown).padStart(2,"0")}` : (
                <button onClick={handleSend} className="text-lime-300 hover:underline">Resend OTP</button>
              )}
            </p>
            <Btn className="w-full justify-center" onClick={handleVerify} disabled={loading}>{loading ? "Verifying…" : "Verify & Login"}</Btn>
          </>
        )}
      </Card>
    </AuthShell>
  );
}

function ForgotScreen({ goto }) {
  const [step, setStep] = useState(1); // 1: request code, 2: set new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequestCode() {
    setError(""); setInfo("");
    if (!email) { setError("Enter your registered email."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/password/forgot", { email });
      setStep(2);
      setInfo(data.devCode ? `Dev mode — your reset code is: ${data.devCode}` : "If that email exists, a reset code has been sent.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError(""); setInfo("");
    if (!code || !newPassword) { setError("Enter the reset code and a new password."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await api.post("/auth/password/reset", { email, code, newPassword });
      setInfo("Password updated! Redirecting to login…");
      setTimeout(()=>goto("login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <Card className="p-5">
        <button onClick={()=>goto("login")} className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-xs mb-4"><ArrowLeft size={14}/> Back to login</button>
        <h3 className="f-display text-zinc-100 mb-1">Reset your password</h3>
        <p className="text-xs text-zinc-500 mb-4">
          {step===1 ? "Enter your registered email and we'll send a reset code." : "Enter the code we sent and choose a new password."}
        </p>
        {error && <div className="text-rose-400 text-xs mb-3">{error}</div>}
        {info && <div className="text-lime-300 text-xs mb-3 f-mono">{info}</div>}
        {step===1 ? (
          <>
            <Field label="Email"><input className={inputCls} placeholder="you@inglu.com" value={email} onChange={(e)=>setEmail(e.target.value)}/></Field>
            <Btn className="w-full justify-center" onClick={handleRequestCode} disabled={loading}>{loading ? "Sending…" : "Send Reset Code"}</Btn>
          </>
        ) : (
          <>
            <Field label="Reset Code"><input className={inputCls} placeholder="6-digit code" value={code} onChange={(e)=>setCode(e.target.value)}/></Field>
            <Field label="New Password"><input type="password" className={inputCls} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/></Field>
            <Field label="Confirm Password"><input type="password" className={inputCls} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/></Field>
            <Btn className="w-full justify-center" onClick={handleReset} disabled={loading}>{loading ? "Updating…" : "Update Password"}</Btn>
          </>
        )}
      </Card>
    </AuthShell>
  );
}

function SignupScreen({ goto, onLogin }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirmPassword:"", department:"", designation:"", employmentType:"Full-Time" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSignup() {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Name, email and password are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      localStorage.setItem("inglu_token", data.token);
      localStorage.setItem("inglu_user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 f-display text-2xl text-zinc-50 mb-1">
          <div className="w-8 h-8 rounded-lg bg-lime-300 text-zinc-950 flex items-center justify-center font-bold">i</div>
          INGLU EMS
        </div>
        <p className="text-zinc-500 text-sm">Create your account</p>
      </div>
      <Card className="p-5">
        <button onClick={()=>goto("login")} className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-xs mb-4"><ArrowLeft size={14}/> Back to login</button>
        {error && <div className="text-rose-400 text-xs mb-3">{error}</div>}
        <Field label="Full Name"><input className={inputCls} value={form.name} onChange={(e)=>set("name", e.target.value)}/></Field>
        <Field label="Email"><input className={inputCls} value={form.email} onChange={(e)=>set("email", e.target.value)}/></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e)=>set("phone", e.target.value)}/></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Department"><input className={inputCls} value={form.department} onChange={(e)=>set("department", e.target.value)}/></Field>
          <Field label="I am joining as">
            <select className={inputCls} value={form.employmentType} onChange={(e)=>set("employmentType", e.target.value)}>
              <option value="Full-Time">Full-Time Employee</option>
              <option value="Intern">Intern</option>
            </select>
          </Field>
        </div>
        <Field label="Password"><input type="password" className={inputCls} value={form.password} onChange={(e)=>set("password", e.target.value)}/></Field>
        <Field label="Confirm Password"><input type="password" className={inputCls} value={form.confirmPassword} onChange={(e)=>set("confirmPassword", e.target.value)}/></Field>
        <Btn className="w-full justify-center" onClick={handleSignup} disabled={loading}>{loading ? "Creating account…" : "Create Account"}</Btn>
      </Card>
    </AuthShell>
  );
}

function FirstTimeScreen({ onDone }) {
  const [step, setStep] = useState(1);
  return (
    <AuthShell>
      <Card className="p-5">
        <div className="flex gap-1.5 mb-4">
          {[1,2,3].map(s=><div key={s} className={`h-1 flex-1 rounded-full ${s<=step?"bg-lime-300":"bg-zinc-800"}`}/>)}
        </div>
        <h3 className="f-display text-zinc-100 mb-4">Welcome to INGLU, Riya! ({step}/3)</h3>
        {step===1 && <>
          <Field label="New password"><input type="password" className={inputCls}/></Field>
          <Field label="Confirm password"><input type="password" className={inputCls}/></Field>
        </>}
        {step===2 && <>
          <Field label="Phone"><input className={inputCls}/></Field>
          <Field label="Emergency Contact"><input className={inputCls}/></Field>
          <Field label="Address"><input className={inputCls}/></Field>
        </>}
        {step===3 && <>
          <Field label="ID Proof"><Btn variant="secondary" icon={Upload} className="w-full justify-center">Upload</Btn></Field>
          <Field label="Address Proof"><Btn variant="secondary" icon={Upload} className="w-full justify-center">Upload</Btn></Field>
          <Field label="Bank Passbook / Cancelled Cheque"><Btn variant="secondary" icon={Upload} className="w-full justify-center">Upload</Btn></Field>
        </>}
        <div className="flex gap-2 mt-4">
          {step>1 && <Btn variant="secondary" onClick={()=>setStep(step-1)}>Back</Btn>}
          {step<3 ? <Btn className="flex-1 justify-center" onClick={()=>setStep(step+1)}>Next</Btn>
                  : <Btn className="flex-1 justify-center" onClick={onDone}>Finish</Btn>}
        </div>
      </Card>
    </AuthShell>
  );
}

/* ============================== APP SHELL ============================== */

function Sidebar({ active, setActive, role, collapsed, setCollapsed }) {
  const visible = NAV.filter(n => !n.roles || n.roles.includes(role));
  const grouped = GROUP_ORDER.map(g => ({ g, items: visible.filter(n=>n.group===g) }));
  const top = visible.filter(n=>!n.group && n.id==="dashboard");
  const bottom = visible.filter(n=>!n.group && n.id!=="dashboard");

  return (
    <div className={`${collapsed?"w-16":"w-64"} shrink-0 bg-zinc-900/60 border-r border-zinc-800 flex flex-col transition-all h-screen sticky top-0`}>
      <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-800">
        {!collapsed && <div className="flex items-center gap-2 f-display text-zinc-100">
          <div className="w-6 h-6 rounded bg-lime-300 text-zinc-950 flex items-center justify-center font-bold text-xs">i</div>
          INGLU EMS
        </div>}
        <button onClick={()=>setCollapsed(!collapsed)} className="text-zinc-500 hover:text-zinc-200"><Menu size={16}/></button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {top.map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} collapsed={collapsed} />)}
        {grouped.map(({g,items}) => items.length>0 && (
          <div key={g} className="mt-4">
            {!collapsed && <div className="px-4 text-[10px] tracking-wider text-zinc-600 font-semibold mb-1">{g}</div>}
            {items.map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} collapsed={collapsed} />)}
          </div>
        ))}
        <div className="mt-4 border-t border-zinc-800 pt-2">
          {bottom.map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} collapsed={collapsed} />)}
        </div>
      </div>
      <div className="border-t border-zinc-800 p-3 flex items-center gap-2">
        <Avatar name={role==="Intern"?"Riya Sharma":"Nandini Kapoor"} size={30}/>
        {!collapsed && <div className="min-w-0">
          <div className="text-sm text-zinc-200 truncate">{role==="Intern"?"Riya Sharma":"Nandini Kapoor"}</div>
          <div className="text-[11px] text-zinc-500 truncate">{role}</div>
        </div>}
      </div>
    </div>
  );
}

function NavItem({ item, active, setActive, collapsed }) {
  const Icon = item.icon;
  const isActive = active===item.id;
  return (
    <button onClick={()=>setActive(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive ? "bg-lime-300/10 text-lime-300 border-r-2 border-lime-300" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"}`}>
      <Icon size={16} className="shrink-0"/>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  );
}

function Topbar({ role, setRole, onLogout, screenLabel }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showRole, setShowRole] = useState(false);
  return (
    <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-5 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-zinc-600"/>
          <input placeholder="Search... (⌘K)" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-lime-300/40"/>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={()=>setShowRole(!showRole)} className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:border-zinc-600">
            <ShieldCheck size={13} className="text-lime-300"/> Preview: {role} <ChevronDown size={12}/>
          </button>
          {showRole && (
            <div className="absolute right-0 mt-1 w-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl anim-in z-40">
              {ROLES.map(r => (
                <button key={r} onClick={()=>{setRole(r); setShowRole(false);}} className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 ${r===role?"text-lime-300":"text-zinc-300"}`}>{r}</button>
              ))}
            </div>
          )}
        </div>
        <button className="text-zinc-400 hover:text-zinc-100"><Plus size={18}/></button>
        <div className="relative">
          <button onClick={()=>setShowNotif(!showNotif)} className="relative text-zinc-400 hover:text-zinc-100">
            <Bell size={18}/><span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] flex items-center justify-center text-white">3</span>
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl anim-in z-40 p-2">
              <div className="text-xs text-zinc-500 px-2 py-1">Notifications</div>
              {["Leave approved for Karan Mehta","New candidate applied — Content Intern","Payroll run ready for review"].map((n,i)=>(
                <div key={i} className="px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded">{n}</div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onLogout} className="text-zinc-500 hover:text-rose-300"><LogOut size={17}/></button>
      </div>
    </div>
  );
}

/* ============================== DASHBOARDS ============================== */

function DashboardFounder() {
  return (
    <div>
      <SectionHeader title="Good morning, Aditi" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Headcount" value="142" sub="+6 this month" tone="lime"/>
        <StatCard label="Attendance Today" value="91%" tone="violet"/>
        <StatCard label="Open Leads" value="38" sub="▲12%" tone="amber"/>
        <StatCard label="Revenue MTD" value="₹42.8L" sub="▲8% vs LM" tone="lime"/>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-zinc-300 mb-3 f-display">Department Status</div>
          {["Campus Marketing","Sales","Content","Ops/IT"].map((d,i)=>(
            <div key={d} className="flex items-center gap-3 mb-2">
              <span className="text-xs text-zinc-500 w-32">{d}</span>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-lime-300" style={{width:`${70+i*7}%`}}/></div>
              <span className="text-xs text-zinc-400">{70+i*7}%</span>
            </div>
          ))}
        </Card>
        <Card className="p-4">
          <div className="text-sm text-zinc-300 mb-3 f-display">Recent Announcements</div>
          {ANNOUNCEMENTS.map((a,i)=>(
            <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-zinc-300">
              {a.pin && <Badge tone="lime">Pinned</Badge>} {a.title}
            </div>
          ))}
        </Card>
      </div>
      <Card className="p-4 mt-4">
        <div className="text-sm text-zinc-300 f-display mb-1">Pending Approvals Requiring Founder Override</div>
        <div className="text-zinc-500 text-sm">No overrides pending — everything is flowing through normal approval chains.</div>
      </Card>
    </div>
  );
}

function DashboardHR() {
  return (
    <div>
      <SectionHeader title="HR Dashboard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Open Roles" value="5" tone="violet"/>
        <StatCard label="Pending Interviews" value="9" tone="amber"/>
        <StatCard label="Leave Requests" value="14" tone="lime"/>
        <StatCard label="Onboarding In Progress" value="3" tone="lime"/>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-zinc-300 f-display mb-3">Attendance Exceptions Today</div>
          <Table columns={["Name","Dept","Issue"]} rows={[
            <tr key="1"><Td>Karan Mehta</Td><Td>Sales</Td><Td><Badge tone="amber">Late mark</Badge></Td></tr>,
            <tr key="2"><Td>Riya Sharma</Td><Td>Marketing</Td><Td><Badge tone="rose">Absent</Badge></Td></tr>,
          ]}/>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-zinc-300 f-display mb-3">Documents Pending Upload</div>
          {["Riya Sharma — Bank Passbook","Ishaan Rathi — ID Proof"].map((d,i)=><div key={i} className="text-sm text-zinc-400 py-1.5">{d}</div>)}
        </Card>
      </div>
    </div>
  );
}

function DashboardManager({ role }) {
  return (
    <div>
      <SectionHeader title={`${role} Dashboard`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Team Size" value="12" tone="violet"/>
        <StatCard label="Today's Attendance" value="10/12" tone="lime"/>
        <StatCard label="Pending Approvals" value="4" tone="amber"/>
        <StatCard label="Team Avg Score" value="8.2/10" tone="lime"/>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-zinc-300 f-display mb-3">Team Task Board Snapshot</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {Object.entries(TASKS).slice(0,3).map(([k,v])=>(
              <div key={k} className="bg-zinc-800/60 rounded-lg p-2"><div className="text-zinc-500">{k}</div><div className="f-display text-lime-300 text-lg">{v.length}</div></div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-zinc-300 f-display mb-3">Social Submission Status (Today)</div>
          {SOCIAL_QUEUE.map((s,i)=><div key={i} className="flex justify-between text-sm py-1.5"><span className="text-zinc-300">{s.name} · {s.platform}</span><Badge tone="amber">{s.status}</Badge></div>)}
        </Card>
      </div>
    </div>
  );
}

function DashboardSelf({ role }) {
  return (
    <div>
      <SectionHeader title={role==="Intern" ? "Hi Riya!" : "Hi there!"} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-zinc-500 text-xs mb-2">My Attendance</div><Btn size="sm">Clock In</Btn></Card>
        <StatCard label="Leave Balance" value="12 days" tone="lime"/>
        <StatCard label="Tasks Due Today" value="3" tone="amber"/>
        <Card className="p-4"><div className="text-zinc-500 text-xs mb-2">This Month's Payslip</div><Btn size="sm" variant="secondary">View</Btn></Card>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4"><div className="text-sm text-zinc-300 f-display mb-2">My Performance Score</div><div className="f-display text-3xl text-lime-300">8.2<span className="text-sm text-zinc-500">/10</span></div></Card>
        <Card className="p-4"><div className="text-sm text-zinc-300 f-display mb-2">Birthday Calendar</div><div className="text-sm text-zinc-400 flex items-center gap-2"><Cake size={14}/> Karan — 14 Jul</div></Card>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Btn icon={Plus}>Submit Daily Report</Btn>
        <Btn variant="secondary" icon={Plus}>Apply Leave</Btn>
        <Btn variant="secondary" icon={Plus}>Submit Social Post</Btn>
      </div>
    </div>
  );
}

function Dashboard({ role }) {
  if (role==="Founder") return <DashboardFounder/>;
  if (role==="HR" || role==="Super Admin") return <DashboardHR/>;
  if (role==="Dept Head" || role==="Team Lead") return <DashboardManager role={role}/>;
  return <DashboardSelf role={role}/>;
}

/* ============================== MY WORK MODULES ============================== */

function TasksScreen() {
  const [view, setView] = useState("Board");
  return (
    <div>
      <SectionHeader title="Tasks — Marketing Team" action={
        <div className="flex gap-2">
          {["Board","List","Calendar"].map(v=><Btn key={v} size="sm" variant={view===v?"primary":"secondary"} onClick={()=>setView(v)}>{v}</Btn>)}
          <Btn size="sm" icon={Plus}>New Task</Btn>
        </div>
      }/>
      {view==="Board" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Object.entries(TASKS).map(([col, items]) => (
            <div key={col} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 min-h-[160px]">
              <div className="text-xs text-zinc-500 font-medium px-1 pb-2">{col} ({items.length})</div>
              {items.map((t,i)=>(
                <Card key={i} className="p-2.5 mb-2">
                  <div className="text-sm text-zinc-200 mb-1">{t.t}</div>
                  <div className="flex items-center justify-between">
                    <Badge tone={t.p==="High"?"rose":t.p==="Med"?"amber":"zinc"}>{t.p}</Badge>
                    <span className="text-[11px] text-zinc-500">{t.due}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2"><Avatar name={t.who} size={18}/><span className="text-[11px] text-zinc-500">{t.who}</span></div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}
      {view==="List" && (
        <Card className="p-2">
          <Table columns={["Task","Assignee","Priority","Due Date","Status"]} rows={
            Object.entries(TASKS).flatMap(([status,items])=>items.map((t,i)=>(
              <tr key={status+i}><Td>{t.t}</Td><Td>{t.who}</Td><Td><Badge tone={t.p==="High"?"rose":"zinc"}>{t.p}</Badge></Td><Td>{t.due}</Td><Td><Badge tone="lime">{status}</Badge></Td></tr>
            )))
          }/>
        </Card>
      )}
      {view==="Calendar" && <Card className="p-6 text-center text-zinc-500 text-sm">Monthly calendar grid with tasks plotted on their due dates.</Card>}
    </div>
  );
}

function TimesheetScreen() {
  const [rows, setRows] = useState([
    { time:"10:00–11:30 AM", task:"BrandX Reel Script", hrs:"1.5h" },
    { time:"11:30–1:00 PM", task:"Team Standup + Content Review", hrs:"1.5h" },
    { time:"2:00–4:30 PM", task:"Select task/client…", hrs:"2.5h" },
    { time:"4:30–7:00 PM", task:"Select task/client…", hrs:"2.5h" },
  ]);
  const [showGate, setShowGate] = useState(false);
  return (
    <div>
      <SectionHeader title="Timesheet — 13 Jul 2026 (Office Hours 10:00 AM – 7:00 PM)" action={<Btn size="sm" icon={Plus}>Add Entry</Btn>}/>
      <Card className="p-2 mb-3">
        <Table columns={["Time","Task / Client / Project","Hours","Notes",""]} rows={rows.map((r,i)=>(
          <tr key={i}><Td>{r.time}</Td><Td>{r.task}</Td><Td>{r.hrs}</Td><Td><input className={`${inputCls} py-1`} placeholder="—"/></Td><Td><MoreHorizontal size={14} className="text-zinc-500"/></Td></tr>
        ))}/>
      </Card>
      <Card className="p-3 mb-4 flex items-center gap-2 border-amber-500/30">
        <AlertTriangle size={16} className="text-amber-400"/>
        <span className="text-sm text-amber-300">Gap detected: 1:00–2:00 PM unaccounted (lunch/break?)</span>
        <Btn size="sm" variant="secondary" className="ml-auto">Mark as Break</Btn>
      </Card>
      <div className="flex gap-2">
        <Btn onClick={()=>setShowGate(false)}>Submit Timesheet</Btn>
        <Btn variant="secondary" onClick={()=>setShowGate(true)}>Try Clock Out (unsubmitted)</Btn>
      </div>
      {showGate && (
        <Modal title="Clock Out Blocked" onClose={()=>setShowGate(false)}>
          <div className="flex items-center gap-2 text-amber-300 mb-3"><AlertTriangle size={18}/> You must fill today's Timesheet before you can clock out.</div>
          <p className="text-sm text-zinc-500 mb-4">This is enforced server-side on the clock-out endpoint — it can't be bypassed from web, mobile, or direct API calls.</p>
          <Btn className="w-full justify-center" onClick={()=>setShowGate(false)}>Fill Timesheet Now</Btn>
        </Modal>
      )}
    </div>
  );
}

function DailyReportScreen() {
  const [tab, setTab] = useState("Submit");
  return (
    <div>
      <SectionHeader title="Daily Work Report" />
      <Tabs tabs={["Submit","Manager Review Queue"]} active={tab} onChange={setTab}/>
      {tab==="Submit" ? (
        <Card className="p-4 max-w-xl">
          <Field label="Today's Work Summary"><textarea className={inputCls} rows={3}/></Field>
          <Field label="Completed Tasks"><input className={inputCls} placeholder="+ pick from Task list"/></Field>
          <Field label="Pending Tasks"><input className={inputCls} placeholder="+ pick from Task list"/></Field>
          <Field label="Tomorrow's Plan"><textarea className={inputCls} rows={2}/></Field>
          <Field label="Challenges Faced"><textarea className={inputCls} rows={2}/></Field>
          <Btn icon={Upload} variant="secondary" className="mb-3">Attach file</Btn>
          <Btn className="w-full justify-center">Submit Report</Btn>
          <p className="text-[11px] text-zinc-600 mt-2">A reminder fires automatically at 6:00 PM if not submitted.</p>
        </Card>
      ) : (
        <Card className="p-2">
          <Table columns={["Name","Status","Time","Action"]} rows={[
            <tr key="1"><Td>Karan Mehta</Td><Td><Badge tone="lime">Submitted</Badge></Td><Td>6:45 PM</Td><Td><Btn size="sm" variant="secondary">Review</Btn></Td></tr>,
            <tr key="2"><Td>Priya Desai</Td><Td><Badge tone="rose">Not submitted</Badge></Td><Td>—</Td><Td><Btn size="sm" variant="secondary">Nudge</Btn></Td></tr>,
          ]}/>
        </Card>
      )}
    </div>
  );
}

function SocialScreen() {
  const [tab, setTab] = useState("Submit");
  return (
    <div>
      <SectionHeader title="Social Media Submission" />
      <Tabs tabs={["Submit","Approval Queue"]} active={tab} onChange={setTab}/>
      {tab==="Submit" ? (
        <Card className="p-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform"><select className={inputCls}><option>Instagram</option><option>LinkedIn</option></select></Field>
            <Field label="Type"><select className={inputCls}><option>Reel</option><option>Post</option><option>Story</option></select></Field>
          </div>
          <Field label="Post/Story Link"><input className={inputCls}/></Field>
          <Field label="Google Drive Link (raw file)"><input className={inputCls}/></Field>
          <Field label="Screenshot Proof"><Btn variant="secondary" icon={Upload}>Upload</Btn></Field>
          <Field label="Caption used"><textarea className={inputCls} rows={2}/></Field>
          <Btn className="w-full justify-center mb-4">Submit for Approval</Btn>
          <div className="text-xs text-zinc-500 mb-2">Today's Submissions</div>
          <div className="flex items-center gap-2 text-sm text-lime-300 mb-1"><CheckCircle2 size={14}/> Instagram Reel — Submitted 2:15 PM — Pending Review</div>
          <div className="flex items-center gap-2 text-sm text-amber-300"><AlertTriangle size={14}/> LinkedIn Post — Not submitted (Due by 6 PM)</div>
        </Card>
      ) : (
        <Card className="p-2">
          <Table columns={["Name","Platform","Link","Status","Action"]} rows={SOCIAL_QUEUE.map((s,i)=>(
            <tr key={i}><Td>{s.name}</Td><Td>{s.platform}</Td><Td><span className="text-lime-300 flex items-center gap-1 cursor-pointer"><Link2 size={12}/> Open</span></Td><Td><Badge tone="amber">{s.status}</Badge></Td>
            <Td><div className="flex gap-1"><Btn size="sm" variant="secondary" icon={Check}>Approve</Btn><Btn size="sm" variant="danger" icon={XCircle}>Reject</Btn></div></Td></tr>
          ))}/>
        </Card>
      )}
    </div>
  );
}

function LeavesScreen({ role }) {
  const [tab, setTab] = useState("Apply");
  const isManager = ["Founder","HR","Dept Head","Team Lead","Super Admin"].includes(role);
  return (
    <div>
      <SectionHeader title="Leave Management" />
      <Tabs tabs={isManager? ["Apply","Approval Queue","Holiday Calendar"] : ["Apply","Holiday Calendar"]} active={tab} onChange={setTab}/>
      {tab==="Apply" && (
        <Card className="p-4 max-w-md">
          <Field label="Leave Type"><select className={inputCls}><option>Casual (Balance: 8 days)</option><option>Sick</option><option>Earned</option></select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From"><input type="date" className={inputCls}/></Field>
            <Field label="To"><input type="date" className={inputCls}/></Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 mb-3"><input type="checkbox" className="accent-lime-300"/> Half day?</label>
          <Field label="Reason"><textarea className={inputCls} rows={2}/></Field>
          <Btn variant="secondary" icon={Upload} className="mb-3">Attach document (optional)</Btn>
          <Btn className="w-full justify-center">Submit</Btn>
        </Card>
      )}
      {tab==="Approval Queue" && (
        <Card className="p-2">
          <Table columns={["Name","Type","Dates","Balance","Action"]} rows={LEAVE_QUEUE.map((l,i)=>(
            <tr key={i}><Td>{l.name}</Td><Td>{l.type}</Td><Td>{l.dates}</Td><Td>{l.balance}</Td>
            <Td><div className="flex gap-1"><Btn size="sm" variant="secondary" icon={Check}/><Btn size="sm" variant="danger" icon={XCircle}/><Btn size="sm" variant="ghost" icon={MessageSquare}/></div></Td></tr>
          ))}/>
        </Card>
      )}
      {tab==="Holiday Calendar" && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
            <div>26 Jan — Republic Day</div><div>15 Aug — Independence Day</div>
            <div>02 Oct — Gandhi Jayanti</div><div>25 Dec — Christmas</div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================== PEOPLE MODULES ============================== */

function DirectoryScreen({ onOpenProfile }) {
  return (
    <div>
      <SectionHeader title="Employee Directory" action={<Btn size="sm" icon={Filter} variant="secondary">Filter</Btn>}/>
      <Card className="p-2">
        <Table columns={["Name","ID","Department","Designation","Type","Status",""]} rows={EMPLOYEES.map((e,i)=>(
          <tr key={i} className="hover:bg-zinc-800/40 cursor-pointer" onClick={()=>onOpenProfile(e)}>
            <Td><div className="flex items-center gap-2"><Avatar name={e.name} size={26}/>{e.name}</div></Td>
            <Td><IdTag id={e.id}/></Td><Td>{e.dept}</Td><Td>{e.designation}</Td>
            <Td><Badge tone={e.type==="Intern"?"violet":"zinc"}>{e.type}</Badge></Td>
            <Td><Badge tone="lime">{e.status}</Badge></Td>
            <Td><ChevronRight size={14} className="text-zinc-600"/></Td>
          </tr>
        ))}/>
      </Card>
    </div>
  );
}

function EmployeeProfileModal({ employee, onClose }) {
  const tabs = ["Personal","Professional","Bank","Documents","Salary","Attendance","Leaves","Performance","Assets","Projects","Training","Activity Log"];
  const [tab, setTab] = useState("Personal");
  return (
    <Modal title="" onClose={onClose} wide>
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={employee.name} size={48}/>
        <div>
          <div className="f-display text-lg text-zinc-100">{employee.name} <span className="text-zinc-500 text-sm font-normal">· {employee.designation}</span></div>
          <div className="flex items-center gap-2 mt-1"><IdTag id={employee.id}/><span className="text-xs text-zinc-500">Joined {employee.joined}</span><Badge tone="lime">{employee.status}</Badge></div>
        </div>
      </div>
      <Tabs tabs={tabs} active={tab} onChange={setTab}/>
      <div className="text-sm text-zinc-300">
        {tab==="Personal" && <div className="grid grid-cols-2 gap-3">
          <div><span className="text-zinc-500 text-xs block">DOB</span>12 Mar 2003</div>
          <div><span className="text-zinc-500 text-xs block">Phone</span>+91 9XXXXXXXXX</div>
          <div><span className="text-zinc-500 text-xs block">Personal Email</span>{employee.name.split(" ")[0].toLowerCase()}@mail.com</div>
          <div><span className="text-zinc-500 text-xs block">Blood Group</span>O+</div>
          <div className="col-span-2"><span className="text-zinc-500 text-xs block">Address</span>Delhi, India</div>
        </div>}
        {tab==="Professional" && <div className="grid grid-cols-2 gap-3">
          <div><span className="text-zinc-500 text-xs block">Department</span>{employee.dept}</div>
          <div><span className="text-zinc-500 text-xs block">Reporting Manager</span>Nandini Kapoor</div>
          <div><span className="text-zinc-500 text-xs block">Employment Type</span>{employee.type}</div>
          <div><span className="text-zinc-500 text-xs block">Work Location</span>Delhi Office</div>
        </div>}
        {tab==="Bank" && <div className="grid grid-cols-2 gap-3">
          <div><span className="text-zinc-500 text-xs block">Account Number</span>•••• •••• 4821</div>
          <div><span className="text-zinc-500 text-xs block">IFSC</span>HDFC0001234</div>
          <div><span className="text-zinc-500 text-xs block">PAN</span>AXXXX1234X <button className="text-lime-300 text-xs ml-1">Reveal</button></div>
        </div>}
        {tab==="Documents" && <div className="space-y-2">{["Offer Letter","Appointment Letter","NDA","ID Proof"].map(d=><div key={d} className="flex items-center justify-between bg-zinc-800/50 rounded px-3 py-2"><span>{d}</span><Btn size="sm" variant="ghost" icon={Download}>View</Btn></div>)}</div>}
        {tab==="Salary" && <div className="grid grid-cols-2 gap-3"><div><span className="text-zinc-500 text-xs block">CTC</span>₹4,20,000/yr</div><div><span className="text-zinc-500 text-xs block">Net Monthly</span>₹33,000</div></div>}
        {tab==="Attendance" && <div className="text-zinc-400">19 Present · 2 Late · 1 Absent · 1 Half-day this month.</div>}
        {tab==="Leaves" && <div className="text-zinc-400">Balance: 12 days · 2 requests pending approval.</div>}
        {tab==="Performance" && <div className="f-display text-2xl text-lime-300">8.2/10 <span className="text-sm text-zinc-500 font-normal">Q3 2026</span></div>}
        {tab==="Assets" && <div className="text-zinc-400">LAP-0012 — Laptop, issued 15 Jun 2026.</div>}
        {tab==="Projects" && <div className="text-zinc-400">Rio Bubbly Campus Activation — Content Lead.</div>}
        {tab==="Training" && <div className="text-zinc-400">Onboarding Walkthrough — Completed 16 Jun 2026.</div>}
        {tab==="Activity Log" && <div className="text-zinc-500 text-xs space-y-1"><div>13 Jul, 9:02 AM — Logged in</div><div>10 Jul, 4:15 PM — Profile updated (Phone)</div></div>}
      </div>
    </Modal>
  );
}

function RecruitmentScreen() {
  const [tab, setTab] = useState("Pipeline");
  const [candidate, setCandidate] = useState(null);
  return (
    <div>
      <SectionHeader title="Recruitment (ATS)" action={<Btn size="sm" icon={Plus}>New Role</Btn>}/>
      <Tabs tabs={["Pipeline","Applications","Hiring Analytics"]} active={tab} onChange={setTab}/>
      {tab==="Pipeline" && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(CANDIDATES).map(([stage, list]) => (
            <div key={stage} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 min-h-[140px]">
              <div className="text-xs text-zinc-500 font-medium px-1 pb-2">{stage} ({list.length})</div>
              {list.map((c,i)=>(
                <Card key={i} className="p-2.5 mb-2 cursor-pointer" onClick={()=>setCandidate(c)}>
                  <div className="text-sm text-zinc-200">{c.name}</div>
                  <div className="text-[11px] text-zinc-500">{c.role}</div>
                  <div className="text-[11px] text-zinc-600 mt-1">{c.meta}</div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      )}
      {tab==="Applications" && (
        <Card className="p-2">
          <Table columns={["Name","Role","Applied On","Status","Score",""]} rows={[
            {n:"Riya Sharma",r:"Content Intern",d:"02 Jul",s:"Screened",sc:"8/10"},
            {n:"Karan Vora",r:"Sales Exec",d:"01 Jul",s:"Applied",sc:"—"},
          ].map((c,i)=>(
            <tr key={i} className="cursor-pointer hover:bg-zinc-800/40" onClick={()=>setCandidate({name:c.n, role:c.r, meta:c.s})}>
              <Td>{c.n}</Td><Td>{c.r}</Td><Td>{c.d}</Td><Td><Badge tone="violet">{c.s}</Badge></Td><Td>{c.sc}</Td><Td><ChevronRight size={14} className="text-zinc-600"/></Td>
            </tr>
          ))}/>
        </Card>
      )}
      {tab==="Hiring Analytics" && (
        <div className="grid md:grid-cols-2 gap-4">
          <StatCard label="Time-to-Hire (avg)" value="14 days" tone="lime"/>
          <StatCard label="Offer Acceptance Rate" value="82%" tone="violet"/>
        </div>
      )}
      {candidate && <CandidateModal candidate={candidate} onClose={()=>setCandidate(null)}/>}
    </div>
  );
}

function CandidateModal({ candidate, onClose }) {
  const [showOffer, setShowOffer] = useState(false);
  return (
    <Modal title={`${candidate.name} — ${candidate.role}`} onClose={onClose} wide>
      <Tabs tabs={["Resume","Assignment","Notes"]} active="Resume" onChange={()=>{}}/>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="text-xs text-zinc-500 mb-2">Evaluation Scorecard</div>
          {["Communication","Creativity"].map(k=>(
            <div key={k} className="flex items-center justify-between text-sm text-zinc-300 mb-1">{k} <span className="flex text-amber-300">{Array.from({length:4}).map((_,i)=><Star key={i} size={12} fill="currentColor"/>)}<Star size={12}/></span></div>
          ))}
          <Btn size="sm" variant="secondary" className="mt-2">Submit Scorecard</Btn>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-zinc-500 mb-2">Interview Schedule</div>
          <div className="text-sm text-zinc-300">Fri, 5 Jul · 3:00 PM</div>
          <div className="text-xs text-zinc-500 mb-2">Interviewer: Priya Desai</div>
          <Btn size="sm" variant="secondary">+ Schedule Interview</Btn>
        </Card>
      </div>
      <div className="flex gap-2 mt-4">
        <Btn variant="danger" icon={XCircle}>Reject</Btn>
        <Btn icon={ChevronRight} onClick={()=>setShowOffer(true)}>Move to Offer</Btn>
      </div>
      {showOffer && (
        <Modal title={`Generate Offer — ${candidate.name}`} onClose={()=>setShowOffer(false)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role"><input className={inputCls} defaultValue={candidate.role}/></Field>
            <Field label="Department"><input className={inputCls} defaultValue="Marketing"/></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stipend/CTC"><input className={inputCls}/></Field>
            <Field label="Joining Date"><input type="date" className={inputCls}/></Field>
          </div>
          <Field label="Offer Template"><select className={inputCls}><option>Standard Intern Offer</option><option>Standard FT Offer</option></select></Field>
          <Card className="p-6 text-center text-zinc-600 text-xs mb-3">Live PDF preview panel</Card>
          <Btn className="w-full justify-center">Send Offer for Approval</Btn>
        </Modal>
      )}
    </Modal>
  );
}

function OnboardingScreen() {
  const items = [
    { label:"Employee/Intern ID generated", done:true, meta:"INT-2026-0142" },
    { label:"Offer Letter signed", done:true },
    { label:"Appointment Letter generated", done:true },
    { label:"NDA generated & signed", done:true },
    { label:"Company email created", done:false },
    { label:"Welcome email sent", done:false },
    { label:"Slack invite sent", done:false },
    { label:"Discord invite sent", done:false },
    { label:"ID proof uploaded", done:false },
    { label:"Bank details submitted", done:false },
    { label:"Asset issued (laptop/access card)", done:false },
  ];
  const done = items.filter(i=>i.done).length;
  const pct = Math.round(done/items.length*100);
  return (
    <div>
      <SectionHeader title="Onboarding: Riya Sharma (Content Intern)" action={<Badge tone="lime">{pct}%</Badge>}/>
      <Card className="p-4">
        {items.map((it,i)=>(
          <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/70 last:border-0">
            <div className="flex items-center gap-2 text-sm">
              {it.done ? <CheckCircle2 size={16} className="text-lime-300"/> : <Circle size={16} className="text-zinc-600"/>}
              <span className={it.done ? "text-zinc-300":"text-zinc-500"}>{it.label}</span>
              {it.meta && <IdTag id={it.meta}/>}
            </div>
            {!it.done && <Btn size="sm" variant="secondary">Trigger</Btn>}
          </div>
        ))}
        <Btn className="w-full justify-center mt-4" disabled>Mark as Active Employee</Btn>
      </Card>
    </div>
  );
}

function AttendanceScreen({ role }) {
  const [tab, setTab] = useState("Clock In/Out");
  const isManager = ["Founder","HR","Dept Head","Team Lead","Super Admin"].includes(role);
  return (
    <div>
      <SectionHeader title="Attendance (HRMS)"/>
      <Tabs tabs={isManager ? ["Clock In/Out","Team Timesheets","Calendar","Rules & Analytics"] : ["Clock In/Out","Calendar"]} active={tab} onChange={setTab}/>
      {tab==="Clock In/Out" && (
        <Card className="p-5 max-w-sm">
          <div className="text-xs text-zinc-500 mb-1">Today, 13 Jul 2026</div>
          <div className="text-xs text-zinc-500 mb-4">Office Hours: 10:00 AM – 7:00 PM</div>
          <Btn className="w-full justify-center mb-3">Clock In</Btn>
          <div className="flex items-center gap-2 text-xs text-zinc-500"><Circle size={8} className="text-lime-300 fill-current"/> Office Wi-Fi detected</div>
        </Card>
      )}
      {tab==="Team Timesheets" && (
        <Card className="p-2">
          <Table columns={["Name","Clocked Out","Timesheet","Hours Logged","Action"]} rows={[
            <tr key="1"><Td>Riya Sharma</Td><Td>✅ 7:04 PM</Td><Td><Badge tone="lime">Submitted</Badge></Td><Td>8.0h</Td><Td><Btn size="sm" variant="secondary">View</Btn></Td></tr>,
            <tr key="2"><Td>Karan Mehta</Td><Td>❌ Not yet</Td><Td><Badge tone="rose">Pending</Badge></Td><Td>—</Td><Td><Btn size="sm" variant="secondary">Nudge</Btn></Td></tr>,
          ]}/>
        </Card>
      )}
      {tab==="Calendar" && (
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500 mb-2">{["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=><div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length:28}).map((_,i)=>{
              const tone = [6,13,20].includes(i) ? "bg-rose-500/20 text-rose-300" : i%9===0 ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800/60 text-zinc-400";
              return <div key={i} className={`h-9 rounded flex items-center justify-center text-xs ${tone}`}>{i+1}</div>;
            })}
          </div>
          <div className="flex gap-4 text-xs text-zinc-500 mt-3">Present: 19 &nbsp;Late: 2 &nbsp;Absent: 1 &nbsp;Half-day: 1 &nbsp;Leaves: 3</div>
        </Card>
      )}
      {tab==="Rules & Analytics" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm text-zinc-300 f-display mb-3">Attendance Rules</div>
            <div className="text-sm text-zinc-400 space-y-1">
              <div>Grace period: 15 min</div><div>Late marks before Half-day flag: 3</div>
              <div>Geo-fencing: <Badge tone="lime">ON</Badge> (200m radius)</div><div>IP restriction: <Badge tone="zinc">OFF</Badge></div>
            </div>
          </Card>
          <StatCard label="Org-wide attendance trend" value="91%" sub="30-day average" tone="lime"/>
        </div>
      )}
    </div>
  );
}

function PerformanceScreen() {
  const [tab, setTab] = useState("Review");
  return (
    <div>
      <SectionHeader title="Performance Management"/>
      <Tabs tabs={["OKR Setup","Review"]} active={tab} onChange={setTab}/>
      {tab==="OKR Setup" ? (
        <Card className="p-4 max-w-lg">
          <div className="text-sm text-zinc-300 mb-2">Objective: Grow campus ambassador acquisition</div>
          <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>KR1: Sign 20 new CAs</span><span>12/20</span></div>
          <div className="h-1.5 bg-zinc-800 rounded-full mb-3"><div className="h-full bg-lime-300 rounded-full" style={{width:"60%"}}/></div>
          <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>KR2: Reduce onboarding time</span><span>7d / 5d target</span></div>
          <div className="h-1.5 bg-zinc-800 rounded-full mb-3"><div className="h-full bg-amber-400 rounded-full" style={{width:"70%"}}/></div>
          <Btn size="sm" variant="secondary" icon={Plus}>Add Key Result</Btn>
        </Card>
      ) : (
        <Card className="p-4 max-w-lg">
          <div className="flex gap-6 mb-3">
            <div><div className="text-xs text-zinc-500">KPI Score</div><div className="f-display text-xl text-lime-300">8.2/10</div></div>
            <div><div className="text-xs text-zinc-500">OKR Completion</div><div className="f-display text-xl text-violet-300">78%</div></div>
          </div>
          <Field label="Manager Comments"><textarea className={inputCls} rows={3}/></Field>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-3"><input type="checkbox" className="accent-lime-300"/> Recommend for promotion</label>
          <Btn>Submit Review</Btn>
        </Card>
      )}
    </div>
  );
}

function PayrollScreen({ role }) {
  const canRun = ["Finance","Founder","Super Admin"].includes(role);
  const [tab, setTab] = useState(canRun ? "Monthly Run" : "My Payslips");
  return (
    <div>
      <SectionHeader title="Payroll"/>
      <Tabs tabs={canRun ? ["Monthly Run","Salary Structure","My Payslips"] : ["My Payslips"]} active={tab} onChange={setTab}/>
      {tab==="Monthly Run" && (
        <Card className="p-2">
          <div className="flex justify-between items-center px-3 pt-2 pb-3">
            <span className="f-display text-zinc-100">July 2026</span>
            <Btn size="sm">Run Payroll</Btn>
          </div>
          <Table columns={["Name","Base","Deductions","Bonus","Net Pay"]} rows={PAYROLL_ROWS.map((p,i)=>(
            <tr key={i}><Td>{p.name}</Td><Td>{p.base}</Td><Td className="text-rose-300">{p.ded}</Td><Td className="text-lime-300">{p.bonus}</Td><Td className="font-medium">{p.net}</Td></tr>
          ))}/>
          <div className="flex justify-end gap-2 px-3 py-3"><Btn variant="secondary" size="sm">Export Bank File</Btn><Btn size="sm">Generate Payslips</Btn></div>
        </Card>
      )}
      {tab==="Salary Structure" && (
        <Card className="p-4 max-w-md">
          <div className="text-sm text-zinc-300 mb-3">Karan Mehta — Sales Executive · CTC ₹4,20,000/yr</div>
          {[["Basic","Earning","₹21,000"],["HRA","Earning","₹8,400"],["Special Allowance","Earning","₹5,600"],["PF (Employer)","Deduction","₹1,800"],["PT","Deduction","₹200"]].map((c,i)=>(
            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-zinc-800/70"><span className="text-zinc-400">{c[0]} <Badge tone={c[1]==="Earning"?"lime":"rose"}>{c[1]}</Badge></span><span className="text-zinc-200">{c[2]}</span></div>
          ))}
          <div className="flex justify-between mt-3 f-display text-zinc-100"><span>Net Payable / Month</span><span>₹33,000</span></div>
        </Card>
      )}
      {tab==="My Payslips" && (
        <Card className="p-4 max-w-sm">
          <div className="flex justify-between mb-3"><select className={inputCls + " w-auto"}><option>July 2026</option></select><Btn size="sm" variant="secondary" icon={Download}>Download</Btn></div>
          <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>Basic</span><span>21,000</span></div>
          <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>HRA</span><span>8,400</span></div>
          <div className="flex justify-between text-sm text-rose-300 mb-1"><span>PF</span><span>1,800</span></div>
          <div className="flex justify-between text-sm text-rose-300 mb-3"><span>PT</span><span>200</span></div>
          <div className="flex justify-between f-display text-lime-300 border-t border-zinc-800 pt-2"><span>Net Pay</span><span>₹27,400</span></div>
        </Card>
      )}
    </div>
  );
}

/* ============================== BUSINESS MODULES ============================== */

function CrmScreen() {
  const [tab, setTab] = useState("Pipeline");
  const stages = ["New","Proposal","Negotiation","Won","Lost"];
  return (
    <div>
      <SectionHeader title="CRM" action={<Btn size="sm" icon={Plus}>New Deal</Btn>}/>
      <Tabs tabs={["Pipeline","Clients","Invoices","Contracts"]} active={tab} onChange={setTab}/>
      {tab==="Pipeline" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stages.map(s=>(
            <div key={s} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 min-h-[120px]">
              <div className="text-xs text-zinc-500 font-medium px-1 pb-2">{s}</div>
              {CLIENTS.filter(c=>c.stage===s).map((c,i)=>(
                <Card key={i} className="p-2.5 mb-2"><div className="text-sm text-zinc-200">{c.name}</div><div className="text-[11px] text-zinc-500">{c.value} · {c.owner}</div></Card>
              ))}
            </div>
          ))}
        </div>
      )}
      {tab==="Clients" && (
        <Card className="p-2"><Table columns={["Client","Industry","Owner","Stage","Value"]} rows={CLIENTS.map((c,i)=>(
          <tr key={i}><Td>{c.name}</Td><Td>{c.industry}</Td><Td>{c.owner}</Td><Td><Badge tone="violet">{c.stage}</Badge></Td><Td>{c.value}</Td></tr>
        ))}/></Card>
      )}
      {tab==="Invoices" && (
        <Card className="p-2"><Table columns={["Invoice","Client","Amount","Due","Status"]} rows={[
          <tr key="1"><Td>INV-1042</Td><Td>Rio Bubbly</Td><Td>₹5,00,000</Td><Td>15 Jul</Td><Td><Badge tone="amber">Sent</Badge></Td></tr>
        ]}/></Card>
      )}
      {tab==="Contracts" && <Card className="p-4 text-sm text-zinc-500">Signed contracts and renewal dates by client.</Card>}
    </div>
  );
}

function LeadsScreen() {
  const [lead, setLead] = useState(null);
  return (
    <div>
      <SectionHeader title="Lead Allocation" action={<Badge tone="lime">Round-Robin: ON</Badge>}/>
      <Card className="p-2">
        <Table columns={["Name","Source","Score","Owner","Status","Next F/U",""]} rows={LEADS.map((l,i)=>(
          <tr key={i} className="cursor-pointer hover:bg-zinc-800/40" onClick={()=>setLead(l)}>
            <Td>{l.name}</Td><Td>{l.source}</Td><Td>{l.score}</Td>
            <Td>{l.owner==="Unassigned" ? <Badge tone="rose">Unassigned</Badge> : l.owner}</Td>
            <Td><Badge tone="violet">{l.status}</Badge></Td><Td>{l.nextFU}</Td>
            <Td>{l.owner==="Unassigned" ? <Btn size="sm" onClick={(e)=>e.stopPropagation()}>Assign</Btn> : <ChevronRight size={14} className="text-zinc-600"/>}</Td>
          </tr>
        ))}/>
      </Card>
      {lead && (
        <Modal title={`${lead.name} — Lead Timeline`} onClose={()=>setLead(null)}>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-zinc-300"><Circle size={8} className="fill-lime-300 text-lime-300"/> Lead created — 01 Jul, {lead.source}</div>
            <div className="flex items-center gap-2 text-zinc-300"><Circle size={8} className="fill-violet-400 text-violet-400"/> Assigned to {lead.owner}</div>
            <div className="flex items-center gap-2 text-zinc-300"><Circle size={8} className="fill-amber-400 text-amber-400"/> Call logged — "Interested"</div>
            <div className="flex items-center gap-2 text-zinc-400"><Clock size={12}/> Follow-up reminder — {lead.nextFU}, 10 AM</div>
          </div>
          <Btn size="sm" variant="secondary" className="mt-4">+ Log Activity</Btn>
        </Modal>
      )}
    </div>
  );
}

function OperationsScreen() {
  return (
    <div>
      <SectionHeader title="Operations — Campaigns" action={<Btn size="sm" icon={Plus}>New Campaign</Btn>}/>
      <Card className="p-2">
        <Table columns={["Campaign","Client","Timeline","Budget","Status"]} rows={[
          <tr key="1"><Td>Summer Launch</Td><Td>Rio Bubbly</Td><Td>01–30 Jul</Td><Td>₹5L used / 8L</Td><Td><Badge tone="lime">On Track</Badge></Td></tr>,
          <tr key="2"><Td>Campus Icons Rollout</Td><Td>Rio Bubbly</Td><Td>Jul–Oct</Td><Td>₹2L used / 20L</Td><Td><Badge tone="amber">Kickoff</Badge></Td></tr>,
        ]}/>
      </Card>
    </div>
  );
}

/* ============================== RESOURCES MODULES ============================== */

function AssetsScreen() {
  return (
    <div>
      <SectionHeader title="Asset Management" action={<Btn size="sm" icon={Plus}>Add Asset</Btn>}/>
      <Card className="p-2">
        <Table columns={["Asset ID","Type","Assigned To","Issue Date","Status","Action"]} rows={ASSETS.map((a,i)=>(
          <tr key={i}><Td><IdTag id={a.id}/></Td><Td>{a.type}</Td><Td>{a.assignedTo}</Td><Td>{a.issued}</Td>
          <Td><Badge tone={a.status==="Issued"?"violet":"zinc"}>{a.status}</Badge></Td>
          <Td><Btn size="sm" variant="secondary">{a.status==="Issued"?"Return":"Issue"}</Btn></Td></tr>
        ))}/>
      </Card>
    </div>
  );
}

function KnowledgeBaseScreen() {
  const cats = ["Policies","SOPs","Training Videos","Brand Decks","FAQs"];
  return (
    <div>
      <SectionHeader title="Knowledge Base"/>
      <div className="flex gap-2 mb-4 flex-wrap">{cats.map(c=><Badge key={c} tone="zinc">{c}</Badge>)}</div>
      <div className="grid md:grid-cols-2 gap-3">
        {KB.map((k,i)=>(
          <Card key={i} className="p-3 flex items-center gap-3">
            <BookOpen size={18} className="text-lime-300"/>
            <div><div className="text-sm text-zinc-200">{k.title}</div><div className="text-[11px] text-zinc-500">{k.cat}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsScreen() {
  return (
    <div>
      <SectionHeader title="Announcements" action={<Btn size="sm" icon={Plus}>New Post</Btn>}/>
      <div className="space-y-2">
        {ANNOUNCEMENTS.map((a,i)=>(
          <Card key={i} className="p-3 flex items-center gap-3">
            <Megaphone size={16} className="text-violet-300"/>
            <div className="flex-1"><div className="text-sm text-zinc-200">{a.title}</div><div className="text-[11px] text-zinc-500">{a.date}</div></div>
            {a.pin && <Badge tone="lime">Pinned</Badge>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== REPORTS & SETTINGS ============================== */

function ReportsScreen() {
  const cats = ["Attendance","Timesheet","Payroll","Performance","Leads","Sales","Tasks","Department","Recruitment"];
  const [sel, setSel] = useState("Attendance");
  return (
    <div>
      <SectionHeader title="Reports"/>
      <div className="flex gap-2 mb-4 flex-wrap">{cats.map(c=><Btn key={c} size="sm" variant={sel===c?"primary":"secondary"} onClick={()=>setSel(c)}>{c}</Btn>)}</div>
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <select className={inputCls + " w-auto"}><option>All Departments</option></select>
          <select className={inputCls + " w-auto"}><option>This Month</option></select>
          <Btn size="sm" variant="secondary" icon={Download} className="ml-auto">Export CSV/PDF</Btn>
        </div>
        <div className="text-sm text-zinc-500">{sel} report — filtered table/chart output renders here, pulling from the relevant module's live data.</div>
      </Card>
    </div>
  );
}

function SettingsScreen() {
  const [tab, setTab] = useState("Roles & Permissions");
  const tabs = ["Departments","Designations","Salary Templates","Leave Policies","Attendance Policies","Roles & Permissions","Integrations","Branding","Email Templates","Automation Rules"];
  return (
    <div>
      <SectionHeader title="Settings"/>
      <Tabs tabs={tabs} active={tab} onChange={setTab}/>
      {tab==="Roles & Permissions" ? (
        <Card className="p-4 max-w-md">
          <Field label="Role"><select className={inputCls}><option>Team Lead</option><option>Dept Head</option><option>HR</option></select></Field>
          {["Approve Leave","Approve Tasks","View Team Payroll Summary"].map((p,i)=>(
            <label key={p} className="flex items-center gap-2 text-sm text-zinc-300 mb-2"><input type="checkbox" defaultChecked={i>0} className="accent-lime-300"/> {p}</label>
          ))}
          <Btn className="mt-2">Save Permissions</Btn>
        </Card>
      ) : (
        <Card className="p-6 text-sm text-zinc-500">{tab} configuration lives here — this section is admin-only per the permissions matrix in Section 10.</Card>
      )}
    </div>
  );
}

/* ============================== MAIN APP ============================== */

function AppShell({ onLogout, currentUser }) {
  const [active, setActive] = useState("dashboard");
  const [role, setRole] = useState(currentUser?.role || "Founder");
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const activeMeta = NAV.find(n=>n.id===active);
  // Guard: if current role loses access to active nav, fall back to dashboard
  const allowed = !activeMeta.roles || activeMeta.roles.includes(role);

  return (
    <div className="min-h-screen bg-zinc-950 flex f-body">
      <Sidebar active={active} setActive={setActive} role={role} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar role={role} setRole={setRole} onLogout={onLogout} screenLabel={activeMeta.label}/>
        <div className="p-5 flex-1 overflow-y-auto">
          {!allowed ? (
            <Card className="p-6 text-sm text-zinc-500 flex items-center gap-2"><ShieldCheck size={16}/> The "{role}" role doesn't have access to {activeMeta.label}. Switch role to preview, or pick another module.</Card>
          ) : (
            <>
              {active==="dashboard" && <Dashboard role={role}/>}
              {active==="tasks" && <TasksScreen/>}
              {active==="timesheet" && <TimesheetScreen/>}
              {active==="dailyreport" && <DailyReportScreen/>}
              {active==="social" && <SocialScreen/>}
              {active==="leaves" && <LeavesScreen role={role}/>}
              {active==="directory" && <DirectoryScreen onOpenProfile={setProfile}/>}
              {active==="recruitment" && <RecruitmentScreen/>}
              {active==="onboarding" && <OnboardingScreen/>}
              {active==="attendance" && <AttendanceScreen role={role}/>}
              {active==="performance" && <PerformanceScreen/>}
              {active==="payroll" && <PayrollScreen role={role}/>}
              {active==="crm" && <CrmScreen/>}
              {active==="leads" && <LeadsScreen/>}
              {active==="operations" && <OperationsScreen/>}
              {active==="assets" && <AssetsScreen/>}
              {active==="kb" && <KnowledgeBaseScreen/>}
              {active==="announcements" && <AnnouncementsScreen/>}
              {active==="reports" && <ReportsScreen/>}
              {active==="settings" && <SettingsScreen/>}
            </>
          )}
        </div>
      </div>
      {profile && <EmployeeProfileModal employee={profile} onClose={()=>setProfile(null)}/>}
    </div>
  );
}

export default function INGLU_EMS() {
  const existingToken = typeof window !== "undefined" ? localStorage.getItem("inglu_token") : null;
  const existingUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("inglu_user") || "null") : null;
  const [screen, setScreen] = useState(existingToken && existingUser ? "app" : "login");
  const [currentUser, setCurrentUser] = useState(existingUser);

  function handleLogin(user) {
    setCurrentUser(user);
    setScreen(user.firstLogin ? "firstTime" : "app");
  }

  function handleLogout() {
    localStorage.removeItem("inglu_token");
    localStorage.removeItem("inglu_user");
    setCurrentUser(null);
    setScreen("login");
  }

  return (
    <div className="f-body">
      <style>{FONT_CSS}</style>
      {screen==="login" && <LoginScreen onLogin={handleLogin} goto={setScreen}/>}
      {screen==="signup" && <SignupScreen onLogin={handleLogin} goto={setScreen}/>}
      {screen==="otp" && <OtpScreen onLogin={handleLogin} goto={setScreen}/>}
      {screen==="forgot" && <ForgotScreen goto={setScreen}/>}
      {screen==="firstTime" && <FirstTimeScreen onDone={()=>setScreen("app")}/>}
      {screen==="app" && <AppShell onLogout={handleLogout} currentUser={currentUser}/>}
    </div>
  );
}
