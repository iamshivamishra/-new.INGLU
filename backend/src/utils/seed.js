import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Announcement from "../models/Announcement.js";
import KBArticle from "../models/KBArticle.js";

const EMPLOYEES = [
  { employeeId:"EMP-2024-0011", name:"Aditi Rao", email:"aditi@inglu.com", role:"Founder", department:"Leadership", designation:"Founder & CEO", employmentType:"Full-Time" },
  { employeeId:"EMP-2025-0060", name:"Devika Nair", email:"devika@inglu.com", role:"Super Admin", department:"Ops/IT", designation:"Ops & Systems Lead", employmentType:"Full-Time" },
  { employeeId:"EMP-2022-0002", name:"Rohan Iyer", email:"rohan@inglu.com", role:"HR", department:"People", designation:"HR Manager", employmentType:"Full-Time" },
  { employeeId:"EMP-2023-0004", name:"Simran Oberoi", email:"simran@inglu.com", role:"Finance", department:"Finance", designation:"Finance Manager", employmentType:"Full-Time" },
  { employeeId:"EMP-2024-0032", name:"Nandini Kapoor", email:"nandini@inglu.com", role:"Dept Head", department:"Campus Marketing", designation:"Sr. Category Manager", employmentType:"Full-Time" },
  { employeeId:"EMP-2025-0091", name:"Priya Desai", email:"priya@inglu.com", role:"Team Lead", department:"Content", designation:"Team Lead, Content", employmentType:"Full-Time" },
  { employeeId:"EMP-2025-0087", name:"Karan Mehta", email:"karan@inglu.com", role:"Employee", department:"Sales", designation:"Sales Executive", employmentType:"Full-Time" },
  { employeeId:"INT-2026-0142", name:"Riya Sharma", email:"riya@inglu.com", role:"Intern", department:"Marketing", designation:"Content Intern", employmentType:"Intern" },
];

const DEFAULT_PASSWORD = "Welcome@123";

async function run() {
  await connectDB();
  await User.deleteMany({});
  await Announcement.deleteMany({});
  await KBArticle.deleteMany({});

  for (const e of EMPLOYEES) {
    await User.create({ ...e, password: DEFAULT_PASSWORD, status: "Active", firstLogin: false });
  }

  await Announcement.create([
    { title: "Office closed 15 Aug — Independence Day", pinned: true },
    { title: "Company Town Hall — 10 Jul, 4 PM", pinned: false },
  ]);

  await KBArticle.create([
    { title: "Leave Policy 2026", category: "Policies" },
    { title: "Social Media SOP", category: "SOPs" },
    { title: "Onboarding Walkthrough", category: "Training Videos" },
    { title: "INGLU Brand Guidelines", category: "Brand Decks" },
  ]);

  console.log("Seed complete. All users' password:", DEFAULT_PASSWORD);
  console.log("Login with employeeId or email, e.g. EMP-2024-0011 / aditi@inglu.com");
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
