import { useState } from "react";
import { toast } from "sonner";
import {
  Dumbbell, Calendar, Users, Clock, Star, LogOut,
  Lock, ArrowRight, Check, Zap, ChevronRight
} from "lucide-react";
import type { AuthUser, TrainerData } from "../App";

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
}

export function GuestPortal({ user, onNavigate, trainers }: GuestPortalProps) {
  const [tab, setTab] = useState<"pass" | "classes" | "trainers">("pass");

  const LockedFeature = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 p-3 border border-border opacity-50 cursor-not-allowed" style={{ borderRadius: "var(--radius)" }}>
      <Lock size={14} className="text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground border border-border px-2 py-0.5" style={{ borderRadius: "var(--radius)" }}>Members only</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          <span style={{ ...H(18), letterSpacing: "0.05em" }} className="text-foreground">IRON<span className="text-primary">FIT</span></span>
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
              <p className="text-muted-foreground text-sm max-w-lg">You're exploring IronFit on a complimentary day pass. You can view our class schedule and trainer profiles. To book classes, track your health, and unlock all features — join as a member.</p>
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

            {/* Plan teaser */}
            <div className="md:col-span-2">
              <h2 style={H(20)} className="text-foreground mb-4">CHOOSE YOUR PLAN AFTER TODAY</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "STARTER", price: 999,  color: "border-border",       features: ["2 classes/month", "Basic tracking"] },
                  { name: "PRO",     price: 1999, color: "border-primary",      features: ["Unlimited classes", "1 PT session", "Full dashboard"], popular: true },
                  { name: "ELITE",   price: 3499, color: "border-orange-400/50",features: ["4 PT sessions", "Body scans", "Guest passes"] },
                ].map(p => (
                  <div key={p.name} className={`bg-card border-2 ${p.color} p-5 relative`} style={{ borderRadius: "var(--radius)" }}>
                    {"popular" in p && p.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-0.5" style={{ borderRadius: "var(--radius)" }}>MOST POPULAR</div>}
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700 }} className="text-primary tracking-widest mb-2">{p.name}</p>
                    <p style={H(28)} className="text-foreground mb-3">₹{p.price.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                    {p.features.map(f => <p key={f} className="text-muted-foreground text-xs flex items-center gap-1 mb-1"><Check size={10} className="text-primary" />{f}</p>)}
                    <button onClick={() => onNavigate("login")} className="w-full mt-4 border border-primary text-primary py-2 text-sm hover:bg-primary hover:text-white transition-all" style={{ borderRadius: "var(--radius)" }}>Get Started</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Class schedule (view only) */}
        {tab === "classes" && (
          <div>
            <div className="flex items-center gap-3 mb-5 p-3 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm" style={{ borderRadius: "var(--radius)" }}>
              <Lock size={14} /> You can view the schedule but booking requires a membership.
              <button onClick={() => onNavigate("login")} className="ml-auto text-xs underline shrink-0">Join now →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PUBLIC_CLASSES.map(cls => (
                <div key={cls.id} className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                  <div className="relative h-32 overflow-hidden bg-secondary">
                    <img src={`https://images.unsplash.com/${cls.image}?w=400&h=130&fit=crop&auto=format`} alt={cls.name} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 30%, transparent)" }} />
                    <div className="absolute bottom-2 left-3">
                      <p style={H(17)} className="text-white">{cls.name}</p>
                      <p className="text-white/60 text-xs">{cls.trainer}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Clock size={10} />{cls.time}</span>
                      <span className="flex items-center gap-1"><Zap size={10} />{cls.duration}</span>
                      <span>{cls.day}</span>
                    </div>
                    <button onClick={() => { toast.info("Join as a member to book classes", { description: "Pick a plan to reserve your spot." }); onNavigate("login"); }} className="w-full py-2 text-xs border border-border text-muted-foreground flex items-center justify-center gap-1 hover:border-primary hover:text-primary transition-all" style={{ borderRadius: "var(--radius)" }}>
                      <Lock size={11} /> Book (Members Only)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trainers (view only) */}
        {tab === "trainers" && (
          <div>
            <div className="flex items-center gap-3 mb-5 p-3 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm" style={{ borderRadius: "var(--radius)" }}>
              <Lock size={14} /> Trainer booking requires a PRO or ELITE membership.
              <button onClick={() => onNavigate("login")} className="ml-auto text-xs underline shrink-0">Join now →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {trainers.filter(t => t.active).map(t => (
                <div key={t.id} className="bg-card border border-border p-5 flex gap-4" style={{ borderRadius: "var(--radius)" }}>
                  <img src={`https://images.unsplash.com/${t.image}?w=90&h=90&fit=crop&auto=format`} alt={t.name} className="w-20 h-20 object-cover shrink-0" style={{ borderRadius: "var(--radius)" }} />
                  <div className="flex-1">
                    <h3 style={H(18)} className="text-foreground">{t.name}</h3>
                    <p className="text-primary text-xs mb-2">{t.specialty}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" />{t.rating} ({t.reviews})</span>
                      <span>{t.sessions} sessions</span>
                      <span>₹{t.fee.toLocaleString()}/hr</span>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{t.bio}</p>
                    <button onClick={() => { toast.info("PRO or ELITE membership required for PT sessions"); onNavigate("login"); }} className="text-xs px-4 py-1.5 border border-border text-muted-foreground flex items-center gap-1 hover:border-primary hover:text-primary transition-all w-fit" style={{ borderRadius: "var(--radius)" }}>
                      <Lock size={10} /> Book Session (Members Only)
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => onNavigate("profiles")} className="text-primary text-sm flex items-center gap-1 mx-auto hover:gap-2 transition-all">View full trainer profiles <ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
