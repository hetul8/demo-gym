import { useState } from "react";
import { toast } from "sonner";
import {
  Users, TrendingUp, Calendar, FileText, Target, Globe,
  Home, LogOut, Search, CheckCircle, XCircle, AlertCircle,
  Plus, Edit2, Trash2, Send, Download, Dumbbell, Bell,
  X, Check, RefreshCw, ArrowUp, ArrowDown, Eye, UserPlus,
  ToggleLeft, ToggleRight, Save, Image, Type, DollarSign, Settings
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import type { SiteContent, TrainerData, AuthUser, BrandSettings, BroadcastMessage } from "../App";

/* ─── DATA ─────────────────────────────────────────────────── */
const REVENUE_DATA = [
  { month: "Jan", revenue: 412000, refunds: 12000, new_members: 38 },
  { month: "Feb", revenue: 398000, refunds: 8000,  new_members: 31 },
  { month: "Mar", revenue: 445000, refunds: 15000, new_members: 44 },
  { month: "Apr", revenue: 467000, refunds: 9000,  new_members: 52 },
  { month: "May", revenue: 489000, refunds: 11000, new_members: 48 },
  { month: "Jun", revenue: 512000, refunds: 7000,  new_members: 56 },
];

const PLAN_DATA = [
  { name: "Starter", value: 620,  color: "#555" },
  { name: "Pro",     value: 1240, color: "#ef2d2d" },
  { name: "Elite",   value: 540,  color: "#f97316" },
];

const INITIAL_CLASSES = [
  { id: 1, name: "Power Yoga",          trainer: "Priya Sharma",  schedule: "Mon/Wed/Fri 6:00 AM", capacity: 15, enrolled: 12, status: "active" },
  { id: 2, name: "Zumba Blast",         trainer: "Neha Kapoor",   schedule: "Mon/Thu 7:30 AM",     capacity: 20, enrolled: 20, status: "active" },
  { id: 3, name: "Boxing Fundamentals", trainer: "Arjun Mehta",   schedule: "Tue/Thu 9:00 AM",     capacity: 10, enrolled: 6,  status: "active" },
  { id: 4, name: "HIIT Circuit",        trainer: "Rahul Nair",    schedule: "Daily 6:00 PM",       capacity: 20, enrolled: 15, status: "active" },
  { id: 5, name: "Pilates Core",        trainer: "Sneha Roy",     schedule: "Wed/Sat 8:00 AM",     capacity: 12, enrolled: 9,  status: "paused" },
];

const INITIAL_LEADS = [
  { id: 1, name: "Divya Sharma",    phone: "+91 98001 11234", email: "divya@email.com",    date: "Jun 12", source: "Walk-in",   status: "new",       interest: "PRO",    notes: "" },
  { id: 2, name: "Amit Patel",      phone: "+91 97002 22345", email: "amit@email.com",     date: "Jun 11", source: "Website",   status: "contacted", interest: "ELITE",  notes: "Called 2x" },
  { id: 3, name: "Riya Nair",       phone: "+91 96003 33456", email: "riya@email.com",     date: "Jun 10", source: "Instagram", status: "converted", interest: "PRO",    notes: "" },
  { id: 4, name: "Siddharth Gupta", phone: "+91 95004 44567", email: "sid@email.com",      date: "Jun 9",  source: "Referral",  status: "new",       interest: "STARTER",notes: "" },
  { id: 5, name: "Pooja Mehta",     phone: "+91 94005 55678", email: "pooja@email.com",    date: "Jun 8",  source: "Walk-in",   status: "cold",      interest: "PRO",    notes: "No answer" },
];

const TRANSACTIONS = [
  { date: "Jun 13", member: "Anjali Verma",  type: "Subscription", amount: 1999,  status: "success" },
  { date: "Jun 13", member: "Meera Pillai",  type: "PT Session",   amount: 1400,  status: "success" },
  { date: "Jun 12", member: "Rohan Desai",   type: "Subscription", amount: 3499,  status: "success" },
  { date: "Jun 11", member: "Priya Rao",     type: "Subscription", amount: 999,   status: "failed"  },
  { date: "Jun 11", member: "Karan Shah",    type: "Refund",       amount: -1999, status: "refunded"},
  { date: "Jun 10", member: "Aditya Kumar",  type: "Subscription", amount: 3499,  status: "success" },
];

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });
const TT = { background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#f0f0f0", fontSize: "12px" };

/* ─── PROPS ─────────────────────────────────────────────────── */
interface AdminPanelProps {
  onNavigate: (v: string) => void;
  content: SiteContent;
  onUpdateContent: (c: SiteContent) => void;
  trainers: TrainerData[];
  onUpdateTrainers: (t: TrainerData[]) => void;
  members: AuthUser[];
  setMembers: React.Dispatch<React.SetStateAction<AuthUser[]>>;
  brandSettings: BrandSettings;
  onUpdateBrandSettings: (s: BrandSettings) => void;
  broadcasts: BroadcastMessage[];
  setBroadcasts: React.Dispatch<React.SetStateAction<BroadcastMessage[]>>;
}

export function AdminPanel({
  onNavigate,
  content,
  onUpdateContent,
  trainers,
  onUpdateTrainers,
  members,
  setMembers,
  brandSettings,
  onUpdateBrandSettings,
  broadcasts,
  setBroadcasts
}: AdminPanelProps) {
  const [tab, setTab] = useState<"overview"|"members"|"financial"|"classes"|"content"|"trainers_admin"|"leads"|"settings">("overview");
  const [classes, setClasses]     = useState(INITIAL_CLASSES);
  const [leads, setLeads]         = useState(INITIAL_LEADS);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPlanFilter, setMemberPlanFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState<AuthUser|null>(null);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [addClassModal, setAddClassModal]   = useState(false);
  const [addTrainerModal, setAddTrainerModal] = useState(false);
  
  const [newMemberForm, setNewMemberForm]   = useState({ name: "", email: "", phone: "", plan: "PRO" });
  const [newClassForm, setNewClassForm]     = useState({ name: "", trainer: "", schedule: "", capacity: "" });
  const [newTrainerForm, setNewTrainerForm] = useState({
    name: "",
    email: "",
    specialty: "",
    cert: "",
    fee: "1200",
    exp: "5 yrs",
    bio: "",
    image: "photo-1534438327276-14e5300c3a48"
  });

  const [selectedLead, setSelectedLead]     = useState<typeof INITIAL_LEADS[0]|null>(null);
  const [leadNote, setLeadNote]             = useState("");
  const [discountSent, setDiscountSent]     = useState<Set<number>>(new Set());
  const [broadcastMsg, setBroadcastMsg]     = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("All Members");
  const [broadcastChannel, setBroadcastChannel] = useState("WhatsApp");
  const [chartView, setChartView]           = useState<"revenue"|"members">("revenue");

  // Local state for settings editing
  const [settingsForm, setSettingsForm] = useState<BrandSettings>({ ...brandSettings });

  /* Content editor local state */
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [contentSection, setContentSection] = useState<"hero"|"pricing"|"features"|"offers"|"blog"|"announcement">("hero");

  const saveContent = () => { onUpdateContent(localContent); toast.success("Website content updated — changes are live!"); };

  const handleSaveBrandSettings = () => {
    onUpdateBrandSettings({ ...settingsForm });
    toast.success("Gym settings updated! Dynamic whitelabeling complete.");
  };

  const filteredMembers = members.filter(m =>
    (memberPlanFilter === "All" || m.plan === memberPlanFilter) &&
    (m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const toggleBlock = (id: string) => {
    setMembers(p => p.map(m => m.id === id ? { ...m, status: m.status === "blocked" ? "active" : "blocked" } : m));
    const m = members.find(x => x.id === id);
    toast.success(`${m?.name} status toggled`);
  };

  const handleAddMember = () => {
    const nameTrim = newMemberForm.name.trim();
    const emailTrim = newMemberForm.email.trim();
    const phoneClean = newMemberForm.phone.replace(/[^0-9]/g, "");

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(nameTrim)) {
      toast.error("Name must contain only letters and spaces (min 2 chars).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailTrim)) {
      toast.error("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    if (phoneClean.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile phone number.");
      return;
    }

    if (members.some(m => m.email.toLowerCase() === emailTrim.toLowerCase())) {
      toast.error("Email is already registered as a member.");
      return;
    }

    const newM: AuthUser = {
      id: `U${Date.now()}`,
      name: nameTrim,
      email: emailTrim.toLowerCase(),
      phone: `+91 ${phoneClean.slice(0, 5)} ${phoneClean.slice(5)}`,
      role: newMemberForm.plan.toLowerCase() as AuthUser["role"],
      plan: newMemberForm.plan as AuthUser["plan"],
      joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      age: 25,
      height: 170,
      status: "active",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      revenue: newMemberForm.plan === "ELITE" ? 3499 : newMemberForm.plan === "PRO" ? 1999 : 999
    };
    
    setMembers(p => [...p, newM]);
    setAddMemberModal(false);
    setNewMemberForm({ name: "", email: "", phone: "", plan: "PRO" });
    toast.success(`${nameTrim} added successfully`);
  };

  const handleAddClass = () => {
    if (!newClassForm.name) { toast.error("Class name required"); return; }
    setClasses(p => [...p, { ...newClassForm, id: p.length+1, enrolled: 0, capacity: parseInt(newClassForm.capacity)||15, status: "active" }]);
    setAddClassModal(false);
    setNewClassForm({ name: "", trainer: "", schedule: "", capacity: "" });
    toast.success("Class added");
  };

  /* Add Trainer */
  const handleAddTrainer = () => {
    const nameTrim = newTrainerForm.name.trim();
    const emailTrim = newTrainerForm.email.trim();
    const specialtyTrim = newTrainerForm.specialty.trim();

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(nameTrim)) {
      toast.error("Name must contain only letters and spaces (min 2 chars).");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailTrim)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!specialtyTrim) {
      toast.error("Specialty is required.");
      return;
    }

    const feeNum = parseInt(newTrainerForm.fee);
    if (isNaN(feeNum) || feeNum <= 0) {
      toast.error("Fee must be a positive number.");
      return;
    }

    if (trainers.some(t => t.email.toLowerCase() === emailTrim.toLowerCase())) {
      toast.error("Email is already registered as a trainer.");
      return;
    }

    const newT: TrainerData = {
      id: trainers.length + 1,
      name: nameTrim,
      email: emailTrim.toLowerCase(),
      specialty: specialtyTrim,
      cert: newTrainerForm.cert.trim() || "Certified Professional",
      fee: feeNum,
      exp: newTrainerForm.exp.trim() || "3 yrs",
      bio: newTrainerForm.bio.trim() || "Personal Fitness Trainer.",
      image: newTrainerForm.image.trim() || "photo-1534438327276-14e5300c3a48",
      rating: 4.8,
      reviews: 12,
      sessions: 48,
      available: ["Mon 9AM", "Wed 10AM", "Fri 3PM"],
      announcements: [],
      active: true,
    };

    onUpdateTrainers([...trainers, newT]);
    setAddTrainerModal(false);
    setNewTrainerForm({
      name: "",
      email: "",
      specialty: "",
      cert: "",
      fee: "1200",
      exp: "5 yrs",
      bio: "",
      image: "photo-1534438327276-14e5300c3a48"
    });
    toast.success(`${newT.name} added as a trainer!`);
  };

  /* Remove Trainer */
  const handleRemoveTrainer = (id: number, name: string) => {
    onUpdateTrainers(trainers.filter(t => t.id !== id));
    toast.success(`${name} has been removed.`);
  };

  /* Open pre-filled WhatsApp click-to-chat link for payment reminder */
  const sendWhatsAppReminder = (member: AuthUser) => {
    const rawNumber = member.phone ? member.phone.replace(/[^0-9]/g, "") : "919999999999";
    const templateMsg = `Dear ${member.name}, this is a friendly reminder from ${brandSettings.name} regarding your ${member.plan || "Membership"} plan. Please make your renewal payment to continue enjoying your sessions. Thank you!`;
    const url = `https://wa.me/${rawNumber}?text=${encodeURIComponent(templateMsg)}`;
    window.open(url, "_blank");
    toast.success(`Opening WhatsApp Web for ${member.name}`);
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg.trim()) { toast.error("Enter a message"); return; }
    
    // Determine target group enum
    let targetGroup: "ALL" | "UNPAID" | "ACTIVE" = "ALL";
    if (broadcastTarget === "Expiring in 7 days") targetGroup = "UNPAID";
    else if (broadcastTarget.includes("Members")) targetGroup = "ACTIVE";
    
    const newBroadcast: BroadcastMessage = {
      id: `B${Date.now()}`,
      sender: "Admin",
      text: broadcastMsg,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      targetGroup,
    };
    
    setBroadcasts(prev => [newBroadcast, ...prev]);
    
    if (broadcastChannel === "WhatsApp") {
      toast.success(`Broadcasted to ${members.length} users on WhatsApp!`);
    } else {
      toast.success(`Broadcast posted to all ${broadcastChannel} user feeds!`);
    }

    setBroadcastMsg("");
  };

  const sideNav = [
    { id: "overview",        label: "Overview",        icon: Home       },
    { id: "members",         label: "Members",         icon: Users      },
    { id: "financial",       label: "Financial",       icon: TrendingUp },
    { id: "classes",         label: "Classes",         icon: Calendar   },
    { id: "content",         label: "Website Content", icon: Globe      },
    { id: "trainers_admin",  label: "Trainer Accounts",icon: Users      },
    { id: "leads",           label: "Leads",           icon: Target     },
    { id: "settings",        label: "Gym Branding",    icon: Settings   },
  ] as const;

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside className="w-60 flex flex-col border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
          ) : (
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          )}
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px", fontWeight: 800, letterSpacing: "0.05em" }} className="text-foreground uppercase">{brandSettings.name}</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sideNav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>
              <Icon size={14} /> {label}
              {id === "leads" && <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 rounded-full">{leads.filter(l=>l.status==="new").length}</span>}
              {id === "content" && <span className="ml-auto text-xs bg-green-400/20 text-green-400 px-1.5 rounded-full">Live</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={() => onNavigate("landing")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground" style={{ borderRadius: "var(--radius)" }}><Eye size={14} /> View Site</button>
          <button onClick={() => onNavigate("logout")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground" style={{ borderRadius: "var(--radius)" }}><LogOut size={14} /> Log Out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">

        {/* ════ OVERVIEW ════ */}
        {tab === "overview" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div><h1 style={H(30)} className="text-foreground">DASHBOARD OVERVIEW</h1><p className="text-muted-foreground text-sm mt-1">Saturday, June 13, 2026 · {brandSettings.name} HQ</p></div>
              <button onClick={() => toast.success("Report exported")} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 text-sm hover:border-primary" style={{ borderRadius: "var(--radius)" }}><Download size={14} /> Export</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Members",    value: String(members.filter(m => m.role !== "guest").length), delta: `+${members.length} total users`, up: true,  icon: Users,       color: "text-primary" },
                { label: "Monthly Revenue",  value: `₹${(members.filter(m => m.role !== "guest").reduce((acc, m) => acc + (m.plan === "ELITE" ? 3499 : m.plan === "PRO" ? 1999 : 999), 0) + 512000).toLocaleString()}`, delta: "+4.7% vs May",  up: true,  icon: TrendingUp,  color: "text-green-400" },
                { label: "Classes Today",    value: "12",                   delta: "4 fully booked", up: true,  icon: Calendar,    color: "text-blue-400" },
                { label: "WhatsApp Broadcasts", value: String(broadcasts.length), delta: "Sent logs",    up: true, icon: AlertCircle, color: "text-yellow-400" },
              ].map(({ label, value, delta, up, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-start justify-between mb-2"><span className="text-muted-foreground text-xs">{label}</span><Icon size={15} className={color} /></div>
                  <p style={H(24)} className="text-foreground">{value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-yellow-400"}`}>{up?<ArrowUp size={10}/>:<ArrowDown size={10}/>}{delta}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={H(17)} className="text-foreground">PERFORMANCE</h3>
                  <div className="flex gap-1">
                    {(["revenue","members"] as const).map(v => (
                      <button key={v} onClick={() => setChartView(v)} className={`text-xs px-3 py-1 capitalize transition-all ${chartView===v?"bg-primary text-white":"border border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>{v}</button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs><linearGradient id="adminOverviewGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef2d2d" stopOpacity={0.3}/><stop offset="100%" stopColor="#ef2d2d" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill:"#777", fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:"#777", fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => chartView==="revenue"?`₹${(v/1000).toFixed(0)}K`:String(v)} />
                    <Tooltip contentStyle={TT} formatter={(v:number) => [chartView==="revenue"?`₹${(v/1000).toFixed(0)}K`:v]} />
                    <Area key={chartView} type="monotone" dataKey={chartView==="revenue"?"revenue":"new_members"} stroke="#ef2d2d" fill="url(#adminOverviewGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(17)} className="text-foreground mb-4">PLAN SPLIT</h3>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart><Pie data={PLAN_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">{PLAN_DATA.map(e=><Cell key={`admin-pie-${e.name}`} fill={e.color}/>)}</Pie><Tooltip contentStyle={TT}/></PieChart>
                </ResponsiveContainer>
                {PLAN_DATA.map(p=><div key={p.name} className="flex items-center justify-between text-xs mb-1.5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-muted-foreground">{p.name}</span></div><span className="text-foreground">{p.value}</span></div>)}
              </div>
            </div>
          </div>
        )}

        {/* ════ MEMBERS ════ */}
        {tab === "members" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 style={H(30)} className="text-foreground">MEMBER MANAGEMENT</h1>
              <button onClick={() => setAddMemberModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90" style={{ borderRadius: "var(--radius)" }}><UserPlus size={14}/> Add Member</button>
            </div>
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input placeholder="Search name or email…" value={memberSearch} onChange={e=>setMemberSearch(e.target.value)} className="bg-card border border-border pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)",width:"220px"}}/></div>
              {["All","PRO","ELITE","STARTER"].map(p=><button key={p} onClick={()=>setMemberPlanFilter(p)} className={`px-3 py-2 text-xs transition-all ${memberPlanFilter===p?"bg-primary/10 text-primary border border-primary/30":"border border-border text-muted-foreground hover:border-primary"}`} style={{borderRadius:"var(--radius)"}}>{p}</button>)}
              <span className="ml-auto text-muted-foreground text-sm flex items-center">{filteredMembers.length} members</span>
            </div>
            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["ID","Name","Plan","Status","Phone","Actions"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {filteredMembers.map(m=>(
                    <tr key={m.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer" onClick={()=>setSelectedMember(m)}>
                      <td className="px-4 py-3 text-xs text-muted-foreground" style={{fontFamily:"'JetBrains Mono',monospace"}}>{m.id}</td>
                      <td className="px-4 py-3"><p className="text-foreground text-sm font-semibold">{m.name}</p><p className="text-muted-foreground text-xs">{m.email}</p></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 uppercase ${m.plan==="ELITE"?"text-orange-400 bg-orange-400/10":m.plan==="PRO"?"text-primary bg-primary/10": m.role === "guest" ? "text-yellow-400 bg-yellow-400/10" : "text-muted-foreground bg-secondary"}`} style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{m.plan}</span>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs flex items-center gap-1 ${m.role==="guest"?"text-yellow-400": "text-green-400"}`}><CheckCircle size={11}/> {m.role === "guest" ? "Day Pass Active" : "Member"}</span></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{m.phone || "No phone"}</td>
                      <td className="px-4 py-3" onClick={e=>e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={()=>sendWhatsAppReminder(m)} className="text-xs px-2.5 py-1 border border-primary/30 text-primary hover:bg-primary/10 rounded" style={{borderRadius:"var(--radius)"}}>Remind via WA</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedMember && (
              <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={()=>setSelectedMember(null)}>
                <div className="bg-card border-l border-border w-full max-w-md h-full overflow-y-auto p-6" onClick={e=>e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5"><h2 style={H(20)} className="text-foreground">MEMBER DETAIL</h2><button onClick={()=>setSelectedMember(null)}><X size={18} className="text-muted-foreground"/></button></div>
                  <div className="flex items-center gap-4 mb-5 p-4 bg-secondary" style={{borderRadius:"var(--radius)"}}><div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary text-lg font-bold">{selectedMember.name[0]}</div><div><p style={H(18)} className="text-foreground">{selectedMember.name}</p><p className="text-muted-foreground text-xs">{selectedMember.email}</p><p className="text-muted-foreground text-xs">{selectedMember.phone}</p></div></div>
                  {[["ID",selectedMember.id],["Plan",selectedMember.plan || "Free Day Pass"],["Role",selectedMember.role],["Joined",selectedMember.joined || "N/A"]].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm"><span className="text-muted-foreground">{k}</span><span className="text-foreground font-medium">{v}</span></div>
                  ))}
                  <div className="flex gap-2 mt-5">
                    <button onClick={()=>{sendWhatsAppReminder(selectedMember); setSelectedMember(null);}} className="flex-1 py-2 text-sm bg-primary text-white hover:bg-primary/90 rounded" style={{borderRadius:"var(--radius)"}}>WhatsApp Reminder</button>
                  </div>
                </div>
              </div>
            )}
            {addMemberModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setAddMemberModal(false)}>
                <div className="bg-card border border-border w-full max-w-md p-6" style={{borderRadius:"var(--radius)"}} onClick={e=>e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4"><h2 style={H(22)} className="text-foreground">ADD MEMBER</h2><button onClick={()=>setAddMemberModal(false)}><X size={18} className="text-muted-foreground"/></button></div>
                  <div className="space-y-3">
                    {[{k:"name",l:"Full Name *",p:"Anjali Verma"},{k:"email",l:"Email *",p:"anjali@email.com"},{k:"phone",l:"Phone",p:"+91 98765 43210"}].map(({k,l,p})=>(
                      <div key={k}><label className="text-muted-foreground text-xs block mb-1.5">{l}</label><input placeholder={p} value={newMemberForm[k as keyof typeof newMemberForm]} onChange={e=>setNewMemberForm(f=>({...f,[k]:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                    ))}
                    <div><label className="text-muted-foreground text-xs block mb-1.5">Plan</label><select value={newMemberForm.plan} onChange={e=>setNewMemberForm(f=>({...f,plan:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option>STARTER</option><option>PRO</option><option>ELITE</option></select></div>
                  </div>
                  <button onClick={handleAddMember} className="w-full mt-5 bg-primary text-white py-3 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>ADD MEMBER</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ FINANCIAL ════ */}
        {tab === "financial" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5"><h1 style={H(30)} className="text-foreground">FINANCIAL DASHBOARD</h1><button onClick={()=>toast.success("Exported")} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 text-sm hover:border-primary" style={{borderRadius:"var(--radius)"}}><Download size={14}/> CSV</button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[{label:"Revenue This Month",value:"₹5,12,000",delta:"+4.7%",up:true},{label:"Pending Payments",value:"₹34,200",delta:"18 overdue",up:false},{label:"Refunds",value:"₹7,000",delta:"3 this month",up:true}].map(({label,value,delta,up})=>(
                <div key={label} className="bg-card border border-border p-6" style={{borderRadius:"var(--radius)"}}><p className="text-muted-foreground text-xs mb-2">{label}</p><p style={H(28)} className="text-foreground">{value}</p><p className={`text-xs mt-1 flex items-center gap-1 ${up?"text-green-400":"text-yellow-400"}`}>{up?<ArrowUp size={10}/>:<ArrowDown size={10}/>}{delta}</p></div>
              ))}
            </div>
          </div>
        )}

        {/* ════ CLASSES ════ */}
        {tab === "classes" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5"><h1 style={H(30)} className="text-foreground">CLASS SCHEDULE</h1><button onClick={()=>setAddClassModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)"}}><Plus size={14}/> Add Class</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map(c=>(
                <div key={c.id} className="bg-card border border-border p-5" style={{borderRadius:"var(--radius)"}}>
                  <h3 style={H(18)} className="text-foreground mb-1">{c.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3">Trainer: {c.trainer}</p>
                  <p className="text-xs mb-4">Schedule: {c.schedule}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Enrolled: {c.enrolled}/{c.capacity}</span>
                    <span className={`px-2 py-0.5 ${c.status==="active"?"text-green-400 bg-green-400/10":"text-yellow-400 bg-yellow-400/10"}`} style={{borderRadius:"var(--radius)"}}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ WEBSITE CONTENT ════ */}
        {tab === "content" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div><h1 style={H(30)} className="text-foreground">WEBSITE CONTENT</h1><p className="text-muted-foreground text-sm mt-1">Changes are live instantly on save.</p></div>
              <button onClick={saveContent} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}><Save size={14}/> SAVE CONTENT CHANGES</button>
            </div>
            <div className="flex border-b border-border mb-6">
              {(["hero","pricing","features","offers","blog","announcement"] as const).map(s=>(
                <button key={s} onClick={()=>setContentSection(s)} className={`px-4 py-2.5 text-sm capitalize transition-all ${contentSection===s?"border-b-2 border-primary text-primary font-medium":"text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
            </div>

            {/* ── HERO ── */}
            {contentSection === "hero" && (
              <div className="space-y-4 max-w-xl">
                <div><label className="text-muted-foreground text-xs block mb-1.5">Hero Headline</label><textarea rows={3} value={localContent.heroHeadline} onChange={e=>setLocalContent(p=>({...p,heroHeadline:e.target.value}))} className="w-full bg-card border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/></div>
                <div><label className="text-muted-foreground text-xs block mb-1.5">Hero Subtitle</label><textarea rows={2} value={localContent.heroSubHeadline} onChange={e=>setLocalContent(p=>({...p,heroSubHeadline:e.target.value}))} className="w-full bg-card border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/></div>
              </div>
            )}
          </div>
        )}

        {/* ════ GYM BRANDING SETTINGS ════ */}
        {tab === "settings" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 style={H(30)} className="text-foreground">GYM BRANDING & SETTINGS</h1>
                <p className="text-muted-foreground text-sm mt-1">Whitelabel this application instantly for your clients or new business name.</p>
              </div>
              <button
                onClick={handleSaveBrandSettings}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-sm hover:bg-primary/90"
                style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                <Save size={14}/> SAVE SETTINGS
              </button>
            </div>

            <div className="bg-card border border-border p-6 max-w-xl space-y-4" style={{ borderRadius: "var(--radius)" }}>
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Gym Name</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={e => setSettingsForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. IronFit Gym"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div>
                <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Logo Image URL (leave empty for default icon)</label>
                <input
                  type="text"
                  value={settingsForm.logoUrl}
                  onChange={e => setSettingsForm(p => ({ ...p, logoUrl: e.target.value }))}
                  placeholder="e.g. https://domain.com/logo.png"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div>
                <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Contact WhatsApp Phone Number (digits only, e.g. 919876543210)</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={e => setSettingsForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, "") }))}
                  placeholder="e.g. 919876543210"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div>
                <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Default Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={e => setSettingsForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. info@titanfitness.com"
                  className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  style={{ borderRadius: "var(--radius)" }}
                />
              </div>

              <div className="border-t border-border/60 pt-4 mt-2">
                <h4 className="text-xs text-primary font-bold uppercase mb-3">Supabase Cloud Database (Optional)</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Supabase Project URL</label>
                    <input
                      type="text"
                      value={settingsForm.supabaseUrl || ""}
                      onChange={e => setSettingsForm(p => ({ ...p, supabaseUrl: e.target.value.trim() }))}
                      placeholder="https://yourproject.supabase.co"
                      className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                      style={{ borderRadius: "var(--radius)" }}
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground text-xs block mb-1.5 font-medium">Supabase Anon Key</label>
                    <input
                      type="text"
                      value={settingsForm.supabaseAnonKey || ""}
                      onChange={e => setSettingsForm(p => ({ ...p, supabaseAnonKey: e.target.value.trim() }))}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                      style={{ borderRadius: "var(--radius)" }}
                    />
                  </div>
                </div>

                <div className="bg-secondary/40 p-4 border border-border mt-4 space-y-2" style={{ borderRadius: "var(--radius)" }}>
                  <p className="text-xs text-muted-foreground font-semibold uppercase text-primary">Supabase Table Setup Instructions</p>
                  <p className="text-xs text-muted-foreground">To synchronize members and broadcasts between different browsers in real-time, execute this SQL in your Supabase Dashboard:</p>
                  <pre className="text-[10px] bg-black/60 p-2 overflow-x-auto text-muted-foreground rounded border border-white/5" style={{ fontFamily: "monospace" }}>
{`-- Create members table
create table members (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null,
  plan text,
  phone text,
  "trainerId" int,
  "hasUsedFreePass" boolean,
  joined text,
  age int,
  height int,
  status text,
  expires text,
  revenue float
);

-- Create broadcasts table
create table broadcasts (
  id text primary key,
  sender text not null,
  text text not null,
  timestamp text not null,
  "targetGroup" text not null
);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ TRAINER ACCOUNTS ════ */}
        {tab === "trainers_admin" && (
          <div className="p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 style={H(30)} className="text-foreground">TRAINER ACCOUNTS</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage trainer profiles, activate/deactivate accounts, and add or remove trainers.</p>
              </div>
              <button
                onClick={() => setAddTrainerModal(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90"
                style={{ borderRadius: "var(--radius)" }}
              >
                <UserPlus size={14}/> Add Trainer
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {trainers.map(t => (
                <div key={t.id} className="bg-card border border-border p-5 relative" style={{ borderRadius: "var(--radius)" }}>
                  <button
                    onClick={() => handleRemoveTrainer(t.id, t.name)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-400 transition-colors p-1"
                    title="Remove Trainer"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-start gap-4 mb-4 pr-6">
                    <img src={t.image.startsWith("http") ? t.image : `https://images.unsplash.com/${t.image}?w=64&h=64&fit=crop&auto=format`} alt={t.name} className="w-14 h-14 object-cover shrink-0" style={{ borderRadius: "var(--radius)" }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 style={H(18)} className="text-foreground">{t.name}</h3>
                          <p className="text-primary text-xs font-semibold">{t.specialty}</p>
                          <p className="text-muted-foreground text-xs">{t.email}</p>
                        </div>
                        <button onClick={() => { onUpdateTrainers(trainers.map(x => x.id === t.id ? { ...x, active: !x.active } : x)); toast.info(`${t.name} status updated`); }}>
                          {t.active ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    {[["Rating", `${t.rating}★`], ["Sessions", t.sessions.toLocaleString()], ["Fee", `₹${t.fee.toLocaleString()}`]].map(([l, v]) => (
                      <div key={l} className="bg-secondary/40 p-2" style={{ borderRadius: "var(--radius)" }}>
                        <p style={H(16)} className="text-foreground font-bold">{v}</p>
                        <p className="text-muted-foreground text-xs">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-border/40 pt-3">
                    <span className={`px-2 py-0.5 ${t.active ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>{t.active ? "Active" : "Deactivated"}</span>
                    <span className="text-muted-foreground">{t.exp} exp · {t.cert}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Trainer Modal */}
            {addTrainerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setAddTrainerModal(false)}>
                <div className="bg-card border border-border w-full max-w-md p-6" style={{borderRadius:"var(--radius)"}} onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 style={H(22)} className="text-foreground">ADD TRAINER</h2>
                    <button onClick={() => setAddTrainerModal(false)}><X size={18} className="text-muted-foreground"/></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-muted-foreground text-xs block mb-1.5">Full Name *</label>
                      <input placeholder="Priya Sharma" value={newTrainerForm.name} onChange={e=>setNewTrainerForm(f=>({...f,name:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs block mb-1.5">Email *</label>
                      <input type="email" placeholder="priya@ironfit.in" value={newTrainerForm.email} onChange={e=>setNewTrainerForm(f=>({...f,email:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs block mb-1.5">Specialty *</label>
                      <input placeholder="Yoga & Mindfulness" value={newTrainerForm.specialty} onChange={e=>setNewTrainerForm(f=>({...f,specialty:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-muted-foreground text-xs block mb-1.5">Certification</label>
                        <input placeholder="RYT-500" value={newTrainerForm.cert} onChange={e=>setNewTrainerForm(f=>({...f,cert:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs block mb-1.5">Experience</label>
                        <input placeholder="8 yrs" value={newTrainerForm.exp} onChange={e=>setNewTrainerForm(f=>({...f,exp:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-muted-foreground text-xs block mb-1.5">Session Fee (₹/hr)</label>
                        <input type="number" placeholder="1200" value={newTrainerForm.fee} onChange={e=>setNewTrainerForm(f=>({...f,fee:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs block mb-1.5">Photo Image Unsplash ID</label>
                        <input placeholder="photo-1594381898411-846e7d193883" value={newTrainerForm.image} onChange={e=>setNewTrainerForm(f=>({...f,image:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                      </div>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-xs block mb-1.5">Biography</label>
                      <textarea rows={3} placeholder="Certified trainer specializing in..." value={newTrainerForm.bio} onChange={e=>setNewTrainerForm(f=>({...f,bio:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/>
                    </div>
                  </div>
                  <button onClick={handleAddTrainer} className="w-full mt-5 bg-primary text-white py-3 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>ADD TRAINER</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ LEADS & BROADCASTS ════ */}
        {tab === "leads" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div><h1 style={H(30)} className="text-foreground">LEAD MANAGEMENT</h1><p className="text-muted-foreground text-sm mt-1">Visitors who claimed free pass.</p></div>
            </div>

            {/* Leads list table */}
            <div className="bg-card border border-border overflow-hidden mb-6" style={{ borderRadius: "var(--radius)" }}>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Name","Source","Interest","Status","Action"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {leads.map(lead=>(
                    <tr key={lead.id} className={`border-b border-border hover:bg-secondary/30 cursor-pointer ${selectedLead?.id===lead.id?"bg-primary/5":""}`} onClick={()=>{setSelectedLead(lead);setLeadNote(lead.notes);}}>
                      <td className="px-4 py-3"><p className="text-foreground text-sm">{lead.name}</p><p className="text-muted-foreground text-xs">{lead.date}</p></td>
                      <td className="px-4 py-3"><span className="text-xs border border-border text-muted-foreground px-2 py-0.5" style={{borderRadius:"var(--radius)"}}>{lead.source}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 ${lead.interest==="ELITE"?"text-orange-400 bg-orange-400/10":lead.interest==="PRO"?"text-primary bg-primary/10":"text-muted-foreground bg-secondary"}`} style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{lead.interest}</span></td>
                      <td className="px-4 py-3" onClick={e=>e.stopPropagation()}><select value={lead.status} onChange={e=>setLeads(p=>p.map(l=>l.id===lead.id?{...l,status:e.target.value}:l))} className={`text-xs border px-2 py-1 bg-transparent focus:outline-none ${lead.status==="converted"?"border-green-400/30 text-green-400":lead.status==="contacted"?"border-yellow-400/30 text-yellow-400":lead.status==="cold"?"border-border text-muted-foreground":"border-blue-400/30 text-blue-400"}`} style={{borderRadius:"var(--radius)"}}><option value="new">New</option><option value="contacted">Contacted</option><option value="converted">Converted</option><option value="cold">Cold</option></select></td>
                      <td className="px-4 py-3" onClick={e=>e.stopPropagation()}><button onClick={()=>{setDiscountSent(p=>new Set([...p,lead.id]));toast.success(`Offer sent to ${lead.name}`);}} className={`text-xs px-2.5 py-1 border transition-all ${discountSent.has(lead.id)?"border-green-400/30 text-green-400":"border-primary/30 text-primary hover:bg-primary/10"}`} style={{borderRadius:"var(--radius)"}}>{discountSent.has(lead.id)?"✓ Sent":"Send Offer"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Broadcast */}
            <div className="bg-card border border-border p-6" style={{borderRadius:"var(--radius)"}}>
              <h3 style={H(17)} className="text-foreground mb-4">BULK BROADCAST</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div><label className="text-muted-foreground text-xs block mb-1.5">Target</label><select value={broadcastTarget} onChange={e=>setBroadcastTarget(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option>All Members</option><option>New Leads Only</option><option>Expiring in 7 days</option><option>PRO Members</option><option>ELITE Members</option></select></div>
                <div><label className="text-muted-foreground text-xs block mb-1.5">Channel</label><select value={broadcastChannel} onChange={e=>setBroadcastChannel(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option>WhatsApp</option><option>Push Notification</option></select></div>
                <div className="md:col-span-2"><label className="text-muted-foreground text-xs block mb-1.5">Template</label><select onChange={e=>setBroadcastMsg(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option value="">— Select template —</option><option value="Your gym membership is expiring in 5 days! Renew now to keep your streak going. 💪">Expiry reminder</option><option value="🎉 SPECIAL OFFER: Get 25% off our annual plan. Upgrade inside the portal now!">Discount offer</option></select></div>
              </div>
              <textarea rows={2} value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder="Or type your message…" className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none mb-3" style={{borderRadius:"var(--radius)"}}/>
              <button onClick={handleSendBroadcast} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}><Send size={14}/> SEND BROADCAST</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
