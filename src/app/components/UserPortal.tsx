import { useState } from "react";
import { toast } from "sonner";
import {
  Dumbbell, Calendar, Users, TrendingUp, Bell, CreditCard,
  LogOut, Home, Clock, Check, X, ChevronRight, Plus,
  Activity, Target, Flame, Star, AlertCircle, User,
  Search, Zap, ArrowUp, ArrowDown, Download, RefreshCw,
  Lock, BarChart2, Droplets, Weight, CheckCircle, XCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from "recharts";
import type { AuthUser, TrainerData, BrandSettings, BroadcastMessage } from "../App";
import { RazorpayModal } from "./RazorpayModal";

/* ─── DATA ─────────────────────────────────────────────────── */
const ALL_CLASSES = [
  { id: 1,  name: "Power Yoga",       trainer: "Priya Sharma",  time: "6:00 AM",  day: "Mon", capacity: 15, booked: 12, duration: "60 min", level: "All levels",   image: "photo-1544367567-0f2fcb009e0b" },
  { id: 2,  name: "Zumba Blast",      trainer: "Neha Kapoor",   time: "7:30 AM",  day: "Mon", capacity: 20, booked: 20, duration: "45 min", level: "Beginner",     image: "photo-1518611012118-696072aa579a" },
  { id: 3,  name: "Boxing",           trainer: "Arjun Mehta",   time: "9:00 AM",  day: "Tue", capacity: 10, booked: 6,  duration: "60 min", level: "Intermediate", image: "photo-1549719386-74dfcbf7dbed" },
  { id: 4,  name: "HIIT Circuit",     trainer: "Rahul Nair",    time: "6:00 PM",  day: "Tue", capacity: 20, booked: 15, duration: "45 min", level: "Advanced",     image: "photo-1534438327276-14e5300c3a48" },
  { id: 5,  name: "Pilates Core",     trainer: "Sneha Roy",     time: "8:00 AM",  day: "Wed", capacity: 12, booked: 9,  duration: "50 min", level: "All levels",   image: "photo-1571019613454-1cb2f99b2d8b" },
  { id: 6,  name: "Kickboxing",       trainer: "Arjun Mehta",   time: "5:00 PM",  day: "Wed", capacity: 15, booked: 14, duration: "60 min", level: "Intermediate", image: "photo-1549719386-74dfcbf7dbed" },
  { id: 7,  name: "Morning Yoga",     trainer: "Priya Sharma",  time: "6:30 AM",  day: "Thu", capacity: 15, booked: 7,  duration: "60 min", level: "Beginner",     image: "photo-1544367567-0f2fcb009e0b" },
  { id: 8,  name: "Strength & Tone",  trainer: "Rahul Nair",    time: "7:00 PM",  day: "Thu", capacity: 20, booked: 11, duration: "50 min", level: "Intermediate", image: "photo-1534438327276-14e5300c3a48" },
  { id: 9,  name: "Vinyasa Flow",     trainer: "Priya Sharma",  time: "7:00 AM",  day: "Fri", capacity: 15, booked: 13, duration: "60 min", level: "All levels",   image: "photo-1544367567-0f2fcb009e0b" },
  { id: 10, name: "Zumba Fiesta",     trainer: "Neha Kapoor",   time: "10:00 AM", day: "Fri", capacity: 20, booked: 8,  duration: "45 min", level: "Beginner",     image: "photo-1518611012118-696072aa579a" },
  { id: 11, name: "Muay Thai",        trainer: "Arjun Mehta",   time: "8:00 AM",  day: "Sat", capacity: 12, booked: 12, duration: "60 min", level: "Advanced",     image: "photo-1549719386-74dfcbf7dbed" },
  { id: 12, name: "Full Body HIIT",   trainer: "Rahul Nair",    time: "9:30 AM",  day: "Sat", capacity: 20, booked: 17, duration: "45 min", level: "All levels",   image: "photo-1534438327276-14e5300c3a48" },
  { id: 13, name: "Restorative Yoga", trainer: "Priya Sharma",  time: "10:00 AM", day: "Sun", capacity: 15, booked: 5,  duration: "75 min", level: "Beginner",     image: "photo-1544367567-0f2fcb009e0b" },
];

const WEIGHT_DATA = [
  { week: "W1", weight: 82.0, bmi: 27.1, steps: 4200 },
  { week: "W2", weight: 81.2, bmi: 26.8, steps: 6800 },
  { week: "W3", weekText: "W3", weight: 80.5, bmi: 26.5, steps: 7400 },
  { week: "W4", weight: 79.8, bmi: 26.3, steps: 8100 },
  { week: "W5", weight: 79.0, bmi: 26.0, steps: 9200 },
  { week: "W6", weight: 78.4, bmi: 25.8, steps: 9800 },
  { week: "W7", weight: 77.9, bmi: 25.6, steps: 10200 },
  { week: "W8", weight: 77.2, bmi: 25.4, steps: 11000 },
];

const PAYMENT_HISTORY = [
  { date: "May 18, 2026", amount: 1999,  desc: "PRO Monthly",     status: "paid",     invoice: "INV-2026-052" },
  { date: "May 18, 2026", amount: 1500,  desc: "PT – Rahul Nair", status: "paid",     invoice: "INV-2026-051" },
  { date: "Apr 18, 2026", amount: 1999,  desc: "PRO Monthly",     status: "paid",     invoice: "INV-2026-041" },
  { date: "Mar 18, 2026", amount: 1999,  desc: "PRO Monthly",     status: "paid",     invoice: "INV-2026-031" },
  { date: "Jun 18, 2026", amount: 1999,  desc: "PRO Monthly",     status: "upcoming", invoice: "—" },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });
