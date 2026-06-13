import { useState } from "react";
import { toast } from "sonner";
import {
  Dumbbell, Calendar, Users, Bell, LogOut, Home,
  Plus, Edit2, Trash2, Check, X, Clock, Star,
  ChevronRight, Save, Eye, ToggleLeft, ToggleRight
} from "lucide-react";
import type { AuthUser, TrainerData } from "../App";

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });

const TRAINER_BOOKINGS = [
  { member: "Anjali Verma",  plan: "PRO",   slot: "Mon 10AM", date: "Jun 16", status: "confirmed" },
  { member: "Rohan Desai",   plan: "ELITE", slot: "Wed 11AM", date: "Jun 18", status: "confirmed" },
  { member: "Meera Pillai",  plan: "PRO",   slot: "Fri 10AM", date: "Jun 20", status: "pending"   },
  { member: "Aditya Kumar",  plan: "ELITE", slot: "Sat 2PM",  date: "Jun 21", status: "confirmed" },
];

interface TrainerPortalProps {
  user: AuthUser;
  trainers: TrainerData[];
  onNavigate: (v: string) => void;
  onUpdateTrainer: (id: number, data: Partial<TrainerData>) => void;
}

export function TrainerPortal({ user, trainers, onNavigate, onUpdateTrainer }: TrainerPortalProps) {
  const trainer = trainers.find(t => t.id === user.trainerId);
  const [tab, setTab] = useState<"overview" | "classes" | "availability" | "announcements" | "profile">("overview");

  /* Local editable copies */
  const [bio, setBio]             = useState(trainer?.bio ?? "");
  const [specialty, setSpecialty] = useState(trainer?.specialty ?? "");
  const [fee, setFee]             = useState(String(trainer?.fee ?? 1200));
  const [cert, setCert]           = useState(trainer?.cert ?? "");
  const [slots, setSlots]         = useState<string[]>(trainer?.available ?? []);
  const [newSlot, setNewSlot]     = useState("");
  const [announcements, setAnnouncements] = useState(trainer?.announcements ?? []);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [bookings, setBookings]   = useState(TRAINER_BOOKINGS);

  /* My classes (trainer-managed) */
  const [myClasses, setMyClasses] = useState([
    { id: 1, name: "Power Yoga",    schedule: "Mon/Wed/Fri 6:00 AM", capacity: 15, enrolled: 12, status: "active" },
    { id: 2, name: "Morning Yoga",  schedule: "Thu 6:30 AM",          capacity: 15, enrolled: 7,  status: "active" },
    { id: 3, name: "Vinyasa Flow",  schedule: "Fri 7:00 AM",          capacity: 15, enrolled: 13, status: "active" },
  ].filter(() => trainer?.specialty.includes("Yoga") || trainer?.id === user.trainerId));
  const [newClass, setNewClass] = useState({ name: "", schedule: "", capacity: "15" });
  const [showAddClass, setShowAddClass] = useState(false);

  if (!trainer) return (
    <div className="h-screen bg-background flex items-center justify-center text-muted-foreground">Trainer not found.</div>
  );

  const saveProfile = () => {
    onUpdateTrainer(trainer.id, { bio, specialty, fee: parseInt(fee), cert });
    toast.success("Profile updated successfully");
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    const updated = [...slots, newSlot.trim()];
    setSlots(updated);
    onUpdateTrainer(trainer.id, { available: updated });
    setNewSlot("");
    toast.success("Slot added");
  };

  const removeSlot = (s: string) => {
    const updated = slots.filter(x => x !== s);
    setSlots(updated);
    onUpdateTrainer(trainer.id, { available: updated });
    toast.info("Slot removed");
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    const updated = [...announcements, { id: Date.now(), text: newAnnouncement.trim(), date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) }];
    setAnnouncements(updated);
    onUpdateTrainer(trainer.id, { announcements: updated });
    setNewAnnouncement("");
    toast.success("Announcement posted — visible on public profiles page");
  };

  const deleteAnnouncement = (id: number) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    onUpdateTrainer(trainer.id, { announcements: updated });
    toast.info("Announcement removed");
  };

  const confirmBooking = (i: number) => {
    setBookings(p => p.map((b, idx) => idx === i ? { ...b, status: "confirmed" } : b));
    toast.success(`Session confirmed with ${bookings[i].member}`);
  };

  const addMyClass = () => {
    if (!newClass.name) { toast.error("Class name required"); return; }
    setMyClasses(p => [...p, { id: Date.now(), name: newClass.name, schedule: newClass.schedule, capacity: parseInt(newClass.capacity) || 15, enrolled: 0, status: "active" }]);
    setNewClass({ name: "", schedule: "", capacity: "15" });
    setShowAddClass(false);
    toast.success(`${newClass.name} added to your schedule`);
  };

  const nav = [
    { id: "overview",       label: "Overview",      icon: Home      },
    { id: "classes",        label: "My Classes",    icon: Calendar  },
    { id: "availability",   label: "Availability",  icon: Clock     },
    { id: "announcements",  label: "Announcements", icon: Bell      },
    { id: "profile",        label: "My Profile",    icon: Users     },
  ] as const;

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col border-r border-border bg-sidebar shrink-0">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          <span style={{ ...H(16), letterSpacing: "0.05em" }} className="text-foreground">TRAINER<span className="text-primary"> HUB</span></span>
        </div>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={`https://images.unsplash.com/${trainer.image}?w=40&h=40&fit=crop&auto=format`} alt={trainer.name} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="text-foreground text-sm font-medium">{trainer.name}</p>
              <p className="text-primary text-xs">{trainer.specialty.split(" & ")[0]}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`} style={{ borderRadius: "var(--radius)" }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={() => onNavigate("profiles")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ borderRadius: "var(--radius)" }}>
            <Eye size={14} /> Public Profile
          </button>
          <button onClick={() => onNavigate("logout")} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ borderRadius: "var(--radius)" }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">WELCOME, {trainer.name.split(" ")[0].toUpperCase()}</h1>
            <p className="text-muted-foreground text-sm mb-6">Here's your snapshot for the week.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Sessions",   value: trainer.sessions.toLocaleString(), sub: "All time",       color: "text-primary" },
                { label: "Rating",           value: `${trainer.rating}★`,             sub: `${trainer.reviews} reviews`, color: "text-yellow-400" },
                { label: "Upcoming Bookings",value: bookings.filter(b=>b.status==="confirmed").length.toString(), sub: "This week", color: "text-green-400" },
                { label: "Pending Confirms", value: bookings.filter(b=>b.status==="pending").length.toString(), sub: "Action needed", color: "text-orange-400" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
                  <p className="text-muted-foreground text-xs mb-2">{label}</p>
                  <p style={H(26)} className={color}>{value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{sub}</p>
                </div>
              ))}
            </div>

            {/* Bookings table */}
            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 style={H(17)} className="text-foreground">UPCOMING SESSIONS</h3>
                <button onClick={() => setTab("availability")} className="text-primary text-xs hover:underline">Manage availability →</button>
              </div>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Member","Plan","Slot","Date","Status","Action"].map(h => <th key={h} className="text-left text-xs text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3 text-sm text-foreground">{b.member}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 ${b.plan === "ELITE" ? "text-orange-400 bg-orange-400/10" : "text-primary bg-primary/10"}`} style={{ borderRadius: "var(--radius)" }}>{b.plan}</span></td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{b.slot}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{b.date}</td>
                      <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 ${b.status === "confirmed" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`} style={{ borderRadius: "var(--radius)" }}>{b.status}</span></td>
                      <td className="px-5 py-3">
                        {b.status === "pending" ? (
                          <button onClick={() => confirmBooking(i)} className="text-xs bg-primary/10 text-primary border border-primary/30 px-3 py-1 hover:bg-primary hover:text-white transition-all" style={{ borderRadius: "var(--radius)" }}>Confirm</button>
                        ) : (
                          <button onClick={() => toast.info("Session cancelled")} className="text-xs text-red-400 hover:underline">Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MY CLASSES ── */}
        {tab === "classes" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-5">
              <h1 style={H(30)} className="text-foreground">MY CLASSES</h1>
              <button onClick={() => setShowAddClass(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <Plus size={14} /> Add Class
              </button>
            </div>
            <div className="bg-card border border-border overflow-hidden mb-6" style={{ borderRadius: "var(--radius)" }}>
              <table className="w-full">
                <thead><tr className="border-b border-border">{["Class","Schedule","Capacity","Enrolled","Fill","Status","Actions"].map(h => <th key={h} className="text-left text-xs text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {myClasses.map(cls => {
                    const pct = Math.round((cls.enrolled / cls.capacity) * 100);
                    return (
                      <tr key={cls.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{cls.name}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{cls.schedule}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{cls.capacity}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{cls.enrolled}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs text-muted-foreground">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setMyClasses(p => p.map(c => c.id === cls.id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c)); toast.info(`${cls.name} ${cls.status === "active" ? "paused" : "activated"}`); }} className="text-muted-foreground hover:text-foreground">
                            {cls.status === "active" ? <ToggleRight size={18} className="text-primary" /> : <ToggleLeft size={18} />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setMyClasses(p => p.filter(c => c.id !== cls.id)); toast.success(`${cls.name} removed`); }} className="text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {showAddClass && (
              <div className="bg-card border border-border p-6" style={{ borderRadius: "var(--radius)" }}>
                <h3 style={H(18)} className="text-foreground mb-4">ADD NEW CLASS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[{k:"name",l:"Class Name *",p:"e.g. Evening Yoga"},{k:"schedule",l:"Schedule",p:"e.g. Mon/Wed 7PM"},{k:"capacity",l:"Max Capacity",p:"15"}].map(({k,l,p}) => (
                    <div key={k}>
                      <label className="text-muted-foreground text-xs block mb-1.5">{l}</label>
                      <input placeholder={p} value={newClass[k as keyof typeof newClass]} onChange={e => setNewClass(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-muted border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addMyClass} className="bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>Add Class</button>
                  <button onClick={() => setShowAddClass(false)} className="border border-border text-muted-foreground px-5 py-2 text-sm hover:border-primary transition-colors" style={{ borderRadius: "var(--radius)" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AVAILABILITY ── */}
        {tab === "availability" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">MANAGE AVAILABILITY</h1>
            <p className="text-muted-foreground text-sm mb-6">Set your available PT slots. Members can book from these times.</p>
            <div className="bg-card border border-border p-6 mb-6" style={{ borderRadius: "var(--radius)" }}>
              <div className="flex gap-3 mb-5">
                <input placeholder="e.g. Mon 8AM or Sat 10AM" value={newSlot} onChange={e => setNewSlot(e.target.value)} onKeyDown={e => e.key === "Enter" && addSlot()} className="flex-1 bg-muted border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                <button onClick={addSlot} className="bg-primary text-white px-5 py-2.5 text-sm hover:bg-primary/90 transition-colors flex items-center gap-2" style={{ borderRadius: "var(--radius)" }}><Plus size={14} /> Add Slot</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {slots.map(slot => (
                  <div key={slot} className="flex items-center gap-2 border border-border px-3 py-2 text-sm text-foreground" style={{ borderRadius: "var(--radius)" }}>
                    <Clock size={12} className="text-primary" />
                    {slot}
                    <button onClick={() => removeSlot(slot)} className="text-muted-foreground hover:text-red-400 transition-colors ml-1"><X size={12} /></button>
                  </div>
                ))}
                {slots.length === 0 && <p className="text-muted-foreground text-sm">No slots added yet.</p>}
              </div>
            </div>
            <div className="bg-card border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
              <h3 style={H(16)} className="text-foreground mb-3">TIPS</h3>
              <ul className="space-y-2">
                {["Format: Day + Time (e.g. Mon 8AM, Sat 10AM)","Add both morning and evening options to maximise bookings","Remove slots at least 48h before to notify affected members","ELITE members get priority for all slots"].map(tip => (
                  <li key={tip} className="flex items-start gap-2 text-muted-foreground text-xs"><ChevronRight size={11} className="text-primary mt-0.5 shrink-0" />{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS ── */}
        {tab === "announcements" && (
          <div className="p-8">
            <h1 style={H(30)} className="text-foreground mb-1">ANNOUNCEMENTS</h1>
            <p className="text-muted-foreground text-sm mb-6">Post updates visible on the public Trainer Profiles page and to all members.</p>
            <div className="bg-card border border-border p-6 mb-5" style={{ borderRadius: "var(--radius)" }}>
              <label className="text-muted-foreground text-xs block mb-1.5">New Announcement</label>
              <textarea rows={3} value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder="e.g. New Saturday session added at 10AM — limited to 12 spots. Book now!" className="w-full bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none mb-3" style={{ borderRadius: "var(--radius)" }} />
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs">{newAnnouncement.length}/200 chars · Posted publicly on trainer profiles</p>
                <button onClick={addAnnouncement} className="flex items-center gap-2 bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}><Bell size={14} /> Post Announcement</button>
              </div>
            </div>
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="bg-card border border-border p-4 flex gap-4" style={{ borderRadius: "var(--radius)" }}>
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{a.text}</p>
                    <p className="text-muted-foreground text-xs mt-1">{a.date} · Visible on public profile</p>
                  </div>
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"><Trash2 size={14} /></button>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-muted-foreground text-sm">No announcements yet.</p>}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div className="p-8 max-w-2xl">
            <h1 style={H(30)} className="text-foreground mb-1">MY PROFILE</h1>
            <p className="text-muted-foreground text-sm mb-6">Edit the information shown on your public profile page.</p>
            <div className="bg-card border border-border p-6 mb-5" style={{ borderRadius: "var(--radius)" }}>
              <div className="flex items-center gap-4 mb-5">
                <img src={`https://images.unsplash.com/${trainer.image}?w=80&h=80&fit=crop&auto=format`} alt={trainer.name} className="w-16 h-16 object-cover" style={{ borderRadius: "var(--radius)" }} />
                <div>
                  <p style={H(20)} className="text-foreground">{trainer.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= Math.round(trainer.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />)}
                    {trainer.rating} ({trainer.reviews} reviews)
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs block mb-1.5">Specialty</label>
                  <input value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-xs block mb-1.5">Certification</label>
                    <input value={cert} onChange={e => setCert(e.target.value)} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs block mb-1.5">Session Fee (₹/hr)</label>
                    <input type="number" value={fee} onChange={e => setFee(e.target.value)} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs block mb-1.5">Bio</label>
                  <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-muted border border-border px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none" style={{ borderRadius: "var(--radius)" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveProfile} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700 }}>
                <Save size={14} /> SAVE CHANGES
              </button>
              <button onClick={() => onNavigate("profiles")} className="flex items-center gap-2 border border-border text-muted-foreground px-6 py-2.5 text-sm hover:border-primary transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <Eye size={14} /> View Public Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
