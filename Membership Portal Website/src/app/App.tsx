import { useState } from "react";
import { Toaster } from "sonner";
import { Landing }         from "./components/Landing";
import { LoginPage }       from "./components/LoginPage";
import { GuestPortal }     from "./components/GuestPortal";
import { UserPortal }      from "./components/UserPortal";
import { TrainerPortal }   from "./components/TrainerPortal";
import { TrainerProfiles } from "./components/TrainerProfiles";
import { AdminPanel }      from "./components/AdminPanel";

/* MARKER-MAKE-KIT-INVOKED */

/* ─── SHARED TYPES ──────────────────────────────────────────── */
export type Plan = "STARTER" | "PRO" | "ELITE";
export type Role = "guest" | "starter" | "pro" | "elite" | "trainer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan?: Plan;
  phone?: string;
  trainerId?: number;
  hasUsedFreePass?: boolean;
  joined?: string;
  age?: number;
  height?: number;
}

export interface TrainerData {
  id: number;
  name: string;
  email: string;
  specialty: string;
  rating: number;
  reviews: number;
  sessions: number;
  fee: number;
  exp: string;
  cert: string;
  image: string;
  bio: string;
  available: string[];
  announcements: { id: number; text: string; date: string }[];
  active: boolean;
}

export interface SiteContent {
  heroBadge: string;
  heroHeadline: string;
  heroSubHeadline: string;
  stat1Num: string; stat1Label: string;
  stat2Num: string; stat2Label: string;
  stat3Num: string; stat3Label: string;
  announcementActive: boolean;
  announcement: string;
  pricing: { starter_mo: number; starter_yr: number; pro_mo: number; pro_yr: number; elite_mo: number; elite_yr: number };
  starterFeatures: string[];
  proFeatures: string[];
  eliteFeatures: string[];
  offers: { id: number; title: string; discount: string; expires: string; active: boolean }[];
  blogPosts: { id: number; title: string; excerpt: string; date: string; published: boolean }[];
}

/* ─── INITIAL DATA ──────────────────────────────────────────── */
const INITIAL_TRAINERS: TrainerData[] = [
  { id: 1, name: "Priya Sharma",  email: "priya@ironfit.in",  specialty: "Yoga & Mindfulness",    rating: 4.9, reviews: 312, sessions: 1240, fee: 1200, exp: "8 yrs",  cert: "RYT-500",    image: "photo-1594381898411-846e7d193883", bio: "Certified 500-hr yoga therapist specialising in stress relief and flexibility. Former national-level gymnast. She brings a holistic approach combining breathwork, alignment, and mindfulness to every session.", available: ["Mon 10AM", "Mon 3PM", "Wed 11AM", "Fri 10AM", "Sat 2PM"], announcements: [{ id: 1, text: "New: Sunrise Meditation session every Sunday 6AM – free for ELITE members!", date: "Jun 12" }], active: true },
  { id: 2, name: "Arjun Mehta",   email: "arjun@ironfit.in",  specialty: "Boxing & Kickboxing",   rating: 4.8, reviews: 278, sessions: 980,  fee: 1500, exp: "10 yrs", cert: "NSCA-CPT",   image: "photo-1571019613454-1cb2f99b2d8b", bio: "Ex-state level boxer turned coach. Trains both beginners and competitive fighters with a focus on technique and functional conditioning. His sessions are intense, fun, and results-driven.", available: ["Tue 7AM", "Thu 7AM", "Sat 9AM", "Sun 10AM"], announcements: [], active: true },
  { id: 3, name: "Neha Kapoor",   email: "neha@ironfit.in",   specialty: "Zumba & Dance Fitness", rating: 4.7, reviews: 198, sessions: 756,  fee: 1000, exp: "6 yrs",  cert: "Zumba Intl.", image: "photo-1518611012118-696072aa579a", bio: "Internationally licensed Zumba instructor who believes fitness should feel like a party, not a chore. Certified in Latin rhythms, Bollywood fitness, and dance therapy.", available: ["Mon 12PM", "Wed 4PM", "Fri 6PM", "Sat 11AM"], announcements: [{ id: 1, text: "Bollywood Beats special class added: Saturday July 5, 10AM – 20 spots only!", date: "Jun 10" }], active: true },
  { id: 4, name: "Rahul Nair",    email: "rahul@ironfit.in",  specialty: "HIIT & Strength",       rating: 4.9, reviews: 341, sessions: 1102, fee: 1400, exp: "9 yrs",  cert: "ACE-CPT",    image: "photo-1534438327276-14e5300c3a48", bio: "Strength & conditioning coach focused on science-backed programming for fat loss and athletic performance. Published fitness author and nutrition consultant.", available: ["Tue 6AM", "Thu 6AM", "Sat 7AM", "Sun 8AM"], announcements: [{ id: 1, text: "12-week Fat Loss Challenge starting July 1. Limited to 8 members. DM to register.", date: "Jun 11" }], active: true },
];

