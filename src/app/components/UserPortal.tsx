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
import type { AuthUser, TrainerData } from "../App";

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
  { week: "W3", weight: 80.5, bmi: 26.5, steps: 7400 },
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

/* ─── PLAN FEATURE GATES ────────────────────────────────────── */
const planLevel = (role: string) => role === "elite" ? 3 : role === "pro" ? 2 : role === "starter" ? 1 : 0;

function LockedFeature({ label, minPlan }: { label: string; minPlan: string }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-border opacity-60 cursor-not-allowed" style={{ borderRadius: "var(--radius)" }}>
      <Lock size={13} className="text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="ml-auto text-xs text-primary border border-primary/30 px-2 py-0.5" style={{ borderRadius: "var(--radius)" }}>{minPlan}+</span>
    </div>
  );
}

interface UserPortalProps {
  user: AuthUser;
  onNavigate: (v: string) => void;
  trainers: TrainerData[];
}

export function UserPortal({ user, onNavigate, trainers }: UserPortalProps) {
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
  const [upgradeModal, setUpgradeModal]   = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "warning", title: "Membership expiring soon",  msg: "Your membership expires in 5 days. Renew now to keep access.",          time: "2h ago",  read: false },
    { id: 2, type: "cancel",  title: "Class cancelled",           msg: "Boxing class on Tuesday 9AM has been cancelled.",                        time: "5h ago",  read: false },
    { id: 3, type: "offer",   title: "25% off annual upgrade",    msg: "🎉 Upgrade to Annual at a 25% discount — ends midnight tonight.",        time: "1d ago",  read: false },
    { id: 4, type: "info",    title: "New class: Vinyasa Flow",   msg: "Priya Sharma added Vinyasa Flow on Fridays 7AM. 15 spots available.",    time: "2d ago",  read: true  },
  ]);

  /* Health state including age + height */
  const [healthLogs, setHealthLogs] = useState([
    { date: "Jun 13", weight: 77.2, bmi: 25.4, age: user.age ?? 28, height: user.height ?? 165, notes: "Feeling great!" },
    { date: "Jun 6",  weight: 77.9, bmi: 25.6, age: user.age ?? 28, height: user.height ?? 165, notes: "Leg day soreness" },
    { date: "May 30", weight: 78.4, bmi: 25.8, age: user.age ?? 28, height: user.height ?? 165, notes: "" },
  ]);
  const [logForm, setLogForm] = useState({ weight: "", height: String(user.height ?? ""), age: String(user.age ?? ""), notes: "" });

  const unread = notifications.filter(n => !n.read).length;

  /* Monthly class limit for STARTER: 2 */
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
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-56 flex flex-col border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", fontWeight: 800, letterSpacing: "0.05em" }} className="text-foreground">IRON<span className="text-primary">FIT</span></span>
        </div>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center"><User size={16} className="text-primary" /></div>
            <div>
              <p className="text-foreground text-sm font-medium truncate max-w-[100px]">{user.name}</p>
              <span className={`text-xs font-bold ${planColor}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{planLabel} MEMBER</span>
            </div>
          </div>
          {level === 1 && (
            <div className="mt-2 text-xs text-muted-foreground border border-border px-2 py-1" style={{ borderRadius: "var(--radius)" }}>
              Classes: {starterBookedCount}/{starterMonthlyLimit} this month
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sideNav.map(({ id, label, icon: Icon, minLevel }) => (
            <button key={id} onClick={() => level >= minLevel ? setTab(id) : setUpgradeModal(true)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${tab === id ? "bg-primary/10 text-primary" : level < minLevel ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>
              <Icon size={15} />
              <span className="flex-1 text-left">{label}</span>
              {level < minLevel && <Lock size={10} className="text-muted-foreground/40" />}
              {id === "notifications" && unread > 0 && <span className="bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center shrink-0">{unread}</span>}
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
      <main className="flex-1 overflow-y-auto">

        {/* ════ DASHBOARD ════ */}
        {tab === "dashboard" && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 style={H(30)} className="text-foreground">WELCOME, {user.name.split(" ")[0].toUpperCase()} 💪</h1>
                <p className="text-muted-foreground text-sm mt-1">Your <span className={`font-bold ${planColor}`}>{planLabel}</span> membership is active.</p>
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

            {/* Chart + bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              <div className="lg:col-span-3 bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                {level >= 2 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 style={H(17)} className="text-foreground">WEIGHT PROGRESS</h3>
                        <p className="text-muted-foreground text-xs mt-0.5">8-week journey</p>
                      </div>
                      <div className="flex gap-1">
                        {(["weight","bmi","steps"] as const).map(m => (
                          <button key={m} onClick={() => setMetricTab(m)} className={`text-xs px-2.5 py-1 capitalize transition-all ${metricTab === m ? "bg-primary text-white" : "text-muted-foreground border border-border hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>{m}</button>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={WEIGHT_DATA}>
                        <defs>
                          <linearGradient id="userDashGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef2d2d" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#ef2d2d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="week" tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={TT} />
                        <Area key={metricTab} type="monotone" dataKey={metricTab} stroke="#ef2d2d" fill="url(#userDashGrad)" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Lock size={28} className="text-muted-foreground mb-3 opacity-40" />
                    <p style={H(16)} className="text-foreground mb-1">FULL HEALTH DASHBOARD</p>
                    <p className="text-muted-foreground text-xs mb-3">Upgrade to PRO to unlock charts & progress tracking.</p>
                    <button onClick={() => setUpgradeModal(true)} className="bg-primary text-white px-4 py-2 text-xs hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>Upgrade to PRO</button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-2 bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={H(17)} className="text-foreground">MY BOOKINGS</h3>
                  <button onClick={() => setTab("classes")} className="text-primary text-xs flex items-center gap-1">View all <ChevronRight size={11} /></button>
                </div>
                <div className="space-y-2">
                  {ALL_CLASSES.filter(c => bookedClasses.has(c.id)).slice(0, 5).map(cls => (
                    <div key={cls.id} className="flex items-center gap-3 p-2 hover:bg-secondary/50 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                      <div className="w-7 h-7 bg-primary/10 flex items-center justify-center shrink-0" style={{ borderRadius: "var(--radius)" }}><Calendar size={12} className="text-primary" /></div>
                      <div className="flex-1 min-w-0"><p className="text-foreground text-sm truncate">{cls.name}</p><p className="text-muted-foreground text-xs">{cls.day} · {cls.time}</p></div>
                      <button onClick={() => handleBookClass(cls)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"><X size={12} /></button>
                    </div>
                  ))}
                  {bookedClasses.size === 0 && <div className="text-center py-8"><Calendar size={24} className="text-muted-foreground mx-auto mb-2 opacity-30" /><p className="text-muted-foreground text-sm">No classes booked yet</p></div>}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Book a Class",    icon: Calendar,   action: () => level >= 1 ? setTab("classes")  : setUpgradeModal(true), ok: level >= 1 },
                { label: "Book Trainer",    icon: Users,      action: () => level >= 2 ? setTab("trainers") : setUpgradeModal(true), ok: level >= 2 },
                { label: "Log Metrics",     icon: Activity,   action: () => level >= 1 ? setTab("health")   : setUpgradeModal(true), ok: level >= 1 },
                { label: "Manage Plan",     icon: CreditCard, action: () => setTab("membership"),                                    ok: true },
              ].map(({ label, icon: Icon, action, ok }) => (
                <button key={label} onClick={action} className={`flex items-center gap-3 p-4 border border-border hover:border-primary/30 transition-all ${ok ? "bg-primary/5 text-primary" : "opacity-50 cursor-pointer"}`} style={{ borderRadius: "var(--radius)" }}>
                  <Icon size={18} /> <span className="text-sm font-medium">{label}</span>
                  {!ok && <Lock size={12} className="ml-auto" />}
                </button>
              ))}
            </div>
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
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search classes..." value={classSearch} onChange={e => setClassSearch(e.target.value)} className="bg-card border border-border pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)", width: "200px" }} />
              </div>
              <div className="flex gap-2">
                {["All","Beginner","Intermediate","Advanced"].map(l => (
                  <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-2 text-xs transition-all ${levelFilter === l ? "bg-primary/10 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>{l}</button>
                ))}
              </div>
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
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Capacity</span><span className={pct >= 100 ? "text-red-400" : pct >= 80 ? "text-yellow-400" : "text-green-400"}>{pct}%</span></div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : pct >= 80 ? "bg-yellow-400" : "bg-primary"}`} style={{ width: `${Math.min(pct,100)}%` }} /></div>
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
            <p className="text-muted-foreground text-sm mb-6">Book a 1-on-1 session. Available to PRO & ELITE members. Fee auto-added to invoice.</p>
            {level < 2 ? (
              <div className="text-center py-16 border border-border" style={{ borderRadius: "var(--radius)" }}>
                <Lock size={32} className="text-muted-foreground mx-auto mb-4 opacity-30" />
                <h2 style={H(24)} className="text-foreground mb-2">PRO FEATURE</h2>
                <p className="text-muted-foreground text-sm mb-5">Upgrade to PRO to book personal training sessions.</p>
                <button onClick={() => setUpgradeModal(true)} className="bg-primary text-white px-8 py-3 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>Upgrade to PRO</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {trainers.filter(t => t.active).map(t => (
                  <div key={t.id} className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                    <div className="flex gap-4 p-5">
                      <div className="relative shrink-0">
                        <img src={`https://images.unsplash.com/${t.image}?w=90&h=90&fit=crop&auto=format`} alt={t.name} className="w-20 h-20 object-cover" style={{ borderRadius: "var(--radius)" }} />
                        {bookedTrainers[t.id] && <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div><h3 style={H(19)} className="text-foreground">{t.name}</h3><p className="text-primary text-xs mb-1">{t.specialty}</p></div>
                          <span style={H(18)} className="text-foreground">₹{t.fee.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/hr</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">{[1,2,3,4,5].map(i => <Star key={`${t.id}-s${i}`} size={10} className={i <= Math.round(t.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />)} {t.rating}</span>
                          <span>{t.sessions.toLocaleString()} sessions</span>
                        </div>
                        <p className="text-muted-foreground text-xs line-clamp-2">{t.bio}</p>
                      </div>
                    </div>
                    {bookedTrainers[t.id] ? (
                      <div className="px-5 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle size={14} /> Booked: {bookedTrainers[t.id]}</div>
                        <button onClick={() => { setBookedTrainers(p => { const n = {...p}; delete n[t.id]; return n; }); toast.info("Session cancelled"); }} className="text-xs text-muted-foreground hover:text-red-400">Cancel</button>
                      </div>
                    ) : (
                      <div className="px-5 pb-4">
                        <button onClick={() => { setTrainerModal(t); setSelectedSlot(null); }} className="w-full py-2 bg-primary/10 text-primary border border-primary/30 text-sm hover:bg-primary hover:text-white transition-all" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>VIEW AVAILABLE SLOTS</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Trainer booking modal */}
            {trainerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setTrainerModal(null)}>
                <div className="bg-card border border-border w-full max-w-md p-6" style={{ borderRadius: "var(--radius)" }} onClick={e => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <div><h2 style={H(22)} className="text-foreground">BOOK SESSION</h2><p className="text-primary text-sm">{trainerModal.name}</p></div>
                    <button onClick={() => setTrainerModal(null)}><X size={18} className="text-muted-foreground" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {trainerModal.available.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)} className={`py-2.5 text-sm border transition-all ${selectedSlot === slot ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>{slot}</button>
                    ))}
                  </div>
                  <div className="bg-secondary p-4 mb-4" style={{ borderRadius: "var(--radius)" }}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Session fee</span><span className="text-foreground">₹{trainerModal.fee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Billing</span><span className="text-foreground">Added to next invoice</span></div>
                    {level >= 3 && <div className="flex justify-between text-sm mt-1"><span className="text-muted-foreground">ELITE sessions left</span><span className="text-green-400">3/4</span></div>}
                  </div>
                  <button onClick={handleBookTrainer} disabled={!selectedSlot} className={`w-full py-3 text-sm transition-all ${selectedSlot ? "bg-primary text-white hover:bg-primary/90" : "bg-secondary text-muted-foreground cursor-not-allowed"}`} style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                    {selectedSlot ? `CONFIRM — ₹${trainerModal.fee.toLocaleString()}` : "SELECT A SLOT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ HEALTH METRICS ════ */}
        {tab === "health" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">HEALTH METRICS</h1>
            <p className="text-muted-foreground text-sm mb-6">Track your transformation week over week.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Current Weight", value: `${healthLogs[0]?.weight ?? 77.2} kg`, sub: `↓ ${(82 - (healthLogs[0]?.weight ?? 77.2)).toFixed(1)} kg lost`, icon: BarChart2, color: "text-green-400" },
                { label: "Current BMI",    value: String(healthLogs[0]?.bmi ?? 25.4),    sub: "Normal: 18.5–24.9",  icon: Target,   color: "text-yellow-400" },
                { label: "Height",         value: `${user.height ?? healthLogs[0]?.height ?? 165} cm`, sub: "From your profile", icon: ArrowUp, color: "text-blue-400" },
                { label: "Age",            value: `${user.age ?? healthLogs[0]?.age ?? 28} yrs`, sub: "From your profile",  icon: Flame, color: "text-primary" },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-start justify-between mb-2"><span className="text-muted-foreground text-xs">{label}</span><Icon size={15} className={color} /></div>
                  <p style={H(24)} className="text-foreground">{value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {level >= 2 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                    <h3 style={H(17)} className="text-foreground mb-4">WEIGHT TREND</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={WEIGHT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="week" tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} domain={[75,84]} />
                        <Tooltip contentStyle={TT} />
                        <Line type="monotone" dataKey="weight" stroke="#ef2d2d" strokeWidth={2} dot={{ fill: "#ef2d2d", strokeWidth: 0, r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                    <h3 style={H(17)} className="text-foreground mb-4">DAILY STEPS</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={WEIGHT_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="week" tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#777", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={TT} />
                        <Bar dataKey="steps" fill="#ef2d2d" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Log form — includes age & height */}
                <div className="bg-card border border-border p-6 mb-5" style={{ borderRadius: "var(--radius)" }}>
                  <h3 style={H(17)} className="text-foreground mb-4">LOG TODAY'S METRICS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { k: "weight", l: "Weight (kg) *", p: "e.g. 76.8", t: "number" },
                      { k: "height", l: "Height (cm)",   p: "e.g. 165",  t: "number" },
                      { k: "age",    l: "Age (years)",   p: "e.g. 28",   t: "number" },
                      { k: "notes",  l: "Notes",         p: "How do you feel?", t: "text" },
                    ].map(({ k, l, p, t }) => (
                      <div key={k}>
                        <label className="text-muted-foreground text-xs block mb-1.5">{l}</label>
                        <input type={t} placeholder={p} value={logForm[k as keyof typeof logForm]} onChange={e => setLogForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                      </div>
                    ))}
                    <button onClick={handleLogHealth} className="col-span-2 md:col-span-4 bg-primary text-white py-2.5 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>LOG METRICS</button>
                  </div>
                </div>

                {/* History */}
                <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 style={H(17)} className="text-foreground">LOG HISTORY</h3>
                    <span className="text-muted-foreground text-xs">{healthLogs.length} entries</span>
                  </div>
                  <table className="w-full">
                    <thead><tr className="border-b border-border">{["Date","Weight","BMI","Height","Age","Change","Notes"].map(h => <th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                    <tbody>
                      {healthLogs.map((log, i) => {
                        const prev = healthLogs[i + 1];
                        const delta = prev ? (log.weight - prev.weight).toFixed(1) : null;
                        return (
                          <tr key={`${log.date}-${i}`} className="border-b border-border hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 text-sm text-foreground">{log.date}</td>
                            <td className="px-4 py-3 text-sm text-foreground">{log.weight} kg</td>
                            <td className="px-4 py-3 text-sm text-foreground">{log.bmi}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{log.height} cm</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{log.age} yrs</td>
                            <td className="px-4 py-3 text-sm">
                              {delta !== null ? <span className={parseFloat(delta) < 0 ? "text-green-400" : "text-red-400"}>{parseFloat(delta) < 0 ? "↓" : "↑"}{Math.abs(parseFloat(delta))} kg</span> : <span className="text-muted-foreground">—</span>}
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{log.notes || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>
                <div className="bg-card border border-border p-6 mb-4" style={{ borderRadius: "var(--radius)" }}>
                  <h3 style={H(17)} className="text-foreground mb-3">BASIC WEIGHT LOG</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[{k:"weight",l:"Weight (kg) *",p:"76.8",t:"number"},{k:"height",l:"Height (cm)",p:"165",t:"number"},{k:"age",l:"Age",p:"28",t:"number"}].map(({k,l,p,t}) => (
                      <div key={k}>
                        <label className="text-muted-foreground text-xs block mb-1.5">{l}</label>
                        <input type={t} placeholder={p} value={logForm[k as keyof typeof logForm]} onChange={e => setLogForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                      </div>
                    ))}
                    <button onClick={handleLogHealth} className="col-span-2 md:col-span-3 bg-primary text-white py-2.5 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>LOG</button>
                  </div>
                </div>
                <LockedFeature label="Progress charts & trend analysis" minPlan="PRO" />
                <div className="mt-2"><LockedFeature label="Full health history table" minPlan="PRO" /></div>
              </div>
            )}
          </div>
        )}

        {/* ════ MEMBERSHIP ════ */}
        {tab === "membership" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-6">MY MEMBERSHIP</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className={`lg:col-span-2 p-6 border-2 ${planLabel === "ELITE" ? "border-orange-400/40 bg-orange-400/5" : planLabel === "PRO" ? "border-primary/30 bg-primary/5" : "border-border"}`} style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 text-xs ${planLabel === "ELITE" ? "bg-orange-400/20 text-orange-400" : "bg-primary/20 text-primary"}`} style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> ACTIVE
                    </div>
                    <h2 style={H(34)} className="text-foreground">{planLabel} MEMBER</h2>
                    <p className="text-muted-foreground text-sm">Member since {user.joined ?? "Jun 2026"}</p>
                  </div>
                  <CreditCard size={24} className={planColor} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {(planLabel === "ELITE" ? ["24/7 access","All classes","4 PT sessions","Body scans","Guest passes","Nutrition"] : planLabel === "PRO" ? ["Unlimited access","All classes","1 PT session","Full dashboard","Priority booking","Alerts"] : ["Gym access","2 classes/month","Basic tracking","Locker room"]).map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check size={12} className={planColor} />{f}</div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {planLabel !== "ELITE" && <button onClick={() => setUpgradeModal(true)} className={`flex-1 text-white py-2.5 text-sm ${planLabel === "PRO" ? "bg-orange-400 hover:bg-orange-300" : "bg-primary hover:bg-primary/90"} transition-colors`} style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO {planLabel === "PRO" ? "ELITE" : "PRO"} →</button>}
                  <button onClick={() => toast.info("Membership paused for 1 month")} className="border border-border text-muted-foreground px-5 py-2.5 text-sm hover:border-primary transition-colors" style={{ borderRadius: "var(--radius)" }}>Pause</button>
                </div>
              </div>
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(17)} className="text-foreground mb-4">PAYMENT METHOD</h3>
                <div className="bg-secondary p-4 mb-4" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-center justify-between mb-2"><span className="text-muted-foreground text-xs">Razorpay Auto-debit</span><span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={10} /> Active</span></div>
                  <p className="text-foreground text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-muted-foreground text-xs">HDFC Visa · Expires 08/28</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Next charge</span><span className="text-foreground">₹{planLabel === "ELITE" ? "3,499" : planLabel === "PRO" ? "1,999" : "999"} on Jun 18</span></div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 style={H(17)} className="text-foreground">PAYMENT HISTORY</h3>
                <button className="flex items-center gap-2 text-xs text-muted-foreground border border-border px-3 py-1.5 hover:border-primary transition-colors" style={{ borderRadius: "var(--radius)" }}><Download size={12} /> Download</button>
              </div>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Date","Description","Amount","Status","Invoice"].map(h => <th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p, i) => (
                    <tr key={i} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-5 py-3 text-sm text-foreground">{p.date}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{p.desc}</td>
                      <td className="px-5 py-3 text-sm text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>₹{p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 ${p.status === "paid" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`} style={{ borderRadius: "var(--radius)" }}>{p.status}</span></td>
                      <td className="px-5 py-3 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {tab === "notifications" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div><h1 style={H(30)} className="text-foreground">NOTIFICATIONS</h1><p className="text-muted-foreground text-sm">{unread} unread</p></div>
              <button onClick={() => { setNotifications(p => p.map(n => ({ ...n, read: true }))); toast.success("All marked as read"); }} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 text-sm hover:border-primary transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <CheckCircle size={14} /> Mark all read
              </button>
            </div>
            <div className="space-y-3 max-w-2xl">
              {notifications.map(n => (
                <div key={n.id} className={`flex gap-4 p-4 border transition-all ${!n.read ? n.type === "warning" ? "border-yellow-400/30 bg-yellow-400/5" : n.type === "offer" ? "border-primary/30 bg-primary/5" : n.type === "cancel" ? "border-red-400/20 bg-red-400/5" : "border-blue-400/20 bg-blue-400/5" : "border-border bg-card opacity-60"}`} style={{ borderRadius: "var(--radius)" }}>
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.type === "warning" ? "bg-yellow-400" : n.type === "offer" ? "bg-primary" : n.type === "cancel" ? "bg-red-400" : "bg-blue-400"}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2"><p className="text-foreground text-sm font-medium">{n.title}</p><span className="text-muted-foreground text-xs shrink-0">{n.time}</span></div>
                    <p className="text-muted-foreground text-sm mt-1">{n.msg}</p>
                  </div>
                  <button onClick={() => setNotifications(p => p.filter(x => x.id !== n.id))} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upgrade modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setUpgradeModal(false)}>
          <div className="bg-card border border-border w-full max-w-md p-6" style={{ borderRadius: "var(--radius)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5"><h2 style={H(22)} className="text-foreground">UPGRADE YOUR PLAN</h2><button onClick={() => setUpgradeModal(false)}><X size={18} className="text-muted-foreground" /></button></div>
            <div className="space-y-3 mb-5">
              {[{name:"PRO",price:1999,features:["Unlimited classes","1 PT session/month","Full health dashboard","Priority booking"],color:"border-primary bg-primary/5"},{name:"ELITE",price:3499,features:["4 PT sessions/month","Body scans","Guest passes","Nutrition"],color:"border-orange-400/40 bg-orange-400/5"}].filter(p => p.name !== planLabel).map(p => (
                <div key={p.name} className={`border-2 ${p.color} p-4`} style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-center justify-between mb-2"><span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 800 }} className="text-primary">{p.name}</span><span style={H(20)} className="text-foreground">₹{p.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/mo</span></span></div>
                  {p.features.map(f => <p key={f} className="text-muted-foreground text-xs flex items-center gap-1"><Check size={10} className="text-primary" />{f}</p>)}
                  <button onClick={() => { setUpgradeModal(false); toast.success(`Upgraded to ${p.name}!`, { description: "Your new features are now active." }); }} className="w-full mt-3 bg-primary text-white py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>UPGRADE TO {p.name}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
