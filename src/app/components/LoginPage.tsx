import { useState } from "react";
import { toast } from "sonner";
import { Dumbbell, Eye, EyeOff, ArrowRight, Check, User, Users, Shield } from "lucide-react";
import type { AuthUser, Plan, TrainerData, BrandSettings } from "../App";
import { RazorpayModal } from "./RazorpayModal";

const H = (s = 32) => ({ fontFamily: "'Barlow Condensed', sans-serif", fontSize: `${s}px`, fontWeight: 800, lineHeight: 1 });

const PLANS: { id: Plan; label: string; price: number; color: string; features: string[] }[] = [
  { id: "STARTER", label: "STARTER", price: 999,  color: "border-border",         features: ["Gym floor access", "2 group classes/month", "Basic health tracking"] },
  { id: "PRO",     label: "PRO",     price: 1999, color: "border-primary",         features: ["Unlimited classes", "1 PT session/month", "Full health dashboard", "Priority booking"] },
  { id: "ELITE",   label: "ELITE",   price: 3499, color: "border-orange-400/60",   features: ["24/7 access", "4 PT sessions/month", "Body scans", "Guest passes", "Nutrition consulting"] },
];

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onNavigate: (v: string) => void;
  members: AuthUser[];
  setMembers: React.Dispatch<React.SetStateAction<AuthUser[]>>;
  trainers: TrainerData[];
  brandSettings: BrandSettings;
}