const INITIAL_CONTENT: SiteContent = {
  heroBadge: "Mumbai's #1 Fitness Hub",
  heroHeadline: "FORGE YOUR\nBEST SELF\nHERE.",
  heroSubHeadline: "State-of-the-art equipment, world-class trainers, and a community that pushes you beyond your limits.",
  stat1Num: "2,400+", stat1Label: "Active Members",
  stat2Num: "48",     stat2Label: "Weekly Classes",
  stat3Num: "24",     stat3Label: "Expert Trainers",
  announcementActive: true,
  announcement: "🎉 Monsoon Special: 25% OFF Annual memberships — offer ends July 31!",
  pricing: { starter_mo: 999, starter_yr: 8999, pro_mo: 1999, pro_yr: 17999, elite_mo: 3499, elite_yr: 30999 },
  starterFeatures: ["Gym floor access", "Locker room", "2 group classes/month", "Basic health tracking"],
  proFeatures: ["Unlimited gym access", "All group classes", "1 PT session/month", "Full health dashboard", "Priority booking", "WhatsApp alerts"],
  eliteFeatures: ["24/7 gym access", "All group classes", "4 PT sessions/month", "Body composition scans", "2 Guest passes/month", "Dedicated locker", "Nutrition consulting"],
  offers: [
    { id: 1, title: "Monsoon Madness Sale", discount: "25% OFF Annual plan", expires: "Jul 31, 2026", active: true },
    { id: 2, title: "Referral Bonus",        discount: "₹500 credit/referral",  expires: "Ongoing",      active: true },
    { id: 3, title: "Student Discount",      discount: "15% OFF any plan",      expires: "Aug 15, 2026", active: false },
  ],
  blogPosts: [
    { id: 1, title: "5 Reasons to Try Yoga This Monsoon", excerpt: "The rainy season is perfect for slowing down and reconnecting with your body. Here's why yoga is your best workout partner right now.", date: "Jun 10, 2026", published: true },
    { id: 2, title: "What to Eat Before a HIIT Session",  excerpt: "Fuelling correctly can make or break your workout. Our trainer Rahul Nair shares his pre-workout nutrition guide.", date: "Jun 5, 2026", published: true },
    { id: 3, title: "Member Spotlight: Anjali's 12-Week Transformation", excerpt: "From 82kg to 77kg in 8 weeks — Anjali shares her IronFit journey, the struggles, and what kept her going.", date: "May 28, 2026", published: false },
  ],
};

/* Demo accounts */
const DEMO_MEMBERS: AuthUser[] = [
  { id: "U001", name: "Anjali Verma",  email: "anjali@ironfit.in",  role: "pro",     plan: "PRO",     phone: "+91 98765 43210", joined: "Oct 12, 2025", age: 28, height: 165 },
  { id: "U002", name: "Rohan Desai",   email: "rohan@ironfit.in",   role: "elite",   plan: "ELITE",   phone: "+91 97654 32109", joined: "Aug 3, 2025",  age: 34, height: 178 },
  { id: "U003", name: "Sneha Joshi",   email: "sneha@ironfit.in",   role: "starter", plan: "STARTER", phone: "+91 92109 87654", joined: "Apr 8, 2026",  age: 22, height: 160 },
];

/* ─── APP ───────────────────────────────────────────────────── */
type View = "landing" | "login" | "guest" | "user" | "trainer" | "profiles" | "admin";

export default function App() {
  const [view, setView]         = useState<View>("landing");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [trainers, setTrainers] = useState<TrainerData[]>(INITIAL_TRAINERS);
  const [content, setContent]   = useState<SiteContent>(INITIAL_CONTENT);

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    if (user.role === "admin")   setView("admin");
    else if (user.role === "trainer") setView("trainer");
    else if (user.role === "guest")   setView("guest");
    else setView("user");
  };

  const handleLogout = () => {
    setAuthUser(null);
    setView("landing");
  };

  const handleNavigate = (v: string) => {
    if (v === "logout") { handleLogout(); return; }
    setView(v as View);
  };

  const handleUpdateTrainer = (id: number, data: Partial<TrainerData>) => {
    setTrainers(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  };

  return (
    <div className="size-full dark">
      <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", color: "#f0f0f0", fontFamily: "'Inter', sans-serif", fontSize: "13px" } }} />

      {/* Announcement banner */}
      {content.announcementActive && (view === "landing" || view === "profiles") && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-white text-xs text-center py-2 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          {content.announcement}
          <button onClick={() => setContent(p => ({ ...p, announcementActive: false }))} className="ml-4 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className={content.announcementActive && (view === "landing" || view === "profiles") ? "pt-8" : ""}>
        {view === "landing"  && <Landing      onNavigate={handleNavigate} content={content} trainers={trainers} />}
        {view === "login"    && <LoginPage    onLogin={handleLogin} onNavigate={handleNavigate} members={DEMO_MEMBERS} trainers={trainers} />}
        {view === "guest"    && <GuestPortal  user={authUser!} onNavigate={handleNavigate} trainers={trainers} />}
        {view === "user"     && <UserPortal   user={authUser!} onNavigate={handleNavigate} trainers={trainers} />}
        {view === "trainer"  && <TrainerPortal user={authUser!} trainers={trainers} onNavigate={handleNavigate} onUpdateTrainer={handleUpdateTrainer} />}
        {view === "profiles" && <TrainerProfiles trainers={trainers} onNavigate={handleNavigate} authUser={authUser} />}
        {view === "admin"    && <AdminPanel   onNavigate={handleNavigate} content={content} onUpdateContent={setContent} trainers={trainers} onUpdateTrainers={setTrainers} />}
      </div>
    </div>
  );
}
