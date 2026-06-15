import { useState } from "react";
import {
  Dumbbell, Zap, Users, Calendar, Shield, TrendingUp,
  ChevronRight, Star, Check, Phone, Mail, MapPin,
  Instagram, Twitter, Youtube, ArrowRight, Clock, Award, Bell,
  Eye, EyeOff, X, Menu
} from "lucide-react";
import { toast } from "sonner";
import type { SiteContent, TrainerData, BrandSettings } from "../App";

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });

interface LandingProps {
  onNavigate: (view: string) => void;
  content: SiteContent;
  trainers: TrainerData[];
  brandSettings: BrandSettings;
}

const CLASSES = [
  { id: 1, name: "Power Yoga",      trainer: "Priya Sharma",  time: "6:00 AM", day: "Mon", spots: 3,  image: "photo-1544367567-0f2fcb009e0b" },
  { id: 2, name: "Zumba Blast",     trainer: "Neha Kapoor",   time: "7:30 AM", day: "Mon", spots: 0,  image: "photo-1518611012118-696072aa579a" },
  { id: 3, name: "Boxing",          trainer: "Arjun Mehta",   time: "9:00 AM", day: "Tue", spots: 4,  image: "photo-1549719386-74dfcbf7dbed" },
  { id: 4, name: "HIIT Circuit",    trainer: "Rahul Nair",    time: "6:00 PM", day: "Tue", spots: 5,  image: "photo-1534438327276-14e5300c3a48" },
];