export function LoginPage({ onLogin, onNavigate, members, setMembers, trainers, brandSettings }: LoginPageProps) {
  const [tab, setTab]             = useState<"member" | "signup" | "guest" | "trainer">("member");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("PRO");
  
  // Signup state
  const [signupName, setSignupName]     = useState("");
  const [signupEmail, setSignupEmail]   = useState("");
  const [signupPhone, setSignupPhone]   = useState("");
  const [signupPass, setSignupPass]     = useState("");
  const [signupAge, setSignupAge]       = useState("");
  const [signupHeight, setSignupHeight] = useState("");
  
  // Guest state
  const [guestName, setGuestName]       = useState("");
  const [guestPhone, setGuestPhone]     = useState("");
  const [guestEmail, setGuestEmail]     = useState("");
  const [guestGoal, setGuestGoal]       = useState("");
  
  // Trainer state
  const [trainerEmail, setTrainerEmail] = useState("");
  const [trainerPass, setTrainerPass]   = useState("");

  // Payment Modal state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);

  /* Member login */
  const handleMemberLogin = () => {
    if (!email || !password) { toast.error("Enter email and password"); return; }
    // Admin
    if (email === "admin@ironfit.in" && password === "admin123") {
      onLogin({ id: "ADMIN", name: "Admin", email, role: "admin" });
      return;
    }
    const member = members.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (!member || password !== "member123") { toast.error("Invalid credentials"); return; }
    toast.success(`Welcome back, ${member.name}!`);
    onLogin(member);
  };

  /* New member signup click */
  const handleSignupSubmit = () => {
    // 1. Basic empty fields checks
    if (!signupName.trim() || !signupEmail.trim() || !signupPass.trim()) {
      toast.error("Please fill in Name, Email, and Password.");
      return;
    }

    // 2. Name validation (letters & spaces, min 2 chars)
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(signupName.trim())) {
      toast.error("Name must contain only letters and spaces (min 2 chars).");
      return;
    }

    // 3. Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(signupEmail.trim())) {
      toast.error("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    // 4. Phone validation (exactly 10 digits)
    const cleanPhone = signupPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile phone number.");
      return;
    }

    // 5. Password length check
    if (signupPass.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    // 6. Age verification
    if (signupAge) {
      const ageNum = parseInt(signupAge);
      if (isNaN(ageNum) || ageNum < 12 || ageNum > 100) {
        toast.error("Age must be a positive integer between 12 and 100.");
        return;
      }
    }

    // 7. Height verification
    if (signupHeight) {
      const heightNum = parseInt(signupHeight);
      if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
        toast.error("Height must be a positive integer between 100 and 250 cm.");
        return;
      }
    }

    if (members.some(m => m.email.toLowerCase() === signupEmail.toLowerCase())) {
      toast.error("Email is already registered");
      return;
    }

    const roleMap: Record<Plan, AuthUser["role"]> = { STARTER: "starter", PRO: "pro", ELITE: "elite" };
    const tempUser: AuthUser = {
      id: `U${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim().toLowerCase(),
      phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
      role: roleMap[selectedPlan],
      plan: selectedPlan,
      joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      age: signupAge ? parseInt(signupAge) : undefined,
      height: signupHeight ? parseInt(signupHeight) : undefined,
      status: "active",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      revenue: PLANS.find(p => p.id === selectedPlan)?.price || 0,
    };
    
    setPendingUser(tempUser);
    setIsPaymentOpen(true);
  };

  /* Successful payment completion */
  const handlePaymentSuccess = (paymentDetails: { method: string; transactionId: string }) => {
    if (!pendingUser) return;
    
    // Add to members list
    setMembers(prev => [...prev, pendingUser]);
    toast.success(`Welcome to ${brandSettings.name}, ${pendingUser.name}! 🎉`, {
      description: `${pendingUser.plan} plan activated. Trans ID: ${paymentDetails.transactionId} (${paymentDetails.method})`
    });
    onLogin(pendingUser);
    setPendingUser(null);
  };

  /* Guest free pass */
  const handleGuestAccess = () => {
    if (!guestName.trim() || !guestPhone.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }

    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(guestName.trim())) {
      toast.error("Guest name must contain only letters and spaces (min 2 chars).");
      return;
    }

    const cleanPhone = guestPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile phone number.");
      return;
    }

    if (guestEmail.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(guestEmail.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    const guest: AuthUser = {
      id: `G${Date.now()}`,
      name: guestName.trim(),
      email: guestEmail.trim().toLowerCase() || `${guestName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
      role: "guest",
      hasUsedFreePass: true,
      joined: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "active",
      expires: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      revenue: 0
    };

    setMembers(prev => [...prev, guest]);
    toast.success(`Welcome, ${guestName}! Your free day pass is active.`, { description: "Valid today only." });
    onLogin(guest);
  };

  /* Trainer login */
  const handleTrainerLogin = () => {
    if (!trainerEmail || !trainerPass) { toast.error("Enter credentials"); return; }
    const trainer = trainers.find(t => t.email === trainerEmail);
    if (!trainer || trainerPass !== "trainer123") { toast.error("Invalid trainer credentials"); return; }
    toast.success(`Welcome, ${trainer.name}!`);
    onLogin({ id: `T${trainer.id}`, name: trainer.name, email: trainer.email, role: "trainer", trainerId: trainer.id });
  };

  const tabClass = (t: typeof tab) =>
    `px-5 py-2.5 text-sm transition-all flex items-center gap-2 ${tab === t ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"}`;

  const currentPlanObj = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Razorpay Integration Modal */}
      {isPaymentOpen && pendingUser && currentPlanObj && (
        <RazorpayModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          amount={currentPlanObj.price}
          itemName={`${currentPlanObj.label} Membership`}
          customerName={pendingUser.name}
          customerEmail={pendingUser.email}
          customerPhone={pendingUser.phone || ""}
          gymName={brandSettings.name}
        />
      )}

      {/* Left panel – hero */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=1200&fit=crop&auto=format" alt="Gym" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.96) 40%, rgba(239,45,45,0.2) 100%)" }} />
        </div>
        <div className="relative z-10 flex items-center gap-2">
          {brandSettings.logoUrl ? (
            <img src={brandSettings.logoUrl} alt="Logo" className="h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center"><Dumbbell size={16} className="text-white" /></div>
          )}
          <span style={{ ...H(22), letterSpacing: "0.05em" }} className="text-foreground uppercase">{brandSettings.name}</span>
        </div>
        <div className="relative z-10">
          <h1 style={H(56)} className="text-foreground mb-4 leading-none uppercase">YOUR GYM.<br /><span className="text-primary">YOUR RULES.</span></h1>
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm max-w-sm">Join {members.filter(m => m.role !== "guest").length + 2400}+ members transforming their lives with world-class trainers and state-of-the-art facilities.</p>
          <div className="flex gap-6">
            {[
              [`${members.filter(m => m.role !== "guest").length + 2400}+`, "Members"],
              ["48", "Classes/wk"],
              ["4.9★", "Rating"]
            ].map(([n, l]) => (
              <div key={l}><p style={H(28)} className="text-primary">{n}</p><p className="text-muted-foreground text-xs mt-0.5">{l}</p></div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-muted-foreground text-xs">© 2026 {brandSettings.name}. All rights reserved.</div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 overflow-y-auto">
        <button onClick={() => onNavigate("landing")} className="text-muted-foreground text-xs hover:text-foreground mb-8 flex items-center gap-1 transition-colors">← Back to site</button>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          <button className={tabClass("member")}  onClick={() => setTab("member")}><User size={14} /> Member Login</button>
          <button className={tabClass("signup")}  onClick={() => setTab("signup")}><Shield size={14} /> Sign Up</button>
          <button className={tabClass("guest")}   onClick={() => setTab("guest")}><ArrowRight size={14} /> Free Day Pass</button>
          <button className={tabClass("trainer")} onClick={() => setTab("trainer")}><Users size={14} /> Trainer Login</button>
        </div>

        {/* ── MEMBER LOGIN ── */}
        {tab === "member" && (
          <div className="max-w-sm w-full mx-auto">
            <h2 style={H(28)} className="text-foreground mb-1">WELCOME BACK</h2>
            <p className="text-muted-foreground text-sm mb-6">Log in to access your membership.</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="anjali@ironfit.in" className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
              </div>
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleMemberLogin()} placeholder="••••••••" className="w-full bg-card border border-border px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                  <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPass ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                </div>
              </div>
            </div>
            <button onClick={handleMemberLogin} className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors mb-4" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>LOG IN</button>
            <p className="text-center text-muted-foreground text-xs">Don't have an account? <button onClick={() => setTab("signup")} className="text-primary hover:underline">Sign up</button></p>
            <div className="mt-6 p-3 bg-card border border-border text-xs text-muted-foreground" style={{ borderRadius: "var(--radius)" }}>
              <p className="mb-1 text-foreground text-xs font-medium">Demo accounts (password: member123)</p>
              {members.map(m => (
                <p key={m.id}>{m.plan}: {m.email} ({m.name})</p>
              ))}
              <p className="mt-1">Admin: admin@ironfit.in / admin123</p>
            </div>
          </div>
        )}

        {/* ── SIGN UP ── */}
        {tab === "signup" && (
          <div className="max-w-lg w-full mx-auto">
            <h2 style={H(28)} className="text-foreground mb-1">JOIN {brandSettings.name.toUpperCase()}</h2>
            <p className="text-muted-foreground text-sm mb-5">Create your membership account.</p>

            {/* Plan picker */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {PLANS.map(p => (
                <button key={p.id} onClick={() => setSelectedPlan(p.id)} className={`p-4 border-2 text-left transition-all ${selectedPlan === p.id ? p.color + " bg-primary/5" : "border-border hover:border-primary/30"}`} style={{ borderRadius: "var(--radius)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 800, letterSpacing: "0.06em" }} className={selectedPlan === p.id ? "text-primary" : "text-muted-foreground"}>{p.label}</span>
                    {selectedPlan === p.id && <Check size={12} className="text-primary" />}
                  </div>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px", fontWeight: 900 }} className="text-foreground">₹{p.price}<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                  <ul className="mt-2 space-y-0.5">
                    {p.features.slice(0, 3).map(f => <li key={f} className="text-muted-foreground text-xs flex items-center gap-1"><Check size={9} className="text-primary shrink-0" />{f}</li>)}
                  </ul>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Full Name *", val: signupName, set: setSignupName, type: "text",   placeholder: "Anjali Verma",    col: 2 },
                { label: "Email *",     val: signupEmail,set: setSignupEmail,type: "email",  placeholder: "anjali@email.com",col: 1 },
                { label: "Phone *",     val: signupPhone,set: setSignupPhone,type: "tel",    placeholder: "+91 98765 43210", col: 1 },
                { label: "Password *",  val: signupPass, set: setSignupPass, type: "password",placeholder: "Min 8 chars",    col: 1 },
                { label: "Age",         val: signupAge,  set: setSignupAge,  type: "number", placeholder: "e.g. 28",         col: 1 },
                { label: "Height (cm)", val: signupHeight,set: setSignupHeight,type:"number",placeholder: "e.g. 165",        col: 1 },
              ].map(({ label, val, set, type, placeholder, col }) => (
                <div key={label} className={col === 2 ? "col-span-2" : ""}>
                  <label className="text-muted-foreground text-xs block mb-1.5">{label}</label>
                  <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} className="w-full bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                </div>
              ))}
            </div>
            <button onClick={handleSignupSubmit} className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>
              PROCEED TO PAY — ₹{PLANS.find(p => p.id === selectedPlan)?.price.toLocaleString()}/mo
            </button>
            <p className="text-center text-muted-foreground text-xs mt-3">Already a member? <button onClick={() => setTab("member")} className="text-primary hover:underline">Log in</button></p>
          </div>
        )}

        {/* ── FREE DAY PASS ── */}
        {tab === "guest" && (
          <div className="max-w-sm w-full mx-auto">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 mb-4" style={{ borderRadius: "var(--radius)" }}>
              <span className="text-primary text-xs">🎁 1 FREE DAY PASS</span>
            </div>
            <h2 style={H(28)} className="text-foreground mb-1">TRY {brandSettings.name.toUpperCase()} FREE</h2>
            <p className="text-muted-foreground text-sm mb-6">Fill in your details to claim your complimentary day pass. No credit card required.</p>
            <div className="space-y-3 mb-5">
              {[
                { label: "Full Name *",    val: guestName,  set: setGuestName,  type: "text",  placeholder: "Divya Sharma" },
                { label: "Phone Number *", val: guestPhone, set: setGuestPhone, type: "tel",   placeholder: "+91 98001 11234" },
                { label: "Email",          val: guestEmail, set: setGuestEmail, type: "email", placeholder: "divya@email.com" },
                { label: "Fitness Goal",   val: guestGoal,  set: setGuestGoal,  type: "text",  placeholder: "e.g. Lose weight, Build strength…" },
              ].map(({ label, val, set, type, placeholder }) => (
                <div key={label}>
                  <label className="text-muted-foreground text-xs block mb-1.5">{label}</label>
                  <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} className="w-full bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
                </div>
              ))}
            </div>
            <button onClick={handleGuestAccess} className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors mb-4" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>
              CLAIM MY FREE PASS
            </button>
            <p className="text-muted-foreground text-xs text-center">After your free day, explore our <button onClick={() => setTab("signup")} className="text-primary hover:underline">membership plans</button>.</p>
          </div>
        )}

        {/* ── TRAINER LOGIN ── */}
        {tab === "trainer" && (
          <div className="max-w-sm w-full mx-auto">
            <h2 style={H(28)} className="text-foreground mb-1">TRAINER PORTAL</h2>
            <p className="text-muted-foreground text-sm mb-6">Log in to manage your classes and availability.</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5">Trainer Email</label>
                <input type="email" value={trainerEmail} onChange={e => setTrainerEmail(e.target.value)} placeholder="priya@ironfit.in" className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
              </div>
              <div>
                <label className="text-muted-foreground text-xs block mb-1.5">Password</label>
                <input type="password" value={trainerPass} onChange={e => setTrainerPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTrainerLogin()} placeholder="••••••••" className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" style={{ borderRadius: "var(--radius)" }} />
              </div>
            </div>
            <button onClick={handleTrainerLogin} className="w-full bg-primary text-white py-3 text-sm hover:bg-primary/90 transition-colors" style={{ borderRadius: "var(--radius)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>
              LOG IN AS TRAINER
            </button>
            <div className="mt-5 p-3 bg-card border border-border text-xs text-muted-foreground" style={{ borderRadius: "var(--radius)" }}>
              <p className="mb-1 text-foreground text-xs font-medium">Demo trainer accounts (password: trainer123)</p>
              {[
                ["priya@ironfit.in","Priya Sharma"],
                ["arjun@ironfit.in","Arjun Mehta"],
                ["neha@ironfit.in","Neha Kapoor"],
                ["rahul@ironfit.in","Rahul Nair"]
              ].map(([e,n]) => (
                <p key={e}>{e} — {n}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