const TT = { background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#f0f0f0", fontSize: "12px" };

const planLevel = (role: string) => role === "elite" ? 3 : role === "pro" ? 2 : role === "starter" ? 1 : 0;

interface UserPortalProps {
  user: AuthUser;
  onNavigate: (v: string) => void;
  trainers: TrainerData[];
  broadcasts: BroadcastMessage[];
  brandSettings: BrandSettings;
  setMembers: React.Dispatch<React.SetStateAction<AuthUser[]>>;
  onUpdateUser: (u: AuthUser) => void;
}

export function UserPortal({
  user,
  onNavigate,
  trainers,
  broadcasts,
  brandSettings,
  setMembers,
  onUpdateUser
}: UserPortalProps) {
  const level = planLevel(user.role);
  const [tab, setTab] = useState<"dashboard"|"classes"|"trainers"|"health"|"membership"|"notifications">("dashboard");
  const [bookedClasses, setBookedClasses] = useState<Set<number>>(new Set([1, 4]));
  const [waitlist, setWaitlist]           = useState<Set<number>>(new Set());
  const [classCapacities, setClassCapacities] = useState<Record<number,number>>(Object.fromEntries(ALL_CLASSES.map(c => [c.id, c.booked])));
  const [selectedDay, setSelectedDay]     = useState("Mon");
  const [classSearch, setClassSearch]     = useState("");
  const [levelFilter, setLevelFilter]     = useState("All");
  const [trainerModal, setTrainerModal]   = useState<TrainerData | null>(null);
  const [selectedSlot, setSelectedSlot]   = useState<string|null>(null);
  const [bookedTrainers, setBookedTrainers] = useState<Record<number,string>>({});
  const [metricTab, setMetricTab]         = useState<"weight"|"bmi"|"steps">("weight");
  
  // Upgrade state
  const [upgradeModal, setUpgradeModal]   = useState(false);
  const [targetUpgradePlan, setTargetUpgradePlan] = useState<"PRO" | "ELITE" | null>(null);
  const [isUpgradePaymentOpen, setIsUpgradePaymentOpen] = useState(false);

  // Notifications
  const [localNotifications, setLocalNotifications] = useState([
    { id: "N1", type: "warning", title: "Welcome package active", msg: "Read your onboarding guides inside your dashboard.", time: "1d ago", read: false },
  ]);

  const [healthLogs, setHealthLogs] = useState([
    { date: "Jun 13", weight: 77.2, bmi: 25.4, age: user.age ?? 28, height: user.height ?? 165, notes: "Feeling great!" },
    { date: "Jun 6",  weight: 77.9, bmi: 25.6, age: user.age ?? 28, height: user.height ?? 165, notes: "Leg day soreness" },
    { date: "May 30", weight: 78.4, bmi: 25.8, age: user.age ?? 28, height: user.height ?? 165, notes: "" },
  ]);
  const [logForm, setLogForm] = useState({ weight: "", height: String(user.height ?? ""), age: String(user.age ?? ""), notes: "" });

  const mergedNotifications = [
    ...broadcasts.map(b => ({
      id: b.id,
      type: "offer" as const,
      title: `Broadcast Alert: ${b.sender}`,
      msg: b.text,
      time: b.timestamp,
      read: false,
    })),
    ...localNotifications,
  ];

  const unread = mergedNotifications.filter(n => !n.read).length;

  const starterMonthlyLimit = 2;
  const starterBookedCount = level === 1 ? bookedClasses.size : 0;

  const handleBookClass = (cls: typeof ALL_CLASSES[0]) => {
    const cap = classCapacities[cls.id];
    const isFull = cap >= cls.capacity;
    if (level === 0) { toast.error("Join a membership plan to book classes"); onNavigate("login"); return; }
    if (level === 1 && !bookedClasses.has(cls.id) && !isFull && starterBookedCount >= starterMonthlyLimit) {
      toast.error("STARTER plan allows 2 classes/month", { description: "Upgrade to PRO for unlimited bookings." });
      setUpgradeModal(true);
      return;
    }
    if (bookedClasses.has(cls.id)) {
      setBookedClasses(p => { const s = new Set(p); s.delete(cls.id); return s; });
      setClassCapacities(p => ({ ...p, [cls.id]: p[cls.id] - 1 }));
      toast.success(`Cancelled: ${cls.name}`);
    } else if (isFull) {
      if (waitlist.has(cls.id)) { setWaitlist(p => { const s = new Set(p); s.delete(cls.id); return s; }); toast.info(`Removed from waitlist`); }
      else { setWaitlist(p => new Set([...p, cls.id])); toast.info(`Added to waitlist: ${cls.name}`); }
    } else {
      setBookedClasses(p => new Set([...p, cls.id]));
      setClassCapacities(p => ({ ...p, [cls.id]: p[cls.id] + 1 }));
      toast.success(`Booked: ${cls.name}`, { description: `${cls.day} · ${cls.time}` });
      setTimeout(() => {
        toast.info(`Automated booking confirmation sent to ${user.phone || "+91 99999 99999"} via WhatsApp!`);
      }, 700);
    }
  };

  const handleBookTrainer = () => {
    if (!trainerModal || !selectedSlot) return;
    if (level < 2) { toast.error("PRO or ELITE membership required for PT sessions"); setUpgradeModal(true); return; }
    setBookedTrainers(p => ({ ...p, [trainerModal.id]: selectedSlot }));
    toast.success(`Session booked with ${trainerModal.name}`, { description: `${selectedSlot} · ₹${trainerModal.fee.toLocaleString()} added to invoice` });
    setTrainerModal(null); setSelectedSlot(null);
  };

  const handleLogHealth = () => {
    if (!logForm.weight) { toast.error("Enter your weight"); return; }
    const h = parseFloat(logForm.height || String(user.height ?? 165));
    const w = parseFloat(logForm.weight);
    const bmi = parseFloat((w / ((h / 100) ** 2)).toFixed(1));
    const entry = { date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), weight: w, bmi, age: parseInt(logForm.age || String(user.age ?? 0)), height: h, notes: logForm.notes };
    setHealthLogs(p => [entry, ...p]);
    setLogForm(p => ({ ...p, weight: "", notes: "" }));
    toast.success(`Logged! Weight: ${w}kg · BMI: ${bmi}`);
  };

  const startUpgradeFlow = (planName: "PRO" | "ELITE") => {
    setTargetUpgradePlan(planName);
    setUpgradeModal(false);
    setIsUpgradePaymentOpen(true);
  };

  const handleUpgradeSuccess = (paymentDetails: { method: string; transactionId: string }) => {
    if (!targetUpgradePlan) return;
    const nextRole = targetUpgradePlan.toLowerCase() as AuthUser["role"];
    const updatedUser: AuthUser = {
      ...user,
      role: nextRole,
      plan: targetUpgradePlan,
    };
    
    // Update global state
    setMembers(prev => prev.map(m => m.id === user.id ? updatedUser : m));
    onUpdateUser(updatedUser);

    toast.success(`Upgrade Successful! You are now a ${targetUpgradePlan} member. 🎉`, {
      description: `Method: ${paymentDetails.method}. Transaction ID: ${paymentDetails.transactionId}`
    });
    
    setTargetUpgradePlan(null);
    setIsUpgradePaymentOpen(false);
  };

  const sideNav = [
    { id: "dashboard",     label: "Dashboard",      icon: Home,       minLevel: 0 },
    { id: "classes",       label: "Book Classes",   icon: Calendar,   minLevel: 1 },
    { id: "trainers",      label: "Trainers",       icon: Users,      minLevel: 2 },
    { id: "health",        label: "Health Metrics", icon: Activity,   minLevel: 1 },
    { id: "membership",    label: "Membership",     icon: CreditCard, minLevel: 0 },
    { id: "notifications", label: "Notifications",  icon: Bell,       minLevel: 0 },
  ] as const;

  const filteredClasses = ALL_CLASSES.filter(c =>
    c.day === selectedDay &&
    (levelFilter === "All" || c.level === levelFilter) &&
    (classSearch === "" || c.name.toLowerCase().includes(classSearch.toLowerCase()))
  );

  const planLabel = user.plan ?? "PRO";
  const planColor = planLabel === "ELITE" ? "text-orange-400" : planLabel === "PRO" ? "text-primary" : "text-muted-foreground";

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Razorpay upgrade checkout */}
      {isUpgradePaymentOpen && targetUpgradePlan && (
        <RazorpayModal
          isOpen={isUpgradePaymentOpen}
          onClose={() => setIsUpgradePaymentOpen(false)}
          onSuccess={handleUpgradeSuccess}
          amount={targetUpgradePlan === "ELITE" ? 3499 : 1999}
          itemName={`${targetUpgradePlan} Membership Upgrade`}
          customerName={user.name}
          customerEmail={user.email}
          customerPhone={user.phone || ""}
          gymName={brandSettings.name}
          razorpayKeyId={brandSettings.razorpayKeyId}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className="w-56 flex flex-col border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
          ) : (
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          )}
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "0.05em" }} className="text-foreground uppercase">
            {brandSettings.name.split(" ")[0]}
          </span>
        </div>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">{user.name[0]}</div>
            <div>
              <p className="text-foreground text-sm font-medium truncate max-w-[100px]">{user.name}</p>
              <span className={`text-xs font-bold ${planColor}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{planLabel} MEMBER</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sideNav.map(({ id, label, icon: Icon, minLevel }) => (
            <button key={id} onClick={() => level >= minLevel ? setTab(id) : setUpgradeModal(true)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${tab === id ? "bg-primary/10 text-primary" : level < minLevel ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>
              <Icon size={15} />
              <span className="flex-1 text-left">{label}</span>
              {level < minLevel && <Lock size={10} className="text-muted-foreground/40" />}
              {id === "notifications" && unread > 0 && <span className="bg-primary text-white text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 font-bold">{unread}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={() => onNavigate("profiles")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ borderRadius: "var(--radius)" }}>
            <Users size={14} /> Trainer Profiles
          </button>
          <button onClick={() => onNavigate("logout")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ borderRadius: "var(--radius)" }}>
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto bg-background/50">

        {/* ════ DASHBOARD ════ */}
        {tab === "dashboard" && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 style={H(30)} className="text-foreground">WELCOME, {user.name.split(" ")[0].toUpperCase()} 💪</h1>
                <p className="text-muted-foreground text-sm mt-1">Your <span className={`font-bold ${planColor}`}>{planLabel}</span> membership is active at {brandSettings.name}.</p>
              </div>
              <button onClick={() => setTab("classes")} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <Plus size={14} /> Book a Class
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Classes Booked",   value: String(bookedClasses.size), sub: level === 1 ? `${starterBookedCount}/${starterMonthlyLimit} this month` : "Unlimited", icon: Calendar, color: "text-primary" },
                { label: "Active Streak",    value: "14 days",  sub: "Personal best 🔥",    icon: Flame,       color: "text-orange-400" },
                { label: "Weight Lost",      value: "4.8 kg",   sub: "Since joining",       icon: TrendingUp,  color: "text-green-400" },
                { label: "PT Sessions",      value: level >= 3 ? "4/4" : level >= 2 ? "1/1" : "—", sub: level >= 2 ? "This month" : "PRO+ required", icon: Users, color: level >= 2 ? "text-blue-400" : "text-muted-foreground" },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-start justify-between mb-2"><span className="text-muted-foreground text-xs">{label}</span><Icon size={15} className={color} /></div>
                  <p style={H(24)} className="text-foreground">{value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Notifications Alert Banner */}
            {unread > 0 && (
              <div className="bg-primary/10 border border-primary/30 p-4 mb-6 flex items-start gap-3 justify-between" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex gap-2">
                  <Bell className="text-primary mt-0.5 shrink-0" size={16} />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Active Notifications</h4>
                    <p className="text-xs text-muted-foreground">You have {unread} unread notifications. Check the notifications feed for details.</p>
                  </div>
                </div>
                <button onClick={() => setTab("notifications")} className="text-xs text-primary font-bold hover:underline shrink-0">View All</button>
              </div>
            )}
          </div>
        )}

        {/* ════ CLASSES ════ */}
        {tab === "classes" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-2">
              <h1 style={H(30)} className="text-foreground">BOOK A CLASS</h1>
              {level === 1 && <div className="text-muted-foreground text-sm">{starterBookedCount}/{starterMonthlyLimit} bookings used this month · <button onClick={() => setUpgradeModal(true)} className="text-primary hover:underline">Upgrade</button></div>}
            </div>
            <p className="text-muted-foreground text-sm mb-5">Select a day and reserve your spot.</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {DAYS.map(d => {
                const count = ALL_CLASSES.filter(c => c.day === d && bookedClasses.has(c.id)).length;
                return (
                  <button key={d} onClick={() => setSelectedDay(d)} className={`px-4 py-2 text-sm transition-all relative ${selectedDay === d ? "bg-primary text-white" : "border border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>
                    {d}{count > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">{count}</span>}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredClasses.map(cls => {
                const cap = classCapacities[cls.id];
                const isFull = cap >= cls.capacity;
                const isBooked = bookedClasses.has(cls.id);
                const isWaitlisted = waitlist.has(cls.id);
                const pct = Math.round((cap / cls.capacity) * 100);
                return (
                  <div key={cls.id} className="bg-card border border-border hover:border-primary/30 transition-all overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                    <div className="relative h-32 overflow-hidden bg-secondary">
                      <img src={`https://images.unsplash.com/${cls.image}?w=400&h=130&fit=crop&auto=format`} alt={cls.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 30%, transparent)" }} />
                      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                        <div><p style={H(16)} className="text-white">{cls.name}</p><p className="text-white/60 text-xs">{cls.trainer}</p></div>
                        <span className="text-xs border border-white/20 bg-black/40 text-white px-2 py-0.5" style={{ borderRadius: "var(--radius)" }}>{cls.level}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock size={10} />{cls.time}</span>
                        <span className="flex items-center gap-1"><Zap size={10} />{cls.duration}</span>
                        <span className="flex items-center gap-1"><Users size={10} />{cap}/{cls.capacity}</span>
                      </div>
                      <button onClick={() => handleBookClass(cls)} className={`w-full py-2 text-xs transition-all ${isBooked ? "bg-primary/10 text-primary border border-primary/30" : isWaitlisted ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30" : isFull ? "border border-border text-muted-foreground hover:border-yellow-400" : "bg-primary text-white hover:bg-primary/90"}`} style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                        {isBooked ? "✓ BOOKED — Cancel" : isWaitlisted ? "ON WAITLIST" : isFull ? "JOIN WAITLIST" : "BOOK NOW"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════ TRAINERS ════ */}
        {tab === "trainers" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">PERSONAL TRAINERS</h1>
            <p className="text-muted-foreground text-sm mb-6">Book a 1-on-1 session. Available to PRO & ELITE members.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {trainers.filter(t => t.active).map(t => (
                <div key={t.id} className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex gap-4 p-5">
                    <img src={`https://images.unsplash.com/${t.image}?w=90&h=90&fit=crop&auto=format`} alt={t.name} className="w-20 h-20 object-cover shrink-0" style={{ borderRadius: "var(--radius)" }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div><h3 style={H(19)} className="text-foreground">{t.name}</h3><p className="text-primary text-xs mb-1">{t.specialty}</p></div>
                        <span style={H(18)} className="text-foreground">₹{t.fee.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/hr</span></span>
                      </div>
                      <p className="text-muted-foreground text-xs line-clamp-2">{t.bio}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-4">
                    <button onClick={() => { setTrainerModal(t); setSelectedSlot(null); }} className="w-full py-2 bg-primary/10 text-primary border border-primary/30 text-sm hover:bg-primary hover:text-white transition-all" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>VIEW AVAILABLE SLOTS</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ MEMBERSHIP ════ */}
        {tab === "membership" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-6">MY MEMBERSHIP</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className={`lg:col-span-2 p-6 border-2 border-primary/30 bg-primary/5`} style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 style={H(34)} className="text-foreground">{planLabel} MEMBER</h2>
                    <p className="text-muted-foreground text-sm">Member since {user.joined || "Jun 2026"}</p>
                  </div>
                  <CreditCard size={24} className={planColor} />
                </div>
                <div className="flex gap-3">
                  {planLabel !== "ELITE" && (
                    <button onClick={() => startUpgradeFlow("ELITE")} className="flex-1 text-white py-2.5 text-sm bg-orange-500 hover:bg-orange-600 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO ELITE →</button>
                  )}
                  {planLabel === "STARTER" && (
                    <button onClick={() => startUpgradeFlow("PRO")} className="flex-1 text-white py-2.5 text-sm bg-primary hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO PRO →</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {tab === "notifications" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div><h1 style={H(30)} className="text-foreground">NOTIFICATIONS</h1><p className="text-muted-foreground text-sm">{unread} unread</p></div>
            </div>
            <div className="space-y-3 max-w-2xl">
              {mergedNotifications.map(n => (
                <div key={n.id} className={`flex gap-4 p-4 border transition-all border-border bg-card`} style={{ borderRadius: "var(--radius)" }}>
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-primary" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2"><p className="text-foreground text-sm font-medium">{n.title}</p><span className="text-muted-foreground text-xs shrink-0">{n.time}</span></div>
                    <p className="text-muted-foreground text-sm mt-1">{n.msg}</p>
                  </div>
                </div>
              ))}
              {mergedNotifications.length === 0 && (
                <div className="text-center py-12"><p className="text-muted-foreground text-sm">No notifications found.</p></div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Upgrade options modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setUpgradeModal(false)}>
          <div className="bg-card border border-border w-full max-w-md p-6" style={{ borderRadius: "var(--radius)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5"><h2 style={H(22)} className="text-foreground">UPGRADE YOUR PLAN</h2><button onClick={() => setUpgradeModal(false)}><X size={18} className="text-muted-foreground" /></button></div>
            <div className="space-y-3 mb-5">
              {planLabel === "STARTER" && (
                <div className="border-2 border-primary bg-primary/5 p-4" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-center justify-between mb-2"><span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 800 }} className="text-primary">PRO PLAN</span><span style={H(20)} className="text-foreground">₹1,999<span className="text-xs text-muted-foreground font-normal">/mo</span></span></div>
                  <button onClick={() => startUpgradeFlow("PRO")} className="w-full mt-3 bg-primary text-white py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO PRO</button>
                </div>
              )}
              {planLabel !== "ELITE" && (
                <div className="border-2 border-orange-400 bg-orange-400/5 p-4" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-center justify-between mb-2"><span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 800 }} className="text-orange-400">ELITE PLAN</span><span style={H(20)} className="text-foreground">₹3,499<span className="text-xs text-muted-foreground font-normal">/mo</span></span></div>
                  <button onClick={() => startUpgradeFlow("ELITE")} className="w-full mt-3 bg-orange-500 text-white py-2 text-sm hover:bg-orange-600 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO ELITE</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