export function Landing({ onNavigate, content, trainers, brandSettings }: LandingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAdminAccess = () => {
    if (adminPassword === "admin123") {
      toast.success("Access Granted! Loading Admin Panel...");
      setIsAdminModalOpen(false);
      setAdminPassword("");
      onNavigate("admin");
    } else {
      toast.error("Invalid Admin Password");
    }
  };

  const planPrice = (base: number) =>
    billingCycle === "monthly" ? base : billingCycle === "quarterly" ? Math.round(base * 2.7) : Math.round(base * 10);

  const PLANS = [
    { name: "STARTER", price: content.pricing.starter_mo, color: "border-border",       features: content.starterFeatures },
    { name: "PRO",     price: content.pricing.pro_mo,     color: "border-primary",      features: content.proFeatures, popular: true },
    { name: "ELITE",   price: content.pricing.elite_mo,   color: "border-orange-400/60",features: content.eliteFeatures },
  ];

  return (
    <div className="bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center"><Dumbbell size={18} className="text-white" /></div>
          )}
          <span style={{ ...H(22), letterSpacing: "0.05em" }} className="text-foreground uppercase">
            {brandSettings.name.split(" ").map((w, i) => (
              i === 1 ? <span key={i} className="text-primary">{w} </span> : <span key={i}>{w} </span>
            ))}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate("profiles")} className="text-muted-foreground hover:text-foreground text-sm transition-colors">Trainers</button>
          {["classes","pricing","about"].map(s => (
            <a key={s} href={`#${s}`} className="text-muted-foreground hover:text-foreground transition-colors text-sm capitalize">{s}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => onNavigate("login")} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Log In</button>
          <button onClick={() => onNavigate("login")} className="bg-primary text-white px-5 py-2 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Join Now</button>
        </div>
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => onNavigate("login")} className="bg-primary text-white px-3 py-1.5 text-xs hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Join</button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground focus:outline-none p-1">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-background/98 backdrop-blur-md flex flex-col p-6 md:hidden border-b border-border transition-all">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("profiles");
              }} 
              className="text-left text-foreground hover:text-primary transition-colors py-2 border-b border-border/20"
            >
              Trainers
            </button>
            {["classes","pricing","about"].map(s => (
              <a 
                key={s} 
                href={`#${s}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors capitalize py-2 border-b border-border/20"
              >
                {s}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate("login");
              }} 
              className="text-left text-foreground hover:text-primary transition-colors py-2 border-b border-border/20"
            >
              Log In
            </button>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminModalOpen(true);
              }} 
              className="text-left text-primary hover:text-primary/80 transition-colors py-2"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&auto=format)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.95) 50%, rgba(239,45,45,0.15) 100%)" }} />
        <div className="relative z-10 px-8 md:px-16 max-w-6xl">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 mb-6" style={{ borderRadius: "var(--radius)" }}>
            <Zap size={12} className="text-primary" />
            <span className="text-primary text-xs tracking-widest uppercase">{content.heroBadge}</span>
          </div>
          <h1 className="text-foreground mb-6 leading-none" style={{ ...H(Math.min(120, 64)), fontSize: "clamp(44px,8vw,120px)" }}>
            {content.heroHeadline.split("\n").map((line, i) => (
              <span key={i}>{i === 1 ? <span className="text-primary">{line}</span> : line}{i < 2 ? <br /> : null}</span>
            ))}
          </h1>
          <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed" style={{ fontSize: "18px" }}>{content.heroSubHeadline}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button onClick={() => onNavigate("login")} className="flex items-center gap-2 bg-primary text-white px-8 py-4 hover:bg-primary/90 transition-colors" style={{ ...H(18), letterSpacing: "0.05em", borderRadius: "var(--radius)" }}>
              START FREE TRIAL <ArrowRight size={20} />
            </button>
            <button onClick={() => onNavigate("login")} className="flex items-center gap-2 border border-border text-foreground px-8 py-4 hover:border-primary transition-colors" style={{ ...H(18), letterSpacing: "0.05em", borderRadius: "var(--radius)" }}>
              TRY FREE DAY PASS
            </button>
          </div>
          <div className="flex items-center gap-8">
            {[[content.stat1Num, content.stat1Label],[content.stat2Num, content.stat2Label],[content.stat3Num, content.stat3Label]].map(([num, label]) => (
              <div key={label}>
                <p style={H(32)} className="text-foreground">{num}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section id="about" className="py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center md:text-left mb-12">
            <p className="text-primary text-xs tracking-widest uppercase mb-3">State-of-the-Art</p>
            <h2 style={{ ...H(56), fontSize: "clamp(36px,5vw,56px)" }} className="text-foreground leading-none">EVERYTHING YOU NEED<br />TO CRUSH GOALS.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Calendar,    title: "Smart Booking",      desc: "Book classes online. Automated waitlists when slots fill up. Cancel anytime." },
              { icon: TrendingUp,  title: "Health Dashboard",   desc: "Track weight, BMI, height, age-adjusted metrics, and workout progress." },
              { icon: Shield,      title: "Secure Payments",    desc: "Auto-debit via Razorpay. Manage subscriptions, pause, or upgrade anytime." },
              { icon: Users,       title: "Elite Trainers",     desc: "Certified trainers across Yoga, Boxing, Zumba, HIIT, and strength training." },
              { icon: Zap,         title: "Real-time Alerts",   desc: "WhatsApp notifications for class updates, offers, and expiry reminders." },
              { icon: Award,       title: "Proven Results",     desc: "Members average 12kg weight loss and 40% strength gains in 6 months." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border border-border hover:border-primary/30 transition-all group" style={{ borderRadius: "var(--radius)" }}>
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 style={H(19)} className="text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section id="classes" className="py-24 px-8 md:px-16 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
            <div>
              <p className="text-primary text-xs tracking-widest uppercase mb-3">Live Sessions</p>
              <h2 style={{ ...H(56), fontSize: "clamp(36px,5vw,56px)" }} className="text-foreground">POPULAR CLASSES</h2>
            </div>
            <button onClick={() => onNavigate("login")} className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">View Full Schedule <ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLASSES.map(c => (
              <div key={c.id} className="bg-background border border-border overflow-hidden hover:border-primary/30 transition-colors" style={{ borderRadius: "var(--radius)" }}>
                <div className="h-48 relative">
                  <img src={`https://images.unsplash.com/${c.image}?w=400&h=300&fit=crop&auto=format`} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-1 flex items-center gap-1" style={{ borderRadius: "var(--radius)" }}>
                    <Clock size={10} /> {c.time}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5" style={{ borderRadius: "calc(var(--radius) - 2px)" }}>{c.day}</span>
                  <h3 style={H(20)} className="text-foreground mt-2.5 mb-1">{c.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3">Trainer: {c.trainer}</p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-border/40">
                    <span className={c.spots === 0 ? "text-primary font-semibold" : "text-muted-foreground"}>
                      {c.spots === 0 ? "FULL" : `${c.spots} Spots Left`}
                    </span>
                    <button onClick={() => onNavigate("login")} className="text-primary font-bold hover:underline">Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-xs tracking-widest uppercase mb-3">Membership</p>
            <h2 style={{ ...H(56), fontSize: "clamp(36px,5vw,56px)" }} className="text-foreground mb-8">CHOOSE YOUR PLAN</h2>
            {/* Active offers */}
            {content.offers.filter(o => o.active).length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {content.offers.filter(o => o.active).map(o => (
                  <span key={o.id} className="text-xs bg-primary/10 text-primary border border-primary/30 px-3 py-1" style={{ borderRadius: "var(--radius)" }}>
                    🎁 {o.title}: {o.discount} — {o.expires}
                  </span>
                ))}
              </div>
            )}
            <div className="inline-flex border border-border p-1" style={{ borderRadius: "var(--radius)" }}>
              {(["monthly","quarterly","annual"] as const).map(cycle => (
                <button key={cycle} onClick={() => setBillingCycle(cycle)} className={`px-5 py-2 text-sm transition-all capitalize ${billingCycle === cycle ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`} style={{ borderRadius: "calc(var(--radius) - 2px)" }}>
                  {cycle}{cycle === "annual" && <span className="ml-1 text-xs opacity-70">-17%</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`p-8 border-2 transition-all relative ${"popular" in plan && plan.popular ? plan.color + " bg-primary/5" : plan.color + " hover:border-primary/30"}`} style={{ borderRadius: "var(--radius)" }}>
                {"popular" in plan && plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1 tracking-widest" style={{ borderRadius: "var(--radius)" }}>MOST POPULAR</div>}
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700 }} className="text-primary tracking-widest mb-4">{plan.name}</div>
                <div className="mb-6">
                  <span style={H(44)} className="text-foreground">₹{planPrice(plan.price).toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm">/{billingCycle === "monthly" ? "mo" : billingCycle === "quarterly" ? "qtr" : "yr"}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => onNavigate("login")} className={`w-full py-3 text-sm tracking-wide transition-all ${"popular" in plan && plan.popular ? "bg-primary text-white hover:bg-primary/90" : "border border-border hover:border-primary text-foreground"}`} style={{ ...H(16), borderRadius: "var(--radius)" }}>
                  GET STARTED
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-6">Not sure? <button onClick={() => onNavigate("login")} className="text-primary hover:underline">Try a free day pass</button> before committing.</p>
        </div>
      </section>

      {/* BLOG POSTS */}
      {content.blogPosts.filter(b => b.published).length > 0 && (
        <section className="py-20 px-8 md:px-16 bg-card border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-3">Blog</p>
                <h2 style={{ ...H(56), fontSize: "clamp(36px,5vw,56px)" }} className="text-foreground">LATEST READS</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.blogPosts.filter(b => b.published).map(post => (
                <div key={post.id} className="bg-background border border-border p-6 hover:border-primary/30 transition-all cursor-pointer group" style={{ borderRadius: "var(--radius)" }}>
                  <p className="text-primary text-xs mb-3">{post.date}</p>
                  <h3 style={H(18)} className="text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
                  <button className="text-primary text-xs mt-4 flex items-center gap-1 hover:gap-2 transition-all">Read more <ChevronRight size={11} /></button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LEAD CAPTURE */}
      <section className="py-24 px-8 md:px-16 relative overflow-hidden border-t border-border">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 style={{ ...H(56), fontSize: "clamp(36px,5vw,56px)" }} className="text-foreground mb-4">NOT READY TO COMMIT?</h2>
            <p className="text-muted-foreground leading-relaxed">Get a free 1-day pass and a personalised fitness consultation — no credit card required.</p>
          </div>
          <div className="flex-1 w-full">
            {leadSubmitted ? (
              <div className="bg-card border border-primary/30 p-6 text-center" style={{ borderRadius: "var(--radius)" }}>
                <Check size={32} className="text-primary mx-auto mb-3" />
                <p style={H(20)} className="text-foreground">YOU'RE IN!</p>
                <p className="text-muted-foreground text-sm">We'll contact you at your phone/email to set up your free session.</p>
              </div>
            ) : (
              <div className="bg-card border border-border p-6 space-y-3" style={{ borderRadius: "var(--radius)" }}>
                {[{k:"name",p:"Full Name",t:"text"},{k:"phone",p:"Phone Number",t:"tel"},{k:"email",p:"Email Address",t:"email"}].map(({k,p,t}) => (
                  <input key={k} type={t} placeholder={p} value={leadForm[k as keyof typeof leadForm]} onChange={e => setLeadForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                ))}
                <button onClick={() => setLeadSubmitted(true)} className="w-full bg-primary text-white py-3 hover:bg-primary/90 transition-colors" style={{ ...H(16), letterSpacing: "0.05em", borderRadius: "var(--radius)" }}>CLAIM FREE DAY PASS</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-8 md:px-16 bg-card">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {brandSettings.logoUrl ? (
                <img src={brandSettings.logoUrl} alt="Logo" className="h-6 object-contain" />
              ) : (
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center"><Dumbbell size={12} className="text-white" /></div>
              )}
              <span style={{ ...H(18) }} className="text-foreground uppercase">{brandSettings.name}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4">{brandSettings.name} premier fitness destination.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <div key={i} className="w-8 h-8 border border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors" style={{ borderRadius: "var(--radius)" }}>
                  <Icon size={14} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Quick Links", links: [["About Us","#"],["Trainers","profiles"],["Classes","#classes"],["Blog","#"]] },
            { title: "Account",     links: [["Member Login","login"],["Sign Up","login"],["Free Day Pass","login"],["Trainer Login","login"], ["Admin Portal", "admin-portal"]] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700 }} className="text-foreground tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <button onClick={() => {
                      if (href === "admin-portal") {
                        setIsAdminModalOpen(true);
                      } else if (href.startsWith("#")) {
                        // no-op
                      } else {
                        onNavigate(href);
                      }
                    }} className="text-muted-foreground text-xs hover:text-foreground transition-colors text-left">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", fontWeight: 700 }} className="text-foreground tracking-widest mb-4">CONTACT</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={12} className="text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-xs">Andheri West, Mumbai 400053</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={12} className="text-primary mt-0.5 shrink-0" />
                <a href={`tel:${brandSettings.phone}`} className="text-muted-foreground text-xs hover:text-foreground">+{brandSettings.phone}</a>
              </div>
              <div className="flex items-start gap-2">
                <Mail size={12} className="text-primary mt-0.5 shrink-0" />
                <a href={`mailto:${brandSettings.email}`} className="text-muted-foreground text-xs hover:text-foreground">{brandSettings.email}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border flex items-center justify-between">
          <p className="text-muted-foreground text-xs">© 2026 {brandSettings.name}. All rights reserved.</p>
          <p className="text-muted-foreground text-xs">Powered by Razorpay · GST: 27XXXXX1234X1ZX</p>
        </div>
      </footer>

      {/* Admin Password Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm p-6 relative" style={{ borderRadius: "var(--radius)" }}>
            <button
              onClick={() => {
                setIsAdminModalOpen(false);
                setAdminPassword("");
              }}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span style={{ ...H(20), letterSpacing: "0.05em" }} className="text-foreground">
                ADMIN <span className="text-primary">PORTAL</span>
              </span>
            </div>
            <p className="text-muted-foreground text-xs mb-4">
              Please enter the administrator password to gain access to the dashboard.
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showAdminPass ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminAccess()}
                    placeholder="••••••••"
                    className="w-full bg-background border border-border px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    style={{ borderRadius: "var(--radius)" }}
                    autoFocus
                  />
                  <button
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAdminPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleAdminAccess}
              className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors"
              style={{
                borderRadius: "var(--radius)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              AUTHENTICATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
