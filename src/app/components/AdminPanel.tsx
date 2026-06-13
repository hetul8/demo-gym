import { useState } from "react";
import { toast } from "sonner";
import {
  Users, TrendingUp, Calendar, FileText, Target, Globe,
  Home, LogOut, Search, CheckCircle, XCircle, AlertCircle,
  Plus, Edit2, Trash2, Send, Download, Dumbbell, Bell,
  X, Check, RefreshCw, ArrowUp, ArrowDown, Eye, UserPlus,
  ToggleLeft, ToggleRight, Save, Image, Type, DollarSign
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import type { SiteContent, TrainerData } from "../App";

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
const INITIAL_MEMBERS = [
  { id: "M001", name: "Anjali Verma",   email: "anjali@ironfit.in",  phone: "+91 98765 43210", plan: "PRO",     status: "active",  joined: "Oct 12, 2025", expires: "Jun 18, 2026", revenue: 33687 },
  { id: "M002", name: "Rohan Desai",    email: "rohan@ironfit.in",   phone: "+91 97654 32109", plan: "ELITE",   status: "active",  joined: "Aug 3, 2025",  expires: "Aug 3, 2026",  revenue: 30999 },
  { id: "M003", name: "Priya Rao",      email: "priya@ironfit.in",   phone: "+91 96543 21098", plan: "STARTER", status: "expired", joined: "Jan 5, 2025",  expires: "Jun 5, 2026",  revenue: 8999  },
  { id: "M004", name: "Karan Shah",     email: "karan@ironfit.in",   phone: "+91 95432 10987", plan: "PRO",     status: "blocked", joined: "Mar 20, 2025", expires: "Mar 20, 2026", revenue: 7996  },
  { id: "M005", name: "Meera Pillai",   email: "meera@ironfit.in",   phone: "+91 94321 09876", plan: "PRO",     status: "active",  joined: "Nov 1, 2025",  expires: "Nov 1, 2026",  revenue: 17991 },
  { id: "M006", name: "Aditya Kumar",   email: "aditya@ironfit.in",  phone: "+91 93210 98765", plan: "ELITE",   status: "active",  joined: "Feb 14, 2025", expires: "Feb 14, 2026", revenue: 30999 },
  { id: "M007", name: "Sneha Joshi",    email: "sneha@ironfit.in",   phone: "+91 92109 87654", plan: "STARTER", status: "active",  joined: "Apr 8, 2026",  expires: "Jul 8, 2026",  revenue: 2997  },
  { id: "M008", name: "Vikram Singh",   email: "vikram@ironfit.in",  phone: "+91 91098 76543", plan: "PRO",     status: "active",  joined: "Dec 22, 2025", expires: "Dec 22, 2026", revenue: 11994 },
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
}

export function AdminPanel({ onNavigate, content, onUpdateContent, trainers, onUpdateTrainers }: AdminPanelProps) {
  const [tab, setTab] = useState<"overview"|"members"|"financial"|"classes"|"content"|"leads"|"trainers_admin">("overview");
  const [members, setMembers]     = useState(INITIAL_MEMBERS);
  const [classes, setClasses]     = useState(INITIAL_CLASSES);
  const [leads, setLeads]         = useState(INITIAL_LEADS);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPlanFilter, setMemberPlanFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState<typeof INITIAL_MEMBERS[0]|null>(null);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [addClassModal, setAddClassModal]   = useState(false);
  const [editClass, setEditClass]           = useState<typeof INITIAL_CLASSES[0]|null>(null);
  const [selectedLead, setSelectedLead]     = useState<typeof INITIAL_LEADS[0]|null>(null);
  const [leadNote, setLeadNote]             = useState("");
  const [discountSent, setDiscountSent]     = useState<Set<number>>(new Set());
  const [newMemberForm, setNewMemberForm]   = useState({ name: "", email: "", phone: "", plan: "PRO" });
  const [newClassForm, setNewClassForm]     = useState({ name: "", trainer: "", schedule: "", capacity: "" });
  const [broadcastMsg, setBroadcastMsg]     = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("All Members");
  const [broadcastChannel, setBroadcastChannel] = useState("WhatsApp");
  const [chartView, setChartView]           = useState<"revenue"|"members">("revenue");

  /* Content editor local state */
  const [localContent, setLocalContent] = useState<SiteContent>(content);
  const [contentSection, setContentSection] = useState<"hero"|"pricing"|"features"|"offers"|"blog"|"announcement">("hero");

  const saveContent = () => { onUpdateContent(localContent); toast.success("Website content updated — changes are live!"); };

  const filteredMembers = members.filter(m =>
    (memberPlanFilter === "All" || m.plan === memberPlanFilter) &&
    (m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const toggleBlock = (id: string) => {
    setMembers(p => p.map(m => m.id === id ? { ...m, status: m.status === "blocked" ? "active" : "blocked" } : m));
    const m = members.find(x => x.id === id);
    toast.success(`${m?.name} ${m?.status === "blocked" ? "unblocked" : "blocked"}`);
  };

  const handleAddMember = () => {
    if (!newMemberForm.name || !newMemberForm.email) { toast.error("Name and email required"); return; }
    setMembers(p => [...p, { ...newMemberForm, id: `M${String(p.length+1).padStart(3,"0")}`, status: "active", joined: "Jun 13, 2026", expires: "Jul 13, 2026", revenue: 0 }]);
    setAddMemberModal(false);
    setNewMemberForm({ name: "", email: "", phone: "", plan: "PRO" });
    toast.success(`${newMemberForm.name} added`);
  };

  const handleAddClass = () => {
    if (!newClassForm.name) { toast.error("Class name required"); return; }
    setClasses(p => [...p, { ...newClassForm, id: p.length+1, enrolled: 0, capacity: parseInt(newClassForm.capacity)||15, status: "active" }]);
    setAddClassModal(false);
    setNewClassForm({ name: "", trainer: "", schedule: "", capacity: "" });
    toast.success("Class added");
  };

  const sideNav = [
    { id: "overview",        label: "Overview",        icon: Home       },
    { id: "members",         label: "Members",         icon: Users      },
    { id: "financial",       label: "Financial",       icon: TrendingUp },
    { id: "classes",         label: "Classes",         icon: Calendar   },
    { id: "content",         label: "Website Content", icon: Globe      },
    { id: "trainers_admin",  label: "Trainer Accounts",icon: Users      },
    { id: "leads",           label: "Leads",           icon: Target     },
  ] as const;

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* SIDEBAR */}
      <aside className="w-60 flex flex-col border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px", fontWeight: 800, letterSpacing: "0.05em" }} className="text-foreground">ADMIN <span className="text-primary">PANEL</span></span>
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
              <div><h1 style={H(30)} className="text-foreground">DASHBOARD OVERVIEW</h1><p className="text-muted-foreground text-sm mt-1">Saturday, June 13, 2026 · IronFit Mumbai</p></div>
              <button onClick={() => toast.success("Report exported")} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 text-sm hover:border-primary" style={{ borderRadius: "var(--radius)" }}><Download size={14} /> Export</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Members",    value: String(members.length), delta: "+56 this month", up: true,  icon: Users,       color: "text-primary" },
                { label: "Monthly Revenue",  value: "₹5.12L",               delta: "+4.7% vs May",  up: true,  icon: TrendingUp,  color: "text-green-400" },
                { label: "Classes Today",    value: "12",                   delta: "4 fully booked", up: true,  icon: Calendar,    color: "text-blue-400" },
                { label: "Pending Payments", value: "₹34,200",              delta: "18 members",    up: false, icon: AlertCircle, color: "text-yellow-400" },
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
            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h3 style={H(17)} className="text-foreground">RECENT TRANSACTIONS</h3><button onClick={() => setTab("financial")} className="text-primary text-xs hover:underline">View all →</button></div>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Date","Member","Type","Amount","Status"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {TRANSACTIONS.slice(0,5).map((t,i)=>(
                    <tr key={i} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-5 py-2.5 text-xs text-muted-foreground">{t.date}</td>
                      <td className="px-5 py-2.5 text-sm text-foreground">{t.member}</td>
                      <td className="px-5 py-2.5 text-xs text-muted-foreground">{t.type}</td>
                      <td className="px-5 py-2.5 text-sm" style={{fontFamily:"'JetBrains Mono',monospace"}}><span className={t.amount<0?"text-red-400":"text-foreground"}>{t.amount<0?"-":""}₹{Math.abs(t.amount).toLocaleString()}</span></td>
                      <td className="px-5 py-2.5"><span className={`text-xs px-2 py-0.5 ${t.status==="success"?"text-green-400 bg-green-400/10":t.status==="failed"?"text-red-400 bg-red-400/10":"text-yellow-400 bg-yellow-400/10"}`} style={{borderRadius:"var(--radius)"}}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input placeholder="Search…" value={memberSearch} onChange={e=>setMemberSearch(e.target.value)} className="bg-card border border-border pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)",width:"200px"}}/></div>
              {["All","PRO","ELITE","STARTER"].map(p=><button key={p} onClick={()=>setMemberPlanFilter(p)} className={`px-3 py-2 text-xs transition-all ${memberPlanFilter===p?"bg-primary/10 text-primary border border-primary/30":"border border-border text-muted-foreground hover:border-primary"}`} style={{borderRadius:"var(--radius)"}}>{p}</button>)}
              <span className="ml-auto text-muted-foreground text-sm flex items-center">{filteredMembers.length} members</span>
            </div>
            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["ID","Name","Plan","Status","Revenue","Expires","Actions"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {filteredMembers.map(m=>(
                    <tr key={m.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer" onClick={()=>setSelectedMember(m)}>
                      <td className="px-4 py-3 text-xs text-muted-foreground" style={{fontFamily:"'JetBrains Mono',monospace"}}>{m.id}</td>
                      <td className="px-4 py-3"><p className="text-foreground text-sm">{m.name}</p><p className="text-muted-foreground text-xs">{m.email}</p></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 ${m.plan==="ELITE"?"text-orange-400 bg-orange-400/10":m.plan==="PRO"?"text-primary bg-primary/10":"text-muted-foreground bg-secondary"}`} style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{m.plan}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs flex items-center gap-1 ${m.status==="active"?"text-green-400":m.status==="blocked"?"text-red-400":"text-yellow-400"}`}>{m.status==="active"?<CheckCircle size={11}/>:m.status==="blocked"?<XCircle size={11}/>:<AlertCircle size={11}/>}{m.status}</span></td>
                      <td className="px-4 py-3 text-sm text-foreground" style={{fontFamily:"'JetBrains Mono',monospace"}}>₹{m.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{m.expires}</td>
                      <td className="px-4 py-3" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>toggleBlock(m.id)} className={`text-xs px-2.5 py-1 border transition-all ${m.status==="blocked"?"border-green-400/30 text-green-400 hover:bg-green-400/10":"border-red-400/30 text-red-400 hover:bg-red-400/10"}`} style={{borderRadius:"var(--radius)"}}>{m.status==="blocked"?"Unblock":"Block"}</button>
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
                  {[["ID",selectedMember.id],["Plan",selectedMember.plan],["Status",selectedMember.status],["Joined",selectedMember.joined],["Expires",selectedMember.expires],["Revenue",`₹${selectedMember.revenue.toLocaleString()}`]].map(([k,v])=>(
                    <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm"><span className="text-muted-foreground">{k}</span><span className="text-foreground font-medium">{v}</span></div>
                  ))}
                  <div className="flex gap-2 mt-5">
                    <button onClick={()=>{toggleBlock(selectedMember.id);setSelectedMember(null);}} className={`flex-1 py-2 text-sm border ${selectedMember.status==="blocked"?"border-green-400/30 text-green-400":"border-red-400/30 text-red-400"}`} style={{borderRadius:"var(--radius)"}}>{selectedMember.status==="blocked"?"Unblock":"Block"}</button>
                    <button onClick={()=>{toast.info(`Reminder sent to ${selectedMember.name}`);}} className="flex-1 py-2 text-sm bg-primary text-white hover:bg-primary/90" style={{borderRadius:"var(--radius)"}}>Send Reminder</button>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-card border border-border p-6" style={{borderRadius:"var(--radius)"}}>
                <h3 style={H(17)} className="text-foreground mb-4">REVENUE vs REFUNDS</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={REVENUE_DATA}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/><XAxis dataKey="month" tick={{fill:"#777",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#777",fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/><Tooltip contentStyle={TT} formatter={(v:number)=>[`₹${(v/1000).toFixed(0)}K`]}/><Bar dataKey="revenue" fill="#ef2d2d" radius={[3,3,0,0]}/><Bar dataKey="refunds" fill="#333" radius={[3,3,0,0]}/></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border p-6" style={{borderRadius:"var(--radius)"}}>
                <h3 style={H(17)} className="text-foreground mb-4">PENDING PAYMENTS</h3>
                <div className="space-y-3">
                  {[{name:"Suresh Patil",plan:"PRO",amount:1999,due:"Jun 10"},{name:"Anita Bose",plan:"ELITE",amount:3499,due:"Jun 8"},{name:"Raj Malhotra",plan:"PRO",amount:1999,due:"Jun 7"},{name:"Deepa Nair",plan:"STARTER",amount:999,due:"Jun 6"}].map(p=>(
                    <div key={p.name} className="flex items-center justify-between py-2.5 border-b border-border">
                      <div><p className="text-foreground text-sm">{p.name}</p><p className="text-muted-foreground text-xs">{p.plan} · Due {p.due}</p></div>
                      <div className="flex items-center gap-2"><span className="text-yellow-400 text-sm" style={{fontFamily:"'JetBrains Mono',monospace"}}>₹{p.amount.toLocaleString()}</span><button onClick={()=>toast.success(`Reminder sent to ${p.name}`)} className="text-xs bg-primary/10 text-primary border border-primary/30 px-2.5 py-1 hover:bg-primary hover:text-white transition-all" style={{borderRadius:"var(--radius)"}}>Remind</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-card border border-border overflow-hidden" style={{borderRadius:"var(--radius)"}}>
              <div className="px-5 py-4 border-b border-border"><h3 style={H(17)} className="text-foreground">ALL TRANSACTIONS</h3></div>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Date","Member","Type","Amount","Status","Action"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {TRANSACTIONS.map((t,i)=>(
                    <tr key={i} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-5 py-3 text-xs text-muted-foreground">{t.date}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{t.member}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{t.type}</td>
                      <td className="px-5 py-3 text-sm" style={{fontFamily:"'JetBrains Mono',monospace"}}><span className={t.amount<0?"text-red-400":"text-foreground"}>{t.amount<0?"-":""}₹{Math.abs(t.amount).toLocaleString()}</span></td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 ${t.status==="success"?"text-green-400 bg-green-400/10":t.status==="failed"?"text-red-400 bg-red-400/10":"text-yellow-400 bg-yellow-400/10"}`} style={{borderRadius:"var(--radius)"}}>{t.status}</span></td>
                      <td className="px-5 py-3">{t.status==="failed"?<button onClick={()=>toast.info(`Retrying`)} className="text-xs text-primary hover:underline flex items-center gap-1"><RefreshCw size={10}/> Retry</button>:<button onClick={()=>toast.success("Invoice downloaded")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><Download size={10}/> Invoice</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ CLASSES ════ */}
        {tab === "classes" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 style={H(30)} className="text-foreground">CLASS MANAGEMENT</h1>
              <button onClick={()=>setAddClassModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)"}}><Plus size={14}/> Add Class</button>
            </div>
            <div className="bg-card border border-border overflow-hidden" style={{borderRadius:"var(--radius)"}}>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Class","Trainer","Schedule","Cap.","Enrolled","Fill%","Status","Actions"].map(h=><th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {classes.map(cls=>{const pct=Math.round((cls.enrolled/cls.capacity)*100);return(
                    <tr key={cls.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{cls.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{cls.trainer}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{cls.schedule}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{cls.capacity}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{cls.enrolled}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full ${pct>=100?"bg-green-400":pct>=75?"bg-yellow-400":"bg-primary"}`} style={{width:`${Math.min(pct,100)}%`}}/></div><span className="text-xs text-muted-foreground">{pct}%</span></div></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 ${cls.status==="active"?"text-green-400 bg-green-400/10":"text-yellow-400 bg-yellow-400/10"}`} style={{borderRadius:"var(--radius)"}}>{cls.status}</span></td>
                      <td className="px-4 py-3"><div className="flex gap-2"><button onClick={()=>setEditClass(cls)} className="text-muted-foreground hover:text-foreground"><Edit2 size={13}/></button><button onClick={()=>{setClasses(p=>p.map(c=>c.id===cls.id?{...c,status:c.status==="active"?"paused":"active"}:c));toast.info(`${cls.name} ${cls.status==="active"?"paused":"activated"}`);}} className="text-muted-foreground hover:text-yellow-400"><RefreshCw size={13}/></button><button onClick={()=>{setClasses(p=>p.filter(c=>c.id!==cls.id));toast.success(`${cls.name} deleted`);}} className="text-muted-foreground hover:text-red-400"><Trash2 size={13}/></button></div></td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
            {addClassModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setAddClassModal(false)}><div className="bg-card border border-border w-full max-w-md p-6" style={{borderRadius:"var(--radius)"}} onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h2 style={H(22)} className="text-foreground">ADD CLASS</h2><button onClick={()=>setAddClassModal(false)}><X size={18} className="text-muted-foreground"/></button></div><div className="space-y-3">{[{k:"name",l:"Class Name *",p:"Kickboxing"},{k:"trainer",l:"Trainer *",p:"Arjun Mehta"},{k:"schedule",l:"Schedule",p:"Mon/Wed 5PM"},{k:"capacity",l:"Capacity",p:"15"}].map(({k,l,p})=><div key={k}><label className="text-muted-foreground text-xs block mb-1.5">{l}</label><input placeholder={p} value={newClassForm[k as keyof typeof newClassForm]} onChange={e=>setNewClassForm(f=>({...f,[k]:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>)}</div><button onClick={handleAddClass} className="w-full mt-5 bg-primary text-white py-3 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>CREATE CLASS</button></div></div>)}
            {editClass && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={()=>setEditClass(null)}><div className="bg-card border border-border w-full max-w-md p-6" style={{borderRadius:"var(--radius)"}} onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h2 style={H(22)} className="text-foreground">EDIT CLASS</h2><button onClick={()=>setEditClass(null)}><X size={18} className="text-muted-foreground"/></button></div><div className="space-y-3">{["name","trainer","schedule"].map(k=><div key={k}><label className="text-muted-foreground text-xs block mb-1.5 capitalize">{k}</label><input value={editClass[k as keyof typeof editClass] as string} onChange={e=>setEditClass(f=>f?{...f,[k]:e.target.value}:f)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>)}<div><label className="text-muted-foreground text-xs block mb-1.5">Capacity</label><input type="number" value={editClass.capacity} onChange={e=>setEditClass(f=>f?{...f,capacity:parseInt(e.target.value)}:f)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div></div><button onClick={()=>{setClasses(p=>p.map(c=>c.id===editClass.id?editClass:c));setEditClass(null);toast.success(`${editClass.name} updated`);}} className="w-full mt-5 bg-primary text-white py-3 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>SAVE</button></div></div>)}
          </div>
        )}

        {/* ════ WEBSITE CONTENT EDITOR ════ */}
        {tab === "content" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 style={H(30)} className="text-foreground">WEBSITE CONTENT EDITOR</h1>
                <p className="text-muted-foreground text-sm mt-1">Changes go live instantly across the site — no coding required.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 text-sm hover:border-primary" style={{ borderRadius: "var(--radius)" }}><Eye size={14} /> Preview Site</button>
                <button onClick={saveContent} className="flex items-center gap-2 bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}><Save size={14} /> SAVE ALL CHANGES</button>
              </div>
            </div>

            {/* Section picker */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "hero",         label: "Hero Section",    icon: Image    },
                { id: "announcement", label: "Announcement",    icon: Bell     },
                { id: "pricing",      label: "Pricing",         icon: DollarSign },
                { id: "features",     label: "Plan Features",   icon: Check    },
                { id: "offers",       label: "Offers",          icon: Target   },
                { id: "blog",         label: "Blog Posts",      icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setContentSection(id as typeof contentSection)} className={`flex items-center gap-2 px-4 py-2 text-sm transition-all ${contentSection === id ? "bg-primary text-white" : "border border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* ── HERO ── */}
            {contentSection === "hero" && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(18)} className="text-foreground mb-5">HERO SECTION</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-muted-foreground text-xs block mb-1.5">Badge Text</label>
                    <input value={localContent.heroBadge} onChange={e=>setLocalContent(p=>({...p,heroBadge:e.target.value}))} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-muted-foreground text-xs block mb-1.5">Main Headline (use \n for line breaks)</label>
                    <textarea rows={3} value={localContent.heroHeadline} onChange={e=>setLocalContent(p=>({...p,heroHeadline:e.target.value}))} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-muted-foreground text-xs block mb-1.5">Sub-headline</label>
                    <textarea rows={2} value={localContent.heroSubHeadline} onChange={e=>setLocalContent(p=>({...p,heroSubHeadline:e.target.value}))} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/>
                  </div>
                  {[
                    {nk:"stat1Num",lk:"stat1Label",nl:"Stat 1 Number",ll:"Stat 1 Label"},
                    {nk:"stat2Num",lk:"stat2Label",nl:"Stat 2 Number",ll:"Stat 2 Label"},
                    {nk:"stat3Num",lk:"stat3Label",nl:"Stat 3 Number",ll:"Stat 3 Label"},
                  ].map(({nk,lk,nl,ll})=>(
                    <div key={nk} className="flex gap-3">
                      <div className="flex-1"><label className="text-muted-foreground text-xs block mb-1.5">{nl}</label><input value={localContent[nk as keyof SiteContent] as string} onChange={e=>setLocalContent(p=>({...p,[nk]:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                      <div className="flex-1"><label className="text-muted-foreground text-xs block mb-1.5">{ll}</label><input value={localContent[lk as keyof SiteContent] as string} onChange={e=>setLocalContent(p=>({...p,[lk]:e.target.value}))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ANNOUNCEMENT ── */}
            {contentSection === "announcement" && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(18)} className="text-foreground mb-5">ANNOUNCEMENT BANNER</h3>
                <div className="flex items-center gap-3 mb-5">
                  <label className="text-foreground text-sm">Banner Active</label>
                  <button onClick={()=>setLocalContent(p=>({...p,announcementActive:!p.announcementActive}))} className="text-muted-foreground hover:text-foreground transition-colors">
                    {localContent.announcementActive ? <ToggleRight size={28} className="text-primary"/> : <ToggleLeft size={28}/>}
                  </button>
                  <span className={`text-xs ${localContent.announcementActive?"text-green-400":"text-muted-foreground"}`}>{localContent.announcementActive?"LIVE":"Hidden"}</span>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs block mb-1.5">Banner Message</label>
                  <input value={localContent.announcement} onChange={e=>setLocalContent(p=>({...p,announcement:e.target.value}))} placeholder="🎉 Monsoon Special: 25% OFF Annual memberships…" className="w-full bg-muted border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                </div>
                {localContent.announcementActive && (
                  <div className="mt-4 bg-primary text-white px-4 py-2 text-xs text-center" style={{borderRadius:"var(--radius)"}}>Preview: {localContent.announcement}</div>
                )}
              </div>
            )}

            {/* ── PRICING ── */}
            {contentSection === "pricing" && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(18)} className="text-foreground mb-5">MEMBERSHIP PRICING (₹)</h3>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2"><div/><span>Monthly</span><span>Annual</span></div>
                {[
                  {l:"Starter",mk:"starter_mo" as const,yk:"starter_yr" as const},
                  {l:"Pro",    mk:"pro_mo"     as const,yk:"pro_yr"     as const},
                  {l:"Elite",  mk:"elite_mo"   as const,yk:"elite_yr"   as const},
                ].map(({l,mk,yk})=>(
                  <div key={l} className="grid grid-cols-3 gap-2 mb-3 items-center">
                    <span className="text-foreground text-sm">{l}</span>
                    <input type="number" value={localContent.pricing[mk]} onChange={e=>setLocalContent(p=>({...p,pricing:{...p.pricing,[mk]:parseInt(e.target.value)||0}}))} className="bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                    <input type="number" value={localContent.pricing[yk]} onChange={e=>setLocalContent(p=>({...p,pricing:{...p.pricing,[yk]:parseInt(e.target.value)||0}}))} className="bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                  </div>
                ))}
              </div>
            )}

            {/* ── PLAN FEATURES ── */}
            {contentSection === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {label:"Starter Features",key:"starterFeatures" as const},
                  {label:"Pro Features",    key:"proFeatures"     as const},
                  {label:"Elite Features",  key:"eliteFeatures"   as const},
                ].map(({label,key})=>(
                  <div key={key} className="bg-card border border-border p-5" style={{borderRadius:"var(--radius)"}}>
                    <h3 style={H(16)} className="text-foreground mb-4">{label.toUpperCase()}</h3>
                    <div className="space-y-2 mb-3">
                      {localContent[key].map((f,i)=>(
                        <div key={i} className="flex items-center gap-2">
                          <input value={f} onChange={e=>{const arr=[...localContent[key]];arr[i]=e.target.value;setLocalContent(p=>({...p,[key]:arr}));}} className="flex-1 bg-muted border border-border px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/>
                          <button onClick={()=>{const arr=localContent[key].filter((_,j)=>j!==i);setLocalContent(p=>({...p,[key]:arr}));}} className="text-muted-foreground hover:text-red-400"><X size={13}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setLocalContent(p=>({...p,[key]:[...p[key],"New feature"]}))} className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 w-full justify-center" style={{borderRadius:"var(--radius)"}}><Plus size={11}/> Add Feature</button>
                  </div>
                ))}
              </div>
            )}

            {/* ── OFFERS ── */}
            {contentSection === "offers" && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 style={H(18)} className="text-foreground">ACTIVE OFFERS</h3>
                  <button onClick={()=>setLocalContent(p=>({...p,offers:[...p.offers,{id:Date.now(),title:"New Offer",discount:"X% OFF",expires:"Dec 31, 2026",active:false}]}))} className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10" style={{borderRadius:"var(--radius)"}}><Plus size={11}/> Add Offer</button>
                </div>
                <div className="space-y-4">
                  {localContent.offers.map((offer,i)=>(
                    <div key={offer.id} className="border border-border p-4" style={{borderRadius:"var(--radius)"}}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>{const a=[...localContent.offers];a[i]={...a[i],active:!a[i].active};setLocalContent(p=>({...p,offers:a}));}}>
                            {offer.active?<ToggleRight size={22} className="text-primary"/>:<ToggleLeft size={22} className="text-muted-foreground"/>}
                          </button>
                          <span className={`text-xs ${offer.active?"text-green-400":"text-muted-foreground"}`}>{offer.active?"Active":"Inactive"}</span>
                        </div>
                        <button onClick={()=>setLocalContent(p=>({...p,offers:p.offers.filter((_,j)=>j!==i)}))} className="text-muted-foreground hover:text-red-400"><Trash2 size={13}/></button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[{l:"Title",k:"title"},{l:"Discount",k:"discount"},{l:"Expires",k:"expires"}].map(({l,k})=>(
                          <div key={k}><label className="text-muted-foreground text-xs block mb-1">{l}</label><input value={offer[k as keyof typeof offer] as string} onChange={e=>{const a=[...localContent.offers];a[i]={...a[i],[k]:e.target.value};setLocalContent(p=>({...p,offers:a}));}} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── BLOG POSTS ── */}
            {contentSection === "blog" && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 style={H(18)} className="text-foreground">BLOG POSTS</h3>
                  <button onClick={()=>setLocalContent(p=>({...p,blogPosts:[...p.blogPosts,{id:Date.now(),title:"New Blog Post",excerpt:"Write your excerpt here…",date:"Jun 13, 2026",published:false}]}))} className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10" style={{borderRadius:"var(--radius)"}}><Plus size={11}/> Add Post</button>
                </div>
                <div className="space-y-5">
                  {localContent.blogPosts.map((post,i)=>(
                    <div key={post.id} className="border border-border p-5" style={{borderRadius:"var(--radius)"}}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>{const a=[...localContent.blogPosts];a[i]={...a[i],published:!a[i].published};setLocalContent(p=>({...p,blogPosts:a}));}}>
                            {post.published?<ToggleRight size={22} className="text-primary"/>:<ToggleLeft size={22} className="text-muted-foreground"/>}
                          </button>
                          <span className={`text-xs ${post.published?"text-green-400":"text-muted-foreground"}`}>{post.published?"Published":"Draft"}</span>
                        </div>
                        <button onClick={()=>setLocalContent(p=>({...p,blogPosts:p.blogPosts.filter((_,j)=>j!==i)}))} className="text-muted-foreground hover:text-red-400"><Trash2 size={13}/></button>
                      </div>
                      <div className="space-y-3">
                        <div><label className="text-muted-foreground text-xs block mb-1">Title</label><input value={post.title} onChange={e=>{const a=[...localContent.blogPosts];a[i]={...a[i],title:e.target.value};setLocalContent(p=>({...p,blogPosts:a}));}} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                        <div><label className="text-muted-foreground text-xs block mb-1">Excerpt</label><textarea rows={2} value={post.excerpt} onChange={e=>{const a=[...localContent.blogPosts];a[i]={...a[i],excerpt:e.target.value};setLocalContent(p=>({...p,blogPosts:a}));}} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/></div>
                        <div><label className="text-muted-foreground text-xs block mb-1">Date</label><input value={post.date} onChange={e=>{const a=[...localContent.blogPosts];a[i]={...a[i],date:e.target.value};setLocalContent(p=>({...p,blogPosts:a}));}} className="w-48 bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}/></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ TRAINER ACCOUNTS ════ */}
        {tab === "trainers_admin" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">TRAINER ACCOUNTS</h1>
            <p className="text-muted-foreground text-sm mb-6">Manage trainer profiles, activate/deactivate accounts, and view their stats.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {trainers.map(t => (
                <div key={t.id} className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-start gap-4 mb-4">
                    <img src={`https://images.unsplash.com/${t.image}?w=64&h=64&fit=crop&auto=format`} alt={t.name} className="w-14 h-14 object-cover shrink-0" style={{ borderRadius: "var(--radius)" }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 style={H(18)} className="text-foreground">{t.name}</h3>
                          <p className="text-primary text-xs">{t.specialty}</p>
                          <p className="text-muted-foreground text-xs">{t.email}</p>
                        </div>
                        <button onClick={() => { onUpdateTrainers(trainers.map(x => x.id === t.id ? { ...x, active: !x.active } : x)); toast.info(`${t.name} ${t.active ? "deactivated" : "activated"}`); }}>
                          {t.active ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    {[["Rating", `${t.rating}★`], ["Sessions", t.sessions.toLocaleString()], ["Fee", `₹${t.fee.toLocaleString()}`]].map(([l, v]) => (
                      <div key={l} className="bg-secondary p-2" style={{ borderRadius: "var(--radius)" }}>
                        <p style={H(16)} className="text-foreground">{v}</p>
                        <p className="text-muted-foreground text-xs">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 ${t.active ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>{t.active ? "Active" : "Deactivated"}</span>
                    <span className="text-muted-foreground">{t.announcements.length} announcement{t.announcements.length !== 1 ? "s" : ""}</span>
                    <button onClick={() => { toast.info(`Password reset email sent to ${t.email}`); }} className="text-primary hover:underline">Reset Password</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LEADS ════ */}
        {tab === "leads" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <div><h1 style={H(30)} className="text-foreground">LEAD MANAGEMENT</h1><p className="text-muted-foreground text-sm mt-1">Visitors who didn't convert — nurture them.</p></div>
              <button onClick={() => { leads.filter(l=>l.status==="new").forEach(l=>{ setDiscountSent(p=>new Set([...p,l.id])); }); toast.success("Discount sent to all new leads"); }} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90" style={{ borderRadius: "var(--radius)" }}><Send size={14}/> Blast New Leads</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[{label:"New",color:"text-blue-400",status:"new"},{label:"Contacted",color:"text-yellow-400",status:"contacted"},{label:"Converted",color:"text-green-400",status:"converted"},{label:"Cold",color:"text-muted-foreground",status:"cold"}].map(({label,color,status})=>(
                <div key={label} className="bg-card border border-border p-4" style={{borderRadius:"var(--radius)"}}><p className="text-muted-foreground text-xs mb-1">{label}</p><p style={H(26)} className={color}>{leads.filter(l=>l.status===status).length}</p></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border overflow-hidden" style={{borderRadius:"var(--radius)"}}>
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
              <div className="bg-card border border-border p-5" style={{borderRadius:"var(--radius)"}}>
                {selectedLead ? (
                  <>
                    <div className="flex items-center justify-between mb-4"><h3 style={H(17)} className="text-foreground">LEAD DETAIL</h3><button onClick={()=>setSelectedLead(null)}><X size={14} className="text-muted-foreground"/></button></div>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mb-3">{selectedLead.name[0]}</div>
                    <p style={H(17)} className="text-foreground mb-0.5">{selectedLead.name}</p>
                    <p className="text-muted-foreground text-xs mb-1">{selectedLead.phone}</p>
                    <p className="text-muted-foreground text-xs mb-4">{selectedLead.email}</p>
                    <div className="flex gap-2 mb-4">
                      <button onClick={()=>{setLeads(p=>p.map(l=>l.id===selectedLead.id?{...l,status:"contacted"}:l));setSelectedLead(p=>p?{...p,status:"contacted"}:null);toast.success("Marked as contacted");}} className="flex-1 text-xs py-2 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10" style={{borderRadius:"var(--radius)"}}>Contacted</button>
                      <button onClick={()=>{setLeads(p=>p.map(l=>l.id===selectedLead.id?{...l,status:"converted"}:l));setSelectedLead(p=>p?{...p,status:"converted"}:null);toast.success(`${selectedLead.name} converted! 🎉`);}} className="flex-1 text-xs py-2 border border-green-400/30 text-green-400 hover:bg-green-400/10" style={{borderRadius:"var(--radius)"}}>Convert</button>
                    </div>
                    <div className="mb-2"><label className="text-muted-foreground text-xs block mb-1.5">Notes</label><textarea rows={3} value={leadNote} onChange={e=>setLeadNote(e.target.value)} className="w-full bg-muted border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" style={{borderRadius:"var(--radius)"}}/></div>
                    <button onClick={()=>{setLeads(p=>p.map(l=>l.id===selectedLead.id?{...l,notes:leadNote}:l));setSelectedLead(p=>p?{...p,notes:leadNote}:null);toast.success("Note saved");}} className="w-full bg-primary text-white py-2 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>SAVE NOTE</button>
                  </>
                ) : <div className="flex flex-col items-center justify-center h-48 text-muted-foreground"><Target size={24} className="mb-3 opacity-30"/><p className="text-sm">Click a lead to view details</p></div>}
              </div>
            </div>

            {/* Broadcast */}
            <div className="bg-card border border-border p-6 mt-6" style={{borderRadius:"var(--radius)"}}>
              <h3 style={H(17)} className="text-foreground mb-4">BULK BROADCAST</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div><label className="text-muted-foreground text-xs block mb-1.5">Target</label><select value={broadcastTarget} onChange={e=>setBroadcastTarget(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option>All Members</option><option>New Leads Only</option><option>Expiring in 7 days</option><option>PRO Members</option><option>ELITE Members</option></select></div>
                <div><label className="text-muted-foreground text-xs block mb-1.5">Channel</label><select value={broadcastChannel} onChange={e=>setBroadcastChannel(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option>WhatsApp</option><option>Push Notification</option><option>Email</option><option>All channels</option></select></div>
                <div className="md:col-span-2"><label className="text-muted-foreground text-xs block mb-1.5">Template</label><select onChange={e=>setBroadcastMsg(e.target.value)} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{borderRadius:"var(--radius)"}}><option value="">— Select template —</option><option value="Your IronFit membership is expiring in 5 days! Renew now to keep your streak going. 💪">Expiry reminder</option><option value="🎉 OFFER: 25% off Annual plan for existing members — ends midnight!">Discount offer</option></select></div>
              </div>
              <textarea rows={2} value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} placeholder="Or type your message…" className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none mb-3" style={{borderRadius:"var(--radius)"}}/>
              <button onClick={()=>{if(!broadcastMsg.trim()){toast.error("Enter a message");return;}toast.success(`Broadcast sent via ${broadcastChannel}`,{description:`To: ${broadcastTarget}`});setBroadcastMsg("");}} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 text-sm hover:bg-primary/90" style={{borderRadius:"var(--radius)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}><Send size={14}/> SEND BROADCAST</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
