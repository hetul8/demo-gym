import { useState } from "react";
import {
  Dumbbell, Star, Clock, Award, Users, ChevronRight,
  X, Calendar, Bell, LogIn, ArrowRight, Phone
} from "lucide-react";
import type { AuthUser, TrainerData, BrandSettings } from "../App";

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });

interface TrainerProfilesProps {
  trainers: TrainerData[];
  onNavigate: (v: string) => void;
  authUser: AuthUser | null;
  brandSettings: BrandSettings;
}

export function TrainerProfiles({ trainers, onNavigate, authUser, brandSettings }: TrainerProfilesProps) {
  const [selected, setSelected]   = useState<TrainerData | null>(null);
  const [filterSpec, setFilterSpec] = useState("All");

  const specialties = ["All", ...Array.from(new Set(trainers.map(t => t.specialty.split(" & ")[0])))];
  const filtered = trainers.filter(t => t.active && (filterSpec === "All" || t.specialty.includes(filterSpec)));

  const handleWhatsAppContact = (trainer: TrainerData) => {
    const textMsg = `Hi! I would like to book a session with Trainer ${trainer.name} for ${trainer.specialty}. ${
      authUser ? `My account name is ${authUser.name} (${authUser.phone || ""}).` : ""
    } Please let me know the availability.`;
    
    const url = `https://wa.me/${brandSettings.phone}?text=${encodeURIComponent(textMsg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-40">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
          ) : (
            <div className="w-7 h-7 bg-primary rounded flex items-center justify-center"><Dumbbell size={14} className="text-white" /></div>
          )}
          <span style={{ ...H(18), letterSpacing: "0.05em" }} className="text-foreground uppercase">{brandSettings.name}</span>
        </button>
        <div className="flex items-center gap-3">
          {authUser ? (
            <button onClick={() => onNavigate(authUser.role === "trainer" ? "trainer" : authUser.role === "admin" ? "admin" : authUser.role === "guest" ? "guest" : "user")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              My Portal <ChevronRight size={14} />
            </button>
          ) : (
            <>
              <button onClick={() => onNavigate("login")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><LogIn size={14} /> Login</button>
              <button onClick={() => onNavigate("login")} className="bg-primary text-white px-4 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)" }}>Join Now</button>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-xs tracking-widest uppercase mb-2">Our Team</p>
          <h1 style={H(52)} className="text-foreground mb-3 uppercase">MEET OUR EXPERT TRAINERS</h1>
          <p className="text-muted-foreground max-w-xl">All our trainers are certified professionals with proven results. Browse profiles, contact them on WhatsApp, or book directly.</p>
        </div>

        {/* Specialty filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {specialties.map(s => (
            <button key={s} onClick={() => setFilterSpec(s)} className={`px-4 py-2 text-sm transition-all ${filterSpec === s ? "bg-primary text-white" : "border border-border text-muted-foreground hover:border-primary"}`} style={{ borderRadius: "var(--radius)" }}>{s}</button>
          ))}
        </div>

        {/* Trainer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filtered.map(t => (
            <div key={t.id} className="bg-card border border-border overflow-hidden hover:border-primary/40 transition-all group cursor-pointer" style={{ borderRadius: "var(--radius)" }} onClick={() => setSelected(t)}>
              <div className="flex gap-4 p-5">
                <div className="relative shrink-0">
                  <img src={`https://images.unsplash.com/${t.image}?w=100&h=100&fit=crop&auto=format`} alt={t.name} className="w-24 h-24 object-cover" style={{ borderRadius: "var(--radius)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 style={H(20)} className="text-foreground">{t.name}</h3>
                      <p className="text-primary text-xs mb-2">{t.specialty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={H(18)} className="text-foreground">₹{t.fee.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={`${t.id}-s${i}`} size={10} className={i <= Math.round(t.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />)}
                      {t.rating} ({t.reviews})
                    </span>
                    <span className="flex items-center gap-1"><Award size={10} /> {t.cert}</span>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{t.bio}</p>
                </div>
              </div>
              <div className="px-5 py-3.5 flex items-center justify-between border-t border-border bg-secondary/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppContact(t);
                  }}
                  className="flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 text-xs font-semibold"
                >
                  <Phone size={12} /> Contact Trainer via WhatsApp
                </button>
                <button className="text-primary text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Profile <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ borderRadius: "var(--radius)" }} onClick={e => e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden bg-secondary">
              <img src={`https://images.unsplash.com/${selected.image}?w=800&h=200&fit=crop&auto=format`} alt={selected.name} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,20,20,1) 20%, transparent)" }} />
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 flex items-center justify-center" style={{ borderRadius: "var(--radius)" }}><X size={14} className="text-white" /></button>
              <div className="absolute bottom-4 left-5 flex items-end gap-4">
                <img src={`https://images.unsplash.com/${selected.image}?w=80&h=80&fit=crop&auto=format`} alt={selected.name} className="w-16 h-16 object-cover border-2 border-primary" style={{ borderRadius: "var(--radius)" }} />
                <div>
                  <h2 style={H(26)} className="text-white">{selected.name}</h2>
                  <p className="text-primary text-sm">{selected.specialty}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[["Rating", `${selected.rating}★`],["Sessions", selected.sessions.toLocaleString()],["Experience", selected.exp]].map(([l,v]) => (
                  <div key={l} className="bg-secondary p-3 text-center" style={{ borderRadius: "var(--radius)" }}>
                    <p style={H(22)} className="text-foreground">{v}</p>
                    <p className="text-muted-foreground text-xs">{l}</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selected.bio}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWhatsAppContact(selected)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm transition-colors flex items-center justify-center gap-2"
                  style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700 }}
                >
                  <Phone size={15} /> WhatsApp Contact
                </button>
                <button
                  onClick={() => { setSelected(null); onNavigate("login"); }}
                  className="flex-1 bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors"
                  style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700 }}
                >
                  {authUser ? "BOOK A SESSION" : "JOIN TO BOOK A SESSION"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
