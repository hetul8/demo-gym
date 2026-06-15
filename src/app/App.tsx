"use client";

import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Landing }         from "./components/Landing";
import { LoginPage }       from "./components/LoginPage";
import { GuestPortal }     from "./components/GuestPortal";
import { UserPortal }      from "./components/UserPortal";
import { TrainerPortal }   from "./components/TrainerPortal";
import { TrainerProfiles } from "./components/TrainerProfiles";
import { AdminPanel }      from "./components/AdminPanel";

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
  status?: "active" | "expired" | "blocked";
  expires?: string;
  revenue?: number;
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

export interface BrandSettings {
  name: string;
  logoUrl: string;
  phone: string;
  email: string;
}

export interface BroadcastMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  targetGroup: "ALL" | "UNPAID" | "ACTIVE";
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

const DEFAULT_MEMBERS: AuthUser[] = [
  { id: "U001", name: "Anjali Verma",  email: "anjali@ironfit.in",  role: "pro",     plan: "PRO",     phone: "+91 98765 43210", joined: "Oct 12, 2025", age: 28, height: 165, status: "active", expires: "Jun 18, 2026", revenue: 33687 },
  { id: "U002", name: "Rohan Desai",   email: "rohan@ironfit.in",   role: "elite",   plan: "ELITE",   phone: "+91 97654 32109", joined: "Aug 3, 2025",  age: 34, height: 178, status: "active", expires: "Aug 3, 2026",  revenue: 30999 },
  { id: "U003", name: "Sneha Joshi",   email: "sneha@ironfit.in",   role: "starter", plan: "STARTER", phone: "+91 92109 87654", joined: "Apr 8, 2026",  age: 22, height: 160, status: "active", expires: "Jul 8, 2026",  revenue: 2997 },
];

const INITIAL_BRAND_SETTINGS: BrandSettings = {
  name: "IronFit Gym",
  logoUrl: "",
  phone: "919876543210",
  email: "info@ironfit.in",
};

/* ─── APP ───────────────────────────────────────────────────── */
type View = "landing" | "login" | "guest" | "user" | "trainer" | "profiles" | "admin";

export default function App() {
  const [view, setView]         = useState<View>("landing");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Reactive states persisted to localStorage
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [content, setContent]   = useState<SiteContent>(INITIAL_CONTENT);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(INITIAL_BRAND_SETTINGS);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate states from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMembers = localStorage.getItem("gym_members");
      setMembers(storedMembers ? JSON.parse(storedMembers) : DEFAULT_MEMBERS);

      const storedTrainers = localStorage.getItem("gym_trainers");
      setTrainers(storedTrainers ? JSON.parse(storedTrainers) : INITIAL_TRAINERS);

      const storedContent = localStorage.getItem("gym_content");
      setContent(storedContent ? JSON.parse(storedContent) : INITIAL_CONTENT);

      const storedBrand = localStorage.getItem("gym_brand_settings");
      setBrandSettings(storedBrand ? JSON.parse(storedBrand) : INITIAL_BRAND_SETTINGS);

      const storedBroadcasts = localStorage.getItem("gym_broadcasts");
      setBroadcasts(storedBroadcasts ? JSON.parse(storedBroadcasts) : []);

      // Restore active user session if exists
      const storedUser = localStorage.getItem("gym_active_user");
      if (storedUser) {
        setAuthUser(JSON.parse(storedUser));
      }

      setIsLoaded(true);
    }
  }, []);

  // Save states to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_members", JSON.stringify(members));
    }
  }, [members, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_trainers", JSON.stringify(trainers));
    }
  }, [trainers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_content", JSON.stringify(content));
    }
  }, [content, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_brand_settings", JSON.stringify(brandSettings));
    }
  }, [brandSettings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_broadcasts", JSON.stringify(broadcasts));
    }
  }, [broadcasts, isLoaded]);

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("gym_active_user", JSON.stringify(user));
    }
    
    if (user.role === "admin")   setView("admin");
    else if (user.role === "trainer") setView("trainer");
    else if (user.role === "guest")   setView("guest");
    else setView("user");
  };

  const handleLogout = () => {
    setAuthUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("gym_active_user");
    }
    setView("landing");
  };

  const handleNavigate = (v: string) => {
    if (v === "logout") { handleLogout(); return; }
    setView(v as View);
  };

  const handleUpdateTrainer = (id: number, data: Partial<TrainerData>) => {
    setTrainers(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-white/10 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-white/60">Loading Gym Portal...</p>
        </div>
      </div>
    );
  }

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
        {view === "landing"  && (
          <Landing
            onNavigate={handleNavigate}
            content={content}
            trainers={trainers}
            brandSettings={brandSettings}
          />
        )}
        {view === "login"    && (
          <LoginPage
            onLogin={handleLogin}
            onNavigate={handleNavigate}
            members={members}
            setMembers={setMembers}
            trainers={trainers}
            brandSettings={brandSettings}
          />
        )}
        {view === "guest"    && (
          <GuestPortal
            user={authUser!}
            onNavigate={handleNavigate}
            trainers={trainers}
            broadcasts={broadcasts}
            brandSettings={brandSettings}
            setMembers={setMembers}
            onUpdateUser={setAuthUser}
          />
        )}
        {view === "user"     && (
          <UserPortal
            user={authUser!}
            onNavigate={handleNavigate}
            trainers={trainers}
            broadcasts={broadcasts}
            brandSettings={brandSettings}
            setMembers={setMembers}
            onUpdateUser={setAuthUser}
          />
        )}
        {view === "trainer"  && (
          <TrainerPortal
            user={authUser!}
            trainers={trainers}
            onNavigate={handleNavigate}
            onUpdateTrainer={handleUpdateTrainer}
            broadcasts={broadcasts}
            brandSettings={brandSettings}
          />
        )}
        {view === "profiles" && (
          <TrainerProfiles
            trainers={trainers}
            onNavigate={handleNavigate}
            authUser={authUser}
            brandSettings={brandSettings}
          />
        )}
        {view === "admin"    && (
          <AdminPanel
            onNavigate={handleNavigate}
            content={content}
            onUpdateContent={setContent}
            trainers={trainers}
            onUpdateTrainers={setTrainers}
            members={members}
            setMembers={setMembers}
            brandSettings={brandSettings}
            onUpdateBrandSettings={setBrandSettings}
            broadcasts={broadcasts}
            setBroadcasts={setBroadcasts}
          />
        )}
      </div>
    </div>
  );
}
