import { useState } from "react";
import { toast } from "sonner";
import {
  Dumbbell, Calendar, Users, Clock, Star, LogOut,
  Lock, ArrowRight, Check, Zap, ChevronRight
} from "lucide-react";
import type { AuthUser, TrainerData, BrandSettings, BroadcastMessage } from "../App";

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });

const PUBLIC_CLASSES = [
  { id: 1, name: "Power Yoga",      trainer: "Priya Sharma",  time: "6:00 AM", day: "Mon", image: "photo-1544367567-0f2fcb009e0b", level: "All levels",   duration: "60 min" },
  { id: 2, name: "Zumba Blast",     trainer: "Neha Kapoor",   time: "7:30 AM", day: "Mon", image: "photo-1518611012118-696072aa579a", level: "Beginner",   duration: "45 min" },
  { id: 3, name: "Boxing",          trainer: "Arjun Mehta",   time: "9:00 AM", day: "Tue", image: "photo-1549719386-74dfcbf7dbed", level: "Intermediate",duration: "60 min" },
  { id: 4, name: "HIIT Circuit",    trainer: "Rahul Nair",    time: "6:00 PM", day: "Tue", image: "photo-1534438327276-14e5300c3a48", level: "Advanced",  duration: "45 min" },
  { id: 5, name: "Pilates Core",    trainer: "Sneha Roy",     time: "8:00 AM", day: "Wed", image: "photo-1571019613454-1cb2f99b2d8b", level: "All levels", duration: "50 min" },
  { id: 6, name: "Morning Yoga",    trainer: "Priya Sharma",  time: "6:30 AM", day: "Thu", image: "photo-1544367567-0f2fcb009e0b", level: "Beginner",    duration: "60 min" },
];

interface GuestPortalProps {
  user: AuthUser;
  onNavigate: (v: string) => void;
  trainers: TrainerData[];
  brandSettings: BrandSettings;
  broadcasts?: BroadcastMessage[];
  setMembers?: React.Dispatch<React.SetStateAction<AuthUser[]>>;
  onUpdateUser?: (u: AuthUser) => void;
}

export function GuestPortal({ user, onNavigate, trainers, brandSettings, broadcasts, setMembers, onUpdateUser }: GuestPortalProps) {
  const [tab, setTab] = useState<"pass" | "classes" | "trainers">("pass");

  const LockedFeature = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 p-3 border border-border opacity-50 cursor-not-allowed" style={{ borderRadius: "var(--radius)" }}>
      <Lock size={14} className="text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground border border-border px-2 py-0.5" style={{ borderRadius: "var(--radius)" }}>Members only</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
          ) : (
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          )}
          <span style={{ ...H(18), letterSpacing: "0.05em" }} className="text-foreground uppercase">{brandSettings.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 border border-primary/30 px-3 py-1 text-primary text-xs" style={{ borderRadius: "var(--radius)" }}>🎟 FREE DAY PASS — Today Only</div>
          <button onClick={() => onNavigate("logout")} className="text-muted-foreground text-sm flex items-center gap-1 hover:text-foreground"><LogOut size={14} /></button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome banner */}
        <div className="bg-primary/10 border border-primary/30 p-6 mb-8" style={{ borderRadius: "var(--radius)" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary text-xs tracking-widest mb-1">FREE DAY PASS ACTIVE</p>
              <h1 style={H(28)} className="text-foreground mb-2">WELCOME, {user.name.split(" ")[0].toUpperCase()}! 👋</h1>
              <p className="text-muted-foreground text-sm max-w-lg">You're exploring {brandSettings.name} on a complimentary day pass. You can view our class schedule and trainer profiles. To book classes, track your health, and unlock all features — join as a member.</p>
            </div>
            <button onClick={() => onNavigate("login")} className="shrink-0 flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700 }}>
              JOIN NOW <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {[["pass","My Day Pass"],["classes","Class Schedule"],["trainers","Trainers"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as typeof tab)} className={`px-4 py-2.5 text-sm transition-all border-b-2 -mb-px ${tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</button>
          ))}
        </div>

        {/* Free pass info */}
        {tab === "pass" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
              <h2 style={H(20)} className="text-foreground mb-4">YOUR FREE PASS INCLUDES</h2>
              <ul className="space-y-3">
                {["Full gym floor access for today", "Attend 1 drop-in group class (subject to availability)", "Locker room access", "Complimentary gym tour with a staff member", "Free fitness consultation (15 min)"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check size={14} className="text-primary shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 p-3 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs" style={{ borderRadius: "var(--radius)" }}>
                ⏰ Your free pass expires at midnight today. Upgrade to keep the momentum going!
              </div>
            </div>
            <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
              <h2 style={H(20)} className="text-foreground mb-4">WHAT'S LOCKED</h2>
              <div className="space-y-2 mb-5">
                <LockedFeature label="Class booking & reservations" />
                <LockedFeature label="Personal trainer sessions" />
                <LockedFeature label="Health & fitness dashboard" />
                <LockedFeature label="WhatsApp & push notifications" />
                <LockedFeature label="Progress tracking & history" />
              </div>
              <button onClick={() => onNavigate("login")} className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700 }}>
                UNLOCK ALL FEATURES →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
