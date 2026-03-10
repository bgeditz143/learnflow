import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const T = {
  // Primary — Professional Blue
  indigo:     "#1447E6", indigoMid: "#1447E6", indigoLight: "#3B68F9", indigoPale: "#EBF0FF",
  // Status
  amber:      "#B54708", amberLight: "#FEF0C7",
  green:      "#079455", greenLight: "#DCFAE6",
  red:        "#B42318", redLight:   "#FEE4E2",
  blue:       "#1447E6", blueLight:  "#EBF0FF",
  // Neutrals
  slate:      "#101828", slateM:     "#4B5565", slateL: "#9AA4B2", slateXL: "#F2F4F7",
  white:      "#FFFFFF", bg: "#F4F6FA",
  // Surface / Borders
  surface:    "#FFFFFF", border: "#E4E7EC", sidebar: "#0B1120",
};

/* ═══════════════════════════════════════════════════════════════
   DUMMY DATA
═══════════════════════════════════════════════════════════════ */
const TRAINING_TYPES = [
  { id:"onboarding",   label:"Onboarding",   icon:"🏢", color:"#312E81", bg:"#EEF2FF" },
  { id:"compliance",   label:"Compliance",   icon:"⚖️", color:"#DC2626", bg:"#FEE2E2" },
  { id:"softskills",   label:"Soft Skills",  icon:"💬", color:"#059669", bg:"#D1FAE5" },
  { id:"product",      label:"Product",      icon:"📦", color:"#2563EB", bg:"#DBEAFE" },
  { id:"safety",       label:"Safety",       icon:"🛡️", color:"#D97706", bg:"#FEF3C7" },
  { id:"leadership",   label:"Leadership",   icon:"🚀", color:"#7C3AED", bg:"#EDE9FE" },
  { id:"technical",    label:"Technical",    icon:"💻", color:"#0891B2", bg:"#CFFAFE" },
  { id:"sales",        label:"Sales",        icon:"📈", color:"#EA580C", bg:"#FFEDD5" },
];

const TRAININGS = [
  { id:1, title:"New Employee Onboarding — April 2026",     type:"onboarding",  slides:8,  assigned:24, completed:18, inProgress:4, notStarted:2, avgScore:78, deadline:"2026-04-30", status:"active",    mandatory:true,  createdAt:"2026-03-01" },
  { id:2, title:"POSH Compliance Training 2026",            type:"compliance",  slides:6,  assigned:31, completed:31, inProgress:0, notStarted:0, avgScore:82, deadline:"2026-03-31", status:"completed", mandatory:true,  createdAt:"2026-02-10" },
  { id:3, title:"Effective Communication & Presentation",   type:"softskills",  slides:10, assigned:18, completed:7,  inProgress:8, notStarted:3, avgScore:74, deadline:"2026-05-15", status:"active",    mandatory:false, createdAt:"2026-03-05" },
  { id:4, title:"Product Deep Dive — Platform v3.0",        type:"product",     slides:12, assigned:12, completed:4,  inProgress:5, notStarted:3, avgScore:69, deadline:"2026-04-20", status:"active",    mandatory:false, createdAt:"2026-03-08" },
  { id:5, title:"Workplace Safety & Emergency Procedures",  type:"safety",      slides:7,  assigned:45, completed:40, inProgress:3, notStarted:2, avgScore:88, deadline:"2026-03-20", status:"active",    mandatory:true,  createdAt:"2026-02-20" },
  { id:6, title:"Leadership Fundamentals for Managers",     type:"leadership",  slides:9,  assigned:8,  completed:2,  inProgress:4, notStarted:2, avgScore:71, deadline:"2026-06-01", status:"active",    mandatory:false, createdAt:"2026-03-10" },
  { id:7, title:"Data Privacy & GDPR Compliance",           type:"compliance",  slides:5,  assigned:50, completed:48, inProgress:2, notStarted:0, avgScore:91, deadline:"2026-03-15", status:"active",    mandatory:true,  createdAt:"2026-02-01" },
  { id:8, title:"Advanced Excel for Finance Team",          type:"technical",   slides:15, assigned:6,  completed:1,  inProgress:3, notStarted:2, avgScore:66, deadline:"2026-05-30", status:"draft",     mandatory:false, createdAt:"2026-03-12" },
];

const EMPLOYEES = [
  { id:1,  name:"Priya Sharma",   initials:"PS", dept:"HR",        role:"HR Executive",          assigned:4, completed:3, avgScore:84, status:"active",  manager:"Neha Gupta"  },
  { id:2,  name:"Rahul Mehta",    initials:"RM", dept:"Sales",     role:"Sales Executive",       assigned:3, completed:1, avgScore:72, status:"active",  manager:"Vikram Joshi"},
  { id:3,  name:"Anika Singh",    initials:"AS", dept:"Tech",      role:"Software Engineer",     assigned:5, completed:5, avgScore:91, status:"active",  manager:"Amit Kumar"  },
  { id:4,  name:"Deepak Verma",   initials:"DV", dept:"Finance",   role:"Finance Analyst",       assigned:3, completed:2, avgScore:77, status:"active",  manager:"Sunita Rao"  },
  { id:5,  name:"Meera Patel",    initials:"MP", dept:"Operations",role:"Ops Manager",           assigned:6, completed:6, avgScore:88, status:"active",  manager:"Rajiv Nair"  },
  { id:6,  name:"Arjun Kapoor",   initials:"AK", dept:"Sales",     role:"Senior Sales Manager",  assigned:2, completed:0, avgScore:null,status:"active",  manager:"Vikram Joshi"},
  { id:7,  name:"Sneha Joshi",    initials:"SJ", dept:"HR",        role:"Recruiter",             assigned:4, completed:3, avgScore:79, status:"active",  manager:"Neha Gupta"  },
  { id:8,  name:"Rohit Das",      initials:"RD", dept:"Tech",      role:"DevOps Engineer",       assigned:3, completed:1, avgScore:65, status:"inactive",manager:"Amit Kumar"  },
];

const SLIDES = [
  { id:1, title:"Welcome to the Company",            icon:"👋", gradient:"linear-gradient(135deg,#312E81,#4338CA)", bullets:["Founded in 2018, 500+ employees","Offices in Mumbai, Delhi, Bangalore","Core values: Integrity, Innovation, Impact","Your journey starts here today"] },
  { id:2, title:"Company Culture & Values",          icon:"🌱", gradient:"linear-gradient(135deg,#059669,#10B981)", bullets:["Open-door policy across all levels","Quarterly town halls with leadership","Employee resource groups (ERGs)","Mental health & wellness programs"] },
  { id:3, title:"Your Role & Responsibilities",      icon:"🎯", gradient:"linear-gradient(135deg,#D97706,#F59E0B)", bullets:["Understand your KPIs from Day 1","Weekly 1:1s with your direct manager","30-60-90 day plan to be shared","Reach out to buddy program anytime"] },
  { id:4, title:"IT Setup & Tools",                  icon:"💻", gradient:"linear-gradient(135deg,#2563EB,#3B82F6)", bullets:["Laptop + accessories from IT on Day 1","Email, Slack, Jira access in 24 hours","VPN setup guide in your email","IT helpdesk: ext 1100 or it@company.com"] },
  { id:5, title:"HR Policies — Leave & Benefits",   icon:"📋", gradient:"linear-gradient(135deg,#7C3AED,#8B5CF6)", bullets:["18 days paid leave per year","5 sick leaves + 3 emergency leaves","Health insurance: Self + family","Provident Fund: Company matches 12%"] },
];

const ASSESS_QS = [
  { q:"Company ke headquarters kahan hain?", opts:["Delhi","Mumbai","Bangalore","Hyderabad"], ans:1 },
  { q:"Employee ko kitne paid leaves milte hain per year?", opts:["12 days","15 days","18 days","21 days"], ans:2 },
  { q:"IT helpdesk ka extension number kya hai?", opts:["1001","1100","1010","1111"], ans:1 },
  { q:"Company ke core values mein kya shamil nahi hai?", opts:["Integrity","Innovation","Profit","Impact"], ans:2 },
  { q:"30-60-90 day plan kaun share karega?", opts:["HR team","IT department","Direct manager","CEO office"], ans:2 },
];

const deptColors = { HR:"#1447E6", Sales:"#EA580C", Tech:"#2563EB", Finance:"#059669", Operations:"#D97706", "default":"#475569" };

/* ═══════════════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#F4F6FA;color:#101828;-webkit-font-smoothing:antialiased;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#D0D5DD;border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:#98A2B3;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes bounceIn{0%{transform:scale(0.7);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(20,71,230,0.3)}50%{box-shadow:0 0 0 8px rgba(20,71,230,0)}}
  @keyframes wave{0%{height:4px}100%{height:20px}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}
  .fadeUp{animation:fadeUp 0.35s cubic-bezier(.22,.68,0,1.2) both;}
  .fadeIn{animation:fadeIn 0.25s ease both;}
  input,textarea,select{outline:none;font-family:'Inter',sans-serif;}
  button{font-family:'Inter',sans-serif;cursor:pointer;}
`;

function Sty() { return <style>{css}</style>; }

function Avatar({ initials, size=36, bg="#EBF0FF", color="#1447E6", fontSize=14 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, fontWeight:700, fontSize, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, letterSpacing:"-0.3px" }}>{initials}</div>;
}

function Badge({ children, color=T.indigoLight, bg=T.indigoPale, size=11 }) {
  return <span style={{ background:bg, color, fontSize:size, fontWeight:600, padding:"2px 8px", borderRadius:6, letterSpacing:"0.01em", whiteSpace:"nowrap", lineHeight:"18px", display:"inline-block" }}>{children}</span>;
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false, full=false, style={} }) {
  const sizes = {
    sm:{ fontSize:12, padding:"5px 12px",  borderRadius:7,  fontWeight:600 },
    md:{ fontSize:13, padding:"8px 18px",  borderRadius:8,  fontWeight:600 },
    lg:{ fontSize:14, padding:"11px 26px", borderRadius:9,  fontWeight:600 },
  };
  const vars = {
    primary: { background:"#1447E6", color:"#fff", border:"none", boxShadow:"0 1px 3px rgba(20,71,230,0.25)" },
    ghost:   { background:"transparent", color:"#1447E6", border:"1.5px solid #1447E6", boxShadow:"none" },
    danger:  { background:T.red, color:"#fff", border:"none", boxShadow:"none" },
    success: { background:T.green, color:"#fff", border:"none", boxShadow:"none" },
    subtle:  { background:T.slateXL, color:T.slateM, border:"none", boxShadow:"none" },
    white:   { background:"#fff", color:T.slate, border:"1px solid #E4E7EC", boxShadow:"0 1px 2px rgba(16,24,40,0.05)" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...sizes[size], ...vars[variant], letterSpacing:"-0.01em", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, width:full?"100%":"auto", transition:"all 0.15s", ...style }}
      onMouseEnter={e=>{ if(!disabled){ if(variant==="primary") e.currentTarget.style.background="#0F3CC4"; if(variant==="white") e.currentTarget.style.background="#F9FAFB"; }}}
      onMouseLeave={e=>{ if(!disabled){ if(variant==="primary") e.currentTarget.style.background="#1447E6"; if(variant==="white") e.currentTarget.style.background="#fff"; }}}>
      {children}
    </button>
  );
}

function Card({ children, style={}, onClick, hover=false }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#fff", borderRadius:12, border:`1px solid ${hov&&hover?"#C2D0FF":"#E4E7EC"}`,
        boxShadow: hov&&hover?"0 8px 24px rgba(20,71,230,0.08)":"0 1px 3px rgba(16,24,40,0.06)",
        transition:"all 0.18s ease", cursor:onClick?"pointer":"default", ...style }}>
      {children}
    </div>
  );
}

function ProgressBar({ pct, color=T.indigoLight, height=6, bg="#EAECF0" }) {
  return (
    <div style={{ height, background:bg, borderRadius:height, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.min(100,pct||0)}%`, background:color, borderRadius:height, transition:"width 0.7s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function TypeIcon({ type, size=40 }) {
  const t = TRAINING_TYPES.find(x=>x.id===type) || TRAINING_TYPES[0];
  return <div style={{ width:size, height:size, borderRadius:size*0.25, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.44, flexShrink:0, border:`1px solid ${t.color}18` }}>{t.icon}</div>;
}

function StatusBadge({ status }) {
  const map = {
    active:       ["Active",      T.green,   T.greenLight,  "●"],
    completed:    ["Completed",   "#079455", "#DCFAE6",     "✓"],
    draft:        ["Draft",       T.slateM,  T.slateXL,     "◐"],
    overdue:      ["Overdue",     T.red,     T.redLight,    "⚠"],
    "not-started":["Not Started", T.slateM,  T.slateXL,     "○"],
    "in-progress":["In Progress", "#1447E6", "#EBF0FF",     "▶"],
  };
  const [label,color,bg,icon] = map[status]||map["active"];
  return <span style={{ background:bg, color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:6, letterSpacing:"0.01em", whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:4 }}><span style={{ fontSize:9 }}>{icon}</span>{label}</span>;
}

function WaveAnim({ active, color=T.indigoLight }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      {[0.4,0.6,0.8,0.6,0.4].map((d,i)=>(
        <div key={i} style={{ width:3, borderRadius:2, background:active?color:"#CBD5E1", height: active?undefined:"4px",
          animation:active?`wave ${d}s ease-in-out ${i*0.08}s infinite alternate`:"none", minHeight:4, maxHeight:20 }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROLE SELECTOR
═══════════════════════════════════════════════════════════════ */
function RoleSelector({ onSelect }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0B1120", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif", padding:24, position:"relative", overflow:"hidden" }}>
      <Sty/>
      {/* Subtle radial glow */}
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:400, background:"radial-gradient(ellipse,rgba(20,71,230,0.2) 0%,transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ textAlign:"center", marginBottom:48, position:"relative" }} className="fadeUp">
        <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg,#1447E6,#3B68F9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 20px", boxShadow:"0 4px 20px rgba(20,71,230,0.5)" }}>🤖</div>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:36, fontWeight:800, margin:"0 0 8px", letterSpacing:"-1px" }}>LearnFlow</h1>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, fontWeight:400, letterSpacing:"0.01em" }}>Enterprise HR Training Platform · AI-Powered</p>
      </div>

      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
        {[
          { role:"admin",    label:"HR Admin",  sublabel:"Manage trainings, employees & reports", icon:"⚙️", badge:"Admin Panel" },
          { role:"employee", label:"Employee",  sublabel:"View & complete your assigned trainings", icon:"🎓", badge:"Employee Panel" },
        ].map(r=>(
          <div key={r.role} onClick={()=>onSelect(r.role)} className="fadeUp"
            style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"32px 40px", cursor:"pointer", textAlign:"center", minWidth:260, maxWidth:300, transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(20,71,230,0.12)"; e.currentTarget.style.borderColor="rgba(59,104,249,0.4)"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(20,71,230,0.2)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none";}}>
            <div style={{ fontSize:36, marginBottom:14 }}>{r.icon}</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:18, marginBottom:5, letterSpacing:"-0.3px" }}>{r.label}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12.5, marginBottom:18, lineHeight:1.5 }}>{r.sublabel}</div>
            <span style={{ background:"rgba(20,71,230,0.3)", color:"#93B4FF", fontSize:11, padding:"4px 12px", borderRadius:6, fontWeight:600, border:"1px solid rgba(59,104,249,0.3)" }}>{r.badge}</span>
          </div>
        ))}
      </div>
      <p style={{ color:"rgba(255,255,255,0.15)", fontSize:11, marginTop:40 }}>UI/UX Design Prototype · Dummy Data Only</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
function AdminPanel({ onExit }) {
  const [nav, setNav]         = useState("dashboard");
  const [createStep, setCS]   = useState(null);
  const [detail, setDetail]   = useState(null);
  const [assignTo, setAssign] = useState(null); // training being assigned

  const navItems = [
    { id:"dashboard",   icon:"📊", label:"Dashboard"   },
    { id:"trainings",   icon:"📚", label:"Trainings"   },
    { id:"employees",   icon:"👥", label:"Employees"   },
    { id:"leaderboard", icon:"🏆", label:"Leaderboard" },
    { id:"reports",     icon:"📈", label:"Reports"     },
    { id:"settings",    icon:"⚙️",  label:"Settings"    },
  ];

  const goTo = (n) => { setNav(n); setCS(null); setDetail(null); setAssign(null); };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Inter',sans-serif" }}>
      <Sty/>
      {/* ── Sidebar ── */}
      <aside style={{ width:240, background:"#0B1120", display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        {/* Logo */}
        <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#1447E6,#3B68F9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 2px 8px rgba(20,71,230,0.4)" }}>🤖</div>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:17, fontWeight:700, letterSpacing:"-0.4px" }}>LearnFlow</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, marginTop:0.5, fontWeight:400 }}>HR Training Platform</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em", padding:"8px 10px 6px" }}>MAIN MENU</div>
          {navItems.map(n=>{
            const active = nav===n.id && !createStep && !detail;
            return (
              <div key={n.id} onClick={()=>goTo(n.id)}
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:8, cursor:"pointer", marginBottom:2,
                  background:active?"rgba(20,71,230,0.25)":"transparent",
                  borderLeft:active?"2px solid #3B68F9":"2px solid transparent",
                  color:active?"#E0E7FF":"rgba(255,255,255,0.4)", fontWeight:active?600:400, fontSize:13.5, transition:"all 0.12s",
                  letterSpacing:"-0.01em" }}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="rgba(255,255,255,0.7)";}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.4)";}}}
              >
                <span style={{ fontSize:15, opacity:active?1:0.7 }}>{n.icon}</span>{n.label}
              </div>
            );
          })}
        </nav>
        {/* Footer */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, cursor:"pointer", marginBottom:2 }} onClick={onExit}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{ fontSize:14, opacity:0.5 }}>🚪</span>
            <span style={{ color:"rgba(255,255,255,0.28)", fontSize:12 }}>Exit Demo</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 10px", background:"rgba(255,255,255,0.04)", borderRadius:9, marginTop:4 }}>
            <Avatar initials="NA" size={32} bg="rgba(20,71,230,0.3)" color="#93B4FF" fontSize={11}/>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"rgba(255,255,255,0.85)", fontSize:12.5, fontWeight:600, letterSpacing:"-0.01em" }}>Neha Agarwal</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10.5, marginTop:1 }}>HR Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Topbar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #E4E7EC", padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 3px rgba(16,24,40,0.06)" }}>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, color:T.slate, fontWeight:700, letterSpacing:"-0.4px" }}>
            {createStep!=null ? "Create New Training" : assignTo ? `Assign Training` : detail ? detail.title : nav.charAt(0).toUpperCase()+nav.slice(1)}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:T.slateXL, borderRadius:8, padding:"7px 12px", display:"flex", alignItems:"center", gap:6, cursor:"pointer", border:"1px solid #E4E7EC" }}>
              <span style={{ fontSize:14 }}>🔔</span>
              <span style={{ background:T.red, color:"#fff", fontSize:10, fontWeight:700, borderRadius:6, padding:"1px 5px" }}>3</span>
            </div>
            <Avatar initials="NA" size={34} bg={T.indigoPale} color={T.indigoMid} fontSize={12}/>
          </div>
        </header>

        <main style={{ flex:1, padding:24, overflowY:"auto", background:T.bg }}>
          {nav==="dashboard" && !createStep && !detail && !assignTo && <AdminDashboard onNewTraining={()=>{setCS(1);setNav("trainings");}} onViewTraining={t=>{setDetail(t);setNav("trainings");}} onAssign={t=>{setAssign(t);setNav("trainings");}}/>}
          {nav==="trainings" && !createStep && !detail && !assignTo && <TrainingList onCreate={()=>setCS(1)} onView={t=>setDetail(t)} onAssign={t=>setAssign(t)}/>}
          {nav==="trainings" && createStep && <CreateTraining step={createStep} setStep={setCS} onDone={()=>{setCS(null);setNav("trainings");}} onAssign={t=>{setCS(null);setAssign(t||TRAININGS[0]);}}/>}
          {nav==="trainings" && detail && !assignTo && <TrainingDetail training={detail} onBack={()=>setDetail(null)} onAssign={t=>{setDetail(null);setAssign(t);}} />}
          {nav==="trainings" && assignTo && <AssignTraining training={assignTo} onBack={()=>setAssign(null)} onDone={()=>{setAssign(null);setNav("trainings");}}/>}
          {nav==="employees" && <EmployeeList onAssign={t=>setAssign(t)}/>}
          {nav==="leaderboard" && <OverallLeaderboard />}
          {nav==="reports"   && <Reports />}
          {nav==="settings"  && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

/* Admin Dashboard */
function AdminDashboard({ onNewTraining, onViewTraining }) {
  const stats = [
    { label:"Total Trainings",    val:"8",   icon:"📚", color:T.indigoMid, bg:T.indigoPale, delta:"+2 this month" },
    { label:"Active Employees",   val:"247", icon:"👥", color:T.blue,      bg:T.blueLight,  delta:"+5 new" },
    { label:"Completions Today",  val:"23",  icon:"✅", color:T.green,     bg:T.greenLight, delta:"↑ 18% vs yesterday" },
    { label:"Pending Compliance", val:"4",   icon:"⚖️", color:T.red,       bg:T.redLight,   delta:"Needs attention" },
    { label:"Avg Pass Score",     val:"79%", icon:"⭐", color:T.amber,     bg:T.amberLight, delta:"↑ 2% this week" },
    { label:"Ext. Requests",      val:"3",   icon:"🕐", color:"#7C3AED",   bg:"#EDE9FE",    delta:"Awaiting review" },
  ];
  return (
    <div className="fadeUp">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:14, color:T.slateL }}>Good morning! 👋</div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, color:T.slate, marginTop:2 }}>Here's what's happening</div>
        </div>
        <Btn onClick={onNewTraining}>+ Create Training</Btn>
      </div>

      {/* KPI Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {stats.map(s=>(
          <Card key={s.label} style={{ padding:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.icon}</div>
              <span style={{ fontSize:11, color:s.color, fontWeight:600, background:s.bg, padding:"3px 8px", borderRadius:6 }}>{s.delta}</span>
            </div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, color:T.slate, marginTop:12, letterSpacing:"-1px" }}>{s.val}</div>
            <div style={{ fontSize:13, color:T.slateL, marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20, marginBottom:24 }}>
        {/* Completion bars */}
        <Card style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.slate }}>Training Completion Overview</div>
            <select style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"4px 10px", fontSize:12, color:T.slateM }}>
              <option>All Trainings</option>
            </select>
          </div>
          {TRAININGS.filter(t=>t.status!=="draft").slice(0,5).map(t=>{
            const pct = Math.round(t.completed/t.assigned*100);
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:14 }}>{tt?.icon}</span>
                    <span style={{ fontSize:13, color:T.slateM, fontWeight:500, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title.split("—")[0].trim()}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:pct>=80?T.green:pct>=50?T.amber:T.red }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={pct>=80?T.green:pct>=50?T.indigoLight:T.amber}/>
              </div>
            );
          })}
        </Card>

        {/* Category donut */}
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:20 }}>By Training Type</div>
          {TRAINING_TYPES.filter(t=>TRAININGS.some(tr=>tr.type===t.id)).map(t=>{
            const count = TRAININGS.filter(tr=>tr.type===t.id).length;
            const total = TRAININGS.length;
            return (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:11 }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, color:T.slateM, fontWeight:500 }}>{t.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:T.slate }}>{count}</span>
                  </div>
                  <ProgressBar pct={count/total*100} color={t.color} height={5}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Recent + Mandatory */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20 }}>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:18 }}>Recent Activity</div>
          {[
            { emp:"Priya Sharma",  initials:"PS", action:"Completed",  training:"POSH Compliance",        time:"2 min ago",  color:T.green  },
            { emp:"Rahul Mehta",   initials:"RM", action:"Started",    training:"New Employee Onboarding", time:"14 min ago", color:T.blue   },
            { emp:"Anika Singh",   initials:"AS", action:"Passed",     training:"Data Privacy & GDPR",     time:"1 hr ago",   color:T.green  },
            { emp:"Arjun Kapoor",  initials:"AK", action:"Ext. Req.",  training:"Workplace Safety",        time:"2 hr ago",   color:T.amber  },
            { emp:"Deepak Verma",  initials:"DV", action:"Failed",     training:"Product Deep Dive",       time:"3 hr ago",   color:T.red    },
          ].map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<4?"1px solid #F1F5F9":"none" }}>
              <Avatar initials={a.initials} size={34} bg={T.indigoPale} color={T.indigoMid} fontSize={12}/>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.slate }}>{a.emp} </span>
                <span style={{ fontSize:13, color:T.slateM }}>{a.action} </span>
                <span style={{ fontSize:13, fontWeight:500, color:T.slate }}>{a.training}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, fontWeight:700, color:a.color, background:a.color+"18", padding:"2px 7px", borderRadius:5 }}>{a.action}</span>
                <span style={{ fontSize:11, color:T.slateL }}>{a.time}</span>
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:18 }}>⚠️ Mandatory Overdue</div>
          {TRAININGS.filter(t=>t.mandatory && t.notStarted>0).map(t=>(
            <div key={t.id} style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 14px", marginBottom:10, cursor:"pointer" }} onClick={()=>onViewTraining(t)}>
              <div style={{ fontWeight:600, fontSize:13, color:T.slate, marginBottom:4 }}>{t.title.substring(0,36)}...</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                <span style={{ color:T.red, fontWeight:700 }}>{t.notStarted} not started</span>
                <span style={{ color:T.slateL }}>Due: Apr 30</span>
              </div>
            </div>
          ))}
          <div style={{ background:T.amberLight, border:"1px solid #FDE68A", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:T.slate, marginBottom:4 }}>3 Extension Requests</div>
            <div style={{ fontSize:12, color:T.slateM }}>Pending admin approval</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Training List */
function TrainingList({ onCreate, onView, onAssign }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [openMenu, setOpenMenu] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const filtered = TRAININGS.filter(t=>{
    if(filter!=="all" && t.type!==filter) return false;
    if(search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fadeUp">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trainings..." style={{ paddingLeft:34, paddingRight:14, paddingTop:8, paddingBottom:8, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:220, background:"#fff", color:T.slate }}/>
          </div>
          <div style={{ display:"flex", gap:4, background:"#fff", border:"1px solid #E2E8F0", borderRadius:10, padding:3 }}>
            {["⊞","☰"].map((icon,i)=>(
              <button key={i} onClick={()=>setView(i===0?"grid":"list")} style={{ border:"none", padding:"5px 10px", borderRadius:8, background:(view==="grid"&&i===0)||(view==="list"&&i===1)?T.indigoPale:"transparent", color:(view==="grid"&&i===0)||(view==="list"&&i===1)?T.indigoMid:T.slateM, cursor:"pointer", fontSize:14 }}>{icon}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("✅ Trainings exported as CSV successfully!")}>⬇ Export</Btn>
          <Btn onClick={onCreate} size="sm">+ Create Training</Btn>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>
          {toast}
        </div>
      )}

      {/* Type filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setFilter("all")} style={{ padding:"6px 16px", borderRadius:100, border:`1.5px solid ${filter==="all"?T.indigoMid:"#E4E7EC"}`, background:filter==="all"?T.indigoPale:"#fff", color:filter==="all"?T.indigoMid:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>All ({TRAININGS.length})</button>
        {TRAINING_TYPES.filter(t=>TRAININGS.some(tr=>tr.type===t.id)).map(t=>{
          const cnt = TRAININGS.filter(tr=>tr.type===t.id).length;
          return <button key={t.id} onClick={()=>setFilter(t.id)} style={{ padding:"6px 14px", borderRadius:100, border:`1.5px solid ${filter===t.id?t.color:"#E4E7EC"}`, background:filter===t.id?t.bg:"#fff", color:filter===t.id?t.color:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>{t.icon} {t.label} ({cnt})</button>;
        })}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:view==="grid"?"repeat(auto-fill,minmax(340px,1fr))":"1fr", gap:16 }}>
        {filtered.map(t=>{
          const tt = TRAINING_TYPES.find(x=>x.id===t.type);
          const pct = Math.round(t.completed/t.assigned*100);
          return (
            <Card key={t.id} hover style={{ overflow:"hidden" }}>
              {/* Color strip */}
              <div style={{ height:5, background:tt?.color||T.indigoMid }}/>
              <div style={{ padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <TypeIcon type={t.type} size={42}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.slate, lineHeight:1.3, maxWidth:180 }}>{t.title}</div>
                      <div style={{ fontSize:11, color:T.slateL, marginTop:2 }}>{tt?.label} • {t.slides} slides</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                    <StatusBadge status={t.status}/>
                    {t.mandatory && <Badge color={T.red} bg={T.redLight} size={10}>MANDATORY</Badge>}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                  {[["👥","Assigned",t.assigned],["✅","Done",t.completed],["⭐","Avg Score",t.avgScore?t.avgScore+"%":"N/A"]].map(([ic,l,v])=>(
                    <div key={l} style={{ background:T.bg, borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:14 }}>{ic}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:T.slate }}>{v}</div>
                      <div style={{ fontSize:10, color:T.slateL }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.slateL, marginBottom:5 }}>
                    <span>Completion</span><span style={{ fontWeight:700, color:pct>=80?T.green:pct>=50?T.amber:T.red }}>{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} color={pct>=80?T.green:pct>=50?T.indigoLight:T.amber}/>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={()=>onView(t)} size="sm" style={{ flex:1 }}>View Details</Btn>
                  <Btn variant="subtle" size="sm" onClick={()=>onAssign(t)}>👥 Assign</Btn>
                  <div style={{ position:"relative" }}>
                    <Btn variant="subtle" size="sm" onClick={()=>setOpenMenu(openMenu===t.id?null:t.id)}>⋯</Btn>
                    {openMenu===t.id && (
                      <div style={{ position:"absolute", right:0, top:36, background:"#fff", border:"1px solid #E4E7EC", borderRadius:12, boxShadow:"0 8px 24px rgba(16,24,40,0.14)", zIndex:50, minWidth:170, overflow:"hidden" }}>
                        <div onClick={()=>{setOpenMenu(null);onView(t);}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:T.slate, display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>✏️ Edit Training</div>
                        <div onClick={()=>{setOpenMenu(null);showToast("📋 Training duplicated!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:T.slate, display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>📋 Duplicate</div>
                        <div onClick={()=>{setOpenMenu(null);showToast("📤 Training shared via link!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:T.slate, display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>📤 Share Link</div>
                        <div style={{ height:1, background:"#F1F5F9" }}/>
                        <div onClick={()=>{setOpenMenu(null);showToast("🗑 Training archived!");}} style={{ padding:"11px 16px", fontSize:13, cursor:"pointer", color:T.red, display:"flex", gap:8, alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#FEF2F2"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>🗑 Archive</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* Create Training Wizard */
function CreateTraining({ step, setStep, onDone, onAssign }) {
  const [form, setForm] = useState({ title:"", type:"", deadline:"", dept:[], mandatory:false });
  const [uploaded, setUploaded] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [slideNotes, setSlideNotes]       = useState({}); // {slideId: text}
  const [expandedSlide, setExpandedSlide] = useState(null); // which slide input is open
  const [certType, setCertType]           = useState(1);   // 0/1/2
  const [rewardsOn, setRewardsOn]         = useState(true);
  const [leaderboardOn, setLeaderboardOn] = useState(true);
  const [pointsPass, setPointsPass]       = useState("100");
  const [pointsFirst, setPointsFirst]     = useState("150");
  const [publishing, setPublishing]       = useState(false);
  const [published, setPublished]         = useState(false);

  const STEPS = ["Basic Details","Knowledge Base","Assessment","Settings","Publish"];

  const simulateUpload = () => {
    setUploaded(true);
    setTimeout(()=>setIndexed(true), 2000);
  };

  const generateQs = () => {
    setGenLoading(true);
    setTimeout(()=>{
      setQuestions(ASSESS_QS.slice(0,5));
      setGenLoading(false);
    }, 2200);
  };

  const doPublish = () => {
    setPublishing(true);
    setTimeout(()=>{ setPublishing(false); setPublished(true); }, 2000);
  };

  return (
    <div className="fadeUp" style={{ maxWidth:760, margin:"0 auto" }}>
      {/* Stepper */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
        {STEPS.map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:0 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, margin:"0 auto",
                background:i+1<step?"#10B981":i+1===step?T.indigoMid:"#E4E7EC",
                color:i+1<=step?"#fff":T.slateL }}>
                {i+1<step?"✓":i+1}
              </div>
              <div style={{ fontSize:11, color:i+1===step?T.indigoMid:T.slateL, fontWeight:i+1===step?700:400, marginTop:5, whiteSpace:"nowrap" }}>{s}</div>
            </div>
            {i<STEPS.length-1 && <div style={{ flex:1, height:2, background:i+1<step?"#10B981":"#E4E7EC", margin:"0 6px", marginBottom:20 }}/>}
          </div>
        ))}
      </div>

      <Card style={{ padding:32 }}>
        {/* STEP 1 */}
        {step===1 && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, marginBottom:6, fontWeight:400 }}>Training Basic Details</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>Training ki foundational information fill karo</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Training Title *</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. New Employee Onboarding — Batch May 2026"
                  style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:T.slate, background:"#fff" }}/>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Training Type *</label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                  {TRAINING_TYPES.map(t=>(
                    <div key={t.id} onClick={()=>setForm({...form,type:t.id})}
                      style={{ border:`1.5px solid ${form.type===t.id?t.color:"#E4E7EC"}`, borderRadius:10, padding:"8px 6px", cursor:"pointer", textAlign:"center", background:form.type===t.id?t.bg:"#fff", transition:"all 0.15s" }}>
                      <div style={{ fontSize:18 }}>{t.icon}</div>
                      <div style={{ fontSize:10, fontWeight:600, color:form.type===t.id?t.color:T.slateL, marginTop:3 }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Completion Deadline *</label>
                <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})}
                  style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:T.slate }}/>
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Target Departments</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {["HR","Sales","Tech","Finance","Operations","All"].map(d=>(
                    <button key={d} onClick={()=>setForm({...form,dept:form.dept.includes(d)?form.dept.filter(x=>x!==d):[...form.dept,d]})}
                      style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${form.dept.includes(d)?T.indigoMid:"#E4E7EC"}`, background:form.dept.includes(d)?T.indigoPale:"#fff", color:form.dept.includes(d)?T.indigoMid:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>{d}</button>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:10 }}>
                <div onClick={()=>setForm({...form,mandatory:!form.mandatory})} style={{ width:44, height:24, borderRadius:12, background:form.mandatory?T.indigoMid:"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:form.mandatory?23:3, transition:"all 0.2s" }}/>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:T.slateM }}>Mark as Mandatory Training</span>
                {form.mandatory && <Badge color={T.red} bg={T.redLight} size={11}>MANDATORY</Badge>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, marginBottom:6, fontWeight:400 }}>Knowledge Base</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>Upload karo — Avatar isi se training karega aur assessment questions bhi isi se banengi</p>
            {!uploaded ? (
              <div onClick={simulateUpload}
                style={{ border:"2px dashed #C7D2FE", borderRadius:12, padding:"52px 24px", textAlign:"center", cursor:"pointer", background:"#FAFAFE", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.indigoMid; e.currentTarget.style.background=T.indigoPale;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#C7D2FE"; e.currentTarget.style.background="#FAFAFE";}}>
                <div style={{ fontSize:48, marginBottom:12 }}>📎</div>
                <div style={{ fontWeight:700, color:T.slate, marginBottom:6, fontSize:16 }}>PPT / PDF yahan drop karo</div>
                <div style={{ color:T.slateL, fontSize:13, marginBottom:16 }}>ya click kar ke browse karo</div>
                <span style={{ background:T.indigoPale, color:T.indigoMid, fontSize:12, padding:"5px 14px", borderRadius:8, fontWeight:600 }}>Supported: .ppt .pptx .pdf</span>
              </div>
            ) : (
              <div>
                {/* Uploaded file */}
                <div style={{ border:"1.5px solid #BBF7D0", borderRadius:12, padding:"14px 16px", background:"#F0FDF4", display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                  <div style={{ fontSize:32 }}>📊</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:T.slate }}>Employee_Onboarding_Deck_v3.pptx</div>
                    <div style={{ fontSize:12, color:T.slateL }}>5 slides • 3.2 MB</div>
                    {!indexed ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${T.indigoMid}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/>
                        <span style={{ fontSize:11, color:T.indigoMid, fontWeight:600 }}>Processing slides & building knowledge base...</span>
                      </div>
                    ) : (
                      <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:6 }}>
                        <span style={{ color:T.green, fontSize:13 }}>✓</span>
                        <span style={{ fontSize:11, color:T.green, fontWeight:700 }}>5 slides indexed — Avatar is ready to train</span>
                      </div>
                    )}
                  </div>
                  <button style={{ border:"none", background:"none", color:T.slateL, cursor:"pointer", fontSize:18 }}>🗑</button>
                </div>

                {/* Page preview — per slide input */}
                {indexed && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:T.slate }}>Slide Preview & Additional Input</div>
                        <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>Har slide pe extra context/notes add karo — Avatar isse bhi use karega</div>
                      </div>
                      <Badge color={T.green} bg={T.greenLight} size={11}>✓ {SLIDES.length} slides indexed</Badge>
                    </div>

                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {SLIDES.map((s,i)=>{
                        const isOpen = expandedSlide === s.id;
                        const hasNote = slideNotes[s.id]?.trim().length > 0;
                        return (
                          <div key={s.id} style={{ borderRadius:14, border:`1.5px solid ${isOpen?T.indigoMid:hasNote?"#BBF7D0":"#E4E7EC"}`, overflow:"hidden", transition:"all 0.2s" }}>
                            {/* Slide header row */}
                            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:isOpen?T.indigoPale:hasNote?"#F0FDF4":"#FAFAFA", cursor:"pointer" }}
                              onClick={()=>setExpandedSlide(isOpen ? null : s.id)}>
                              {/* Mini slide thumb */}
                              <div style={{ width:52, height:36, borderRadius:8, background:s.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.icon}</div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>Slide {i+1}: {s.title}</div>
                                {hasNote
                                  ? <div style={{ fontSize:11, color:T.green, fontWeight:600, marginTop:1 }}>✓ Note added</div>
                                  : <div style={{ fontSize:11, color:T.slateL, marginTop:1 }}>No additional input</div>
                                }
                              </div>
                              {/* expand / collapse chevron */}
                              <div style={{ color:isOpen?T.indigoMid:T.slateL, fontSize:18, fontWeight:700, transform:isOpen?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</div>
                            </div>

                            {/* Expanded input area */}
                            {isOpen && (
                              <div style={{ padding:"12px 14px", background:"#fff", borderTop:"1px solid #E8EDFF", animation:"fadeIn 0.2s ease" }}>
                                <div style={{ fontSize:12, color:T.slateM, marginBottom:8, fontWeight:600 }}>
                                  💡 Slide {i+1} ke liye extra knowledge add karo
                                </div>
                                <textarea
                                  value={slideNotes[s.id] || ""}
                                  onChange={e => setSlideNotes(n=>({...n,[s.id]:e.target.value}))}
                                  placeholder={`e.g. "${s.title}" ke baare mein koi important detail jo slide mein nahi hai — Avatar is context ko use karega jab employee is slide ke baare mein koi question pooche.`}
                                  rows={3}
                                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #C7D2FE", fontSize:13, color:T.slate, resize:"vertical", fontFamily:"'Inter',sans-serif" }}
                                />
                                <div style={{ display:"flex", gap:8, marginTop:8, justifyContent:"flex-end" }}>
                                  {hasNote && (
                                    <button onClick={()=>setSlideNotes(n=>({...n,[s.id]:""}))} style={{ border:"1px solid #FECACA", background:"#FEF2F2", color:T.red, padding:"5px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>🗑 Clear</button>
                                  )}
                                  <button onClick={()=>setExpandedSlide(null)} style={{ border:"1px solid #1447E6", background:T.indigoPale, color:T.indigoMid, padding:"5px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700 }}>
                                    {hasNote ? "✓ Save & Close" : "Close"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    <div style={{ marginTop:14, background:T.indigoPale, borderRadius:10, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <span style={{ fontSize:13, color:T.indigoMid, fontWeight:600 }}>
                        {Object.values(slideNotes).filter(v=>v?.trim()).length} of {SLIDES.length} slides mein additional notes hain
                      </span>
                      <span style={{ fontSize:12, color:T.slateL }}>Avatar in notes ko training mein use karega</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, marginBottom:6, fontWeight:400 }}>Assessment Questions</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:20 }}>Training ke end mein employee se pooche jaane wale questions</p>
            {/* AI Generate button */}
            <div style={{ background:"linear-gradient(135deg,#1447E6,#3B68F9)", borderRadius:12, padding:20, marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:3 }}>✨ AI se Questions Generate Karo</div>
                <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12 }}>Uploaded PPT/PDF se automatically questions banengi</div>
              </div>
              {genLoading ? (
                <div style={{ display:"flex", alignItems:"center", gap:8, color:"#fff", fontSize:13 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", animation:"spin 0.8s linear infinite" }}/>
                  Generating...
                </div>
              ) : (
                <button onClick={generateQs} style={{ background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.35)", color:"#fff", padding:"9px 20px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:13, backdropFilter:"blur(8px)" }}>🪄 Generate 5 Questions</button>
              )}
            </div>

            {/* Settings row */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              {[["Pass Score","70%"],["Time Limit","20 min"],["Retakes","1 allowed"]].map(([l,v])=>(
                <div key={l} style={{ background:T.slateXL, borderRadius:10, padding:"8px 14px", display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:12, color:T.slateL }}>{l}:</span>
                  <span style={{ fontSize:13, fontWeight:700, color:T.slate }}>{v}</span>
                  <span style={{ color:T.indigoMid, fontSize:11, cursor:"pointer" }}>edit</span>
                </div>
              ))}
            </div>

            {/* Question list */}
            {questions.length===0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:T.slateL }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📝</div>
                <div style={{ fontSize:14 }}>Koi question nahi hai. Generate karo ya manually add karo.</div>
              </div>
            ) : (
              <div>
                {questions.map((q,i)=>(
                  <div key={i} style={{ background:T.bg, borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ background:T.indigoPale, color:T.indigoMid, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>Q{i+1}</span>
                        <span style={{ background:"#EDE9FE", color:"#7C3AED", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>MCQ</span>
                        <span style={{ background:"#DCFCE7", color:"#059669", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5 }}>✨ AI Generated</span>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button style={{ border:"none", background:T.slateXL, padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:12, color:T.slateM }}>✏ Edit</button>
                        <button onClick={()=>setQuestions(questions.filter((_,j)=>j!==i))} style={{ border:"none", background:"#FEE2E2", padding:"4px 10px", borderRadius:7, cursor:"pointer", fontSize:12, color:T.red }}>🗑</button>
                      </div>
                    </div>
                    <div style={{ fontWeight:600, fontSize:14, color:T.slate, marginBottom:10 }}>{q.q}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {q.opts.map((o,j)=>(
                        <div key={j} style={{ fontSize:12, padding:"7px 10px", borderRadius:8, background:j===q.ans?"#DCFCE7":"#fff", color:j===q.ans?T.green:T.slateM, border:`1px solid ${j===q.ans?"#BBF7D0":"#E4E7EC"}`, fontWeight:j===q.ans?700:400 }}>
                          {j===q.ans?"✓ ":""}{o}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>setQuestions([...questions,{q:"New question here?",opts:["Option A","Option B","Option C","Option D"],ans:0}])}
                  style={{ width:"100%", padding:"10px", borderRadius:10, border:`2px dashed ${T.indigoLight}`, background:T.indigoPale, color:T.indigoMid, cursor:"pointer", fontSize:13, fontWeight:600 }}>+ Add Manual Question</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step===4 && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, marginBottom:6, fontWeight:400 }}>Training Settings</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>Completion criteria, certificates aur notifications configure karo</p>
            {[
              { title:"✅ Completion Criteria", desc:"Training complete kab mani jaayegi?",
                content: <div style={{ marginTop:12 }}>
                  {["All Slides Viewed + Assessment Passed (Recommended)","All Slides Viewed Only","Assessment Passed Only"].map((opt,i)=>(
                    <div key={opt} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${i===0?T.indigoMid:"#E4E7EC"}`, background:i===0?T.indigoPale:"#fff", marginBottom:8, cursor:"pointer" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${i===0?T.indigoMid:"#CBD5E1"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {i===0 && <div style={{ width:8, height:8, borderRadius:"50%", background:T.indigoMid }}/>}
                      </div>
                      <span style={{ fontSize:13, color:i===0?T.indigoMid:T.slateM, fontWeight:i===0?700:400 }}>{opt}</span>
                      {i===0 && <Badge color={T.green} bg={T.greenLight} size={10}>Best Practice</Badge>}
                    </div>
                  ))}
                </div>
              },
              { title:"🏆 Certificate & Rewards", desc:"Certificate, badges aur points — employee ko kya milega?",
                content: (
                  <div style={{ marginTop:14 }}>
                    {/* Certificate type */}
                    <div style={{ fontWeight:600, fontSize:13, color:T.slate, marginBottom:10 }}>Certificate Type</div>
                    <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                      {[["📜","Completion Certificate","Slides complete karo"],["🏅","Achievement Certificate","Pass karna zaroori (Recommended)"],["—","No Certificate","Certificate nahi milegi"]].map(([icon,label,sub],i)=>(
                        <div key={label} onClick={()=>setCertType(i)}
                          style={{ flex:1, padding:"12px 10px", borderRadius:12, border:`1.5px solid ${certType===i?T.indigoMid:"#E4E7EC"}`, background:certType===i?T.indigoPale:"#fff", textAlign:"center", cursor:"pointer", transition:"all 0.15s" }}>
                          <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:certType===i?T.indigoMid:T.slate }}>{label}</div>
                          <div style={{ fontSize:10, color:T.slateL, marginTop:3 }}>{sub}</div>
                          {i===1 && <div style={{ marginTop:6 }}><Badge color={T.green} bg={T.greenLight} size={9}>Best Practice</Badge></div>}
                        </div>
                      ))}
                    </div>

                    {/* Rewards toggle */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:rewardsOn?`linear-gradient(135deg,#FFF7ED,#FFFBEB)`:"#F4F6FA", borderRadius:12, border:`1.5px solid ${rewardsOn?"#FDE68A":"#E4E7EC"}`, marginBottom: rewardsOn ? 14 : 0 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:22 }}>🎖️</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:T.slate }}>Rewards & Badges (Employee Side)</div>
                          <div style={{ fontSize:11, color:T.slateL, marginTop:1 }}>Training complete karne pe employee ko points aur badges milenge</div>
                        </div>
                      </div>
                      <div onClick={()=>setRewardsOn(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:rewardsOn?"#F59E0B":"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:rewardsOn?23:3, transition:"all 0.2s" }}/>
                      </div>
                    </div>

                    {/* Rewards config */}
                    {rewardsOn && (
                      <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:"14px 16px", marginBottom:14, animation:"fadeIn 0.25s ease" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:6 }}>⭐ Points on Pass</div>
                            <div style={{ display:"flex", gap:6 }}>
                              {["50","100","150","200"].map(p=>(
                                <button key={p} onClick={()=>setPointsPass(p)}
                                  style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${pointsPass===p?"#F59E0B":"#FDE68A"}`, background:pointsPass===p?"#F59E0B":"#fff", color:pointsPass===p?"#fff":"#92400E", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:6 }}>🥇 Bonus — First Completer</div>
                            <div style={{ display:"flex", gap:6 }}>
                              {["50","100","150","200"].map(p=>(
                                <button key={p} onClick={()=>setPointsFirst(p)}
                                  style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${pointsFirst===p?"#F59E0B":"#FDE68A"}`, background:pointsFirst===p?"#F59E0B":"#fff", color:pointsFirst===p?"#fff":"#92400E", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontWeight:700, fontSize:12, color:"#92400E", marginBottom:8 }}>🎖️ Badges Jo Milenge</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          {[
                            {icon:"🚀",label:"Fast Learner",desc:"Top 10% time mein"},
                            {icon:"💯",label:"Perfect Score",desc:"100% assessment"},
                            {icon:"🔥",label:"On Streak",desc:"Consecutive trainings"},
                            {icon:"⭐",label:"Star Employee",desc:"5+ trainings done"},
                          ].map(b=>(
                            <div key={b.label} style={{ background:"#fff", border:"1px solid #FDE68A", borderRadius:10, padding:"8px 12px", textAlign:"center", minWidth:90 }}>
                              <div style={{ fontSize:20 }}>{b.icon}</div>
                              <div style={{ fontSize:11, fontWeight:700, color:"#92400E", marginTop:3 }}>{b.label}</div>
                              <div style={{ fontSize:9, color:"#B45309", marginTop:1 }}>{b.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Leaderboard toggle */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:leaderboardOn?`linear-gradient(135deg,#EEF2FF,#F5F3FF)`:"#F4F6FA", borderRadius:12, border:`1.5px solid ${leaderboardOn?"#C7D2FE":"#E4E7EC"}`, marginBottom: leaderboardOn ? 14 : 0 }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <span style={{ fontSize:22 }}>📊</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:T.slate }}>Leaderboard (Admin View)</div>
                          <div style={{ fontSize:11, color:T.slateL, marginTop:1 }}>Is training ka leaderboard admin dashboard mein dikhega</div>
                        </div>
                      </div>
                      <div onClick={()=>setLeaderboardOn(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:leaderboardOn?T.indigoMid:"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                        <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:leaderboardOn?23:3, transition:"all 0.2s" }}/>
                      </div>
                    </div>
                    {leaderboardOn && (
                      <div style={{ background:T.indigoPale, border:"1px solid #C7D2FE", borderRadius:12, padding:"12px 16px", animation:"fadeIn 0.25s ease" }}>
                        <div style={{ fontSize:12, color:T.indigoMid, fontWeight:700, marginBottom:8 }}>Leaderboard mein dikhega:</div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                          {["Rank by Score %","Rank by Completion Time","Rank by Points Earned","Department-wise Ranking"].map(item=>(
                            <div key={item} style={{ display:"flex", gap:6, alignItems:"center", fontSize:12, color:T.indigoMid }}>
                              <span style={{ color:T.green }}>✓</span>{item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              },
              { title:"🔔 Notifications", desc:"Kab aur kisko notifications jaayengi?",
                content: <div style={{ marginTop:12 }}>
                  {[["Assignment Notification","Employee ko jab training assign ho","ON"],["Reminder — 3 days before deadline","Employee ko deadline reminder","ON"],["Deadline Missed","Manager ko alert","ON"],["Completion Confirmation","Employee ko completion email","ON"]].map(([l,d,v])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F1F5F9" }}>
                      <div><div style={{ fontSize:13, fontWeight:600, color:T.slate }}>{l}</div><div style={{ fontSize:11, color:T.slateL }}>{d}</div></div>
                      <div style={{ width:40, height:22, borderRadius:11, background:v==="ON"?T.indigoMid:"#CBD5E1", cursor:"pointer", position:"relative" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:v==="ON"?21:3 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              },
            ].map(sec=>(
              <Card key={sec.title} style={{ padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:14, color:T.slate }}>{sec.title}</div>
                <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>{sec.desc}</div>
                {sec.content}
              </Card>
            ))}
          </div>
        )}

        {/* STEP 5 */}
        {step===5 && !published && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>🚀</div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, color:T.slate, marginBottom:8, fontWeight:400 }}>Ready to Publish!</h3>
            <p style={{ color:T.slateL, fontSize:14, marginBottom:24 }}>Sabhi details review karo aur publish karo</p>
            <Card style={{ textAlign:"left", padding:20, marginBottom:24 }}>
              {[["📚 Title","New Employee Onboarding — Batch April 2026"],["🏢 Type","Onboarding"],["📅 Deadline","April 30, 2026"],["📄 Slides","5 slides uploaded & indexed"],["📝 Assessment","5 questions • Pass: 70% • 1 retake"],["🏆 Certificate","Achievement Certificate on pass"],["⚠️ Mandatory","YES"]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", gap:16, padding:"9px 0", borderBottom:"1px solid #F1F5F9", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:T.slateL, minWidth:140, fontWeight:500 }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:T.slate }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={doPublish} full size="lg" style={{ borderRadius:14 }}>
              {publishing ? "Publishing..." : "🚀 Publish Training"}
            </Btn>
          </div>
        )}
        {step===5 && published && (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:64, marginBottom:16, animation:"fadeIn 0.5s ease" }}>🎉</div>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:T.green, fontSize:28, fontWeight:400, marginBottom:8 }}>Training Published!</h2>
            <p style={{ color:T.slateL, marginBottom:28 }}>New Employee Onboarding successfully publish ho gayi. Ab employees ko assign karo.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Btn onClick={onDone} size="lg">View All Trainings</Btn>
              <Btn variant="ghost" size="lg" onClick={()=>onAssign && onAssign(TRAININGS[0])}>👥 Assign Employees →</Btn>
            </div>
          </div>
        )}

        {/* Nav */}
        {!(step===5 && published) && (
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:"1px solid #F1F5F9" }}>
            <Btn variant="white" onClick={()=>step===1?onDone():setStep(s=>s-1)}>{step===1?"Cancel":"← Back"}</Btn>
            {step<5 && <Btn onClick={()=>setStep(s=>s+1)} disabled={step===1&&!form.title&&!form.type}>{step===4?"Review & Publish →":"Next Step →"}</Btn>}
          </div>
        )}
      </Card>
    </div>
  );
}

/* Training Detail */
function TrainingDetail({ training, onBack, onAssign }) {
  const [tab, setTab]         = useState("overview");
  const [reportEmp, setReportEmp] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title:training.title, deadline:training.deadline||"", mandatory:training.mandatory });
  const [detailToast, setDetailToast] = useState(null);
  const [reminderSent, setReminderSent] = useState({});

  const showDetailToast = (msg) => { setDetailToast(msg); setTimeout(()=>setDetailToast(null),3000); };

  const tt = TRAINING_TYPES.find(x=>x.id===training.type);
  const pct = Math.round(training.completed/training.assigned*100);
  const emps = [
    { ...EMPLOYEES[0], tStatus:"completed",  tProgress:100, score:84, lastActivity:"2 days ago",  timeTaken:"1h 42m", slidesViewed:5, questionsAsked:3, attempts:1, completedOn:"Mar 5, 2026" },
    { ...EMPLOYEES[1], tStatus:"in-progress",tProgress:60,  score:null,lastActivity:"1 hour ago", timeTaken:"52m",    slidesViewed:3, questionsAsked:1, attempts:0, completedOn:null },
    { ...EMPLOYEES[2], tStatus:"completed",  tProgress:100, score:91, lastActivity:"3 days ago",  timeTaken:"2h 05m", slidesViewed:5, questionsAsked:6, attempts:1, completedOn:"Mar 4, 2026" },
    { ...EMPLOYEES[3], tStatus:"not-started",tProgress:0,   score:null,lastActivity:"Never",       timeTaken:"—",      slidesViewed:0, questionsAsked:0, attempts:0, completedOn:null },
    { ...EMPLOYEES[4], tStatus:"completed",  tProgress:100, score:88, lastActivity:"1 week ago",  timeTaken:"1h 58m", slidesViewed:5, questionsAsked:2, attempts:1, completedOn:"Feb 28, 2026" },
    { ...EMPLOYEES[5], tStatus:"not-started",tProgress:0,   score:null,lastActivity:"Never",       timeTaken:"—",      slidesViewed:0, questionsAsked:0, attempts:0, completedOn:null },
  ];

  // Show report modal if open
  if(reportEmp) return <CandidateReport emp={reportEmp} training={training} onClose={()=>setReportEmp(null)}/>;

  return (
    <div className="fadeUp">
      {/* Toast */}
      {detailToast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{detailToast}</div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div onClick={()=>setEditMode(false)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:32, maxWidth:520, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, color:T.slate, fontWeight:700, marginBottom:4 }}>✏️ Edit Training</div>
            <div style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>Training details update karo</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Training Title</label>
              <input value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:T.slate, boxSizing:"border-box" }}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Completion Deadline</label>
              <input type="date" value={editForm.deadline} onChange={e=>setEditForm({...editForm,deadline:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, color:T.slate }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div onClick={()=>setEditForm({...editForm,mandatory:!editForm.mandatory})} style={{ width:44, height:24, borderRadius:12, background:editForm.mandatory?T.indigoMid:"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:editForm.mandatory?23:3, transition:"all 0.2s" }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:T.slateM }}>Mandatory Training</span>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="white" onClick={()=>setEditMode(false)}>Cancel</Btn>
              <Btn onClick={()=>{ setEditMode(false); showDetailToast("✅ Training updated successfully!"); }}>Save Changes</Btn>
            </div>
          </div>
        </div>
      )}

      <button onClick={onBack} style={{ background:"none", border:"none", color:T.indigoMid, fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back to Trainings</button>

      {/* Header Card */}
      <Card style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <TypeIcon type={training.type} size={56}/>
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:T.slate, fontWeight:700, margin:"0 0 6px" }}>{training.title}</h2>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <Badge color={tt?.color||T.indigoMid} bg={tt?.bg||T.indigoPale}>{tt?.icon} {tt?.label}</Badge>
                <StatusBadge status={training.status}/>
                {training.mandatory && <Badge color={T.red} bg={T.redLight}>MANDATORY</Badge>}
                <Badge color={T.slateM} bg={T.slateXL}>📄 {training.slides} slides</Badge>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="white" size="sm" onClick={()=>setEditMode(true)}>✏ Edit</Btn>
            <Btn size="sm" onClick={()=>onAssign(training)}>👥 Assign Employees</Btn>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginTop:20 }}>
          {[["Total Assigned",training.assigned,"👥",T.blue],["Completed",training.completed,"✅",T.green],["In Progress",training.inProgress,"▶",T.indigoMid],["Not Started",training.notStarted,"○",T.slateM],["Avg Score",(training.avgScore||0)+"%","⭐",T.amber]].map(([l,v,ic,c])=>(
            <div key={l} style={{ background:T.bg, borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:c, letterSpacing:"-0.5px" }}>{v}</div>
              <div style={{ fontSize:11, color:T.slateL, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.slateL, marginBottom:5 }}>
            <span>Overall Completion</span><span style={{ fontWeight:700, color:pct>=80?T.green:T.amber }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} height={8} color={pct>=80?T.green:T.indigoLight}/>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, padding:4, width:"fit-content" }}>
        {["overview","employees","reports"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px", borderRadius:9, border:"none", background:tab===t?T.indigoPale:"transparent", color:tab===t?T.indigoMid:T.slateM, fontWeight:tab===t?700:400, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>
            {t==="employees"?"👥 Employees":t==="reports"?"📈 Reports":"📊 Overview"}
          </button>
        ))}
      </div>

      {tab==="employees" && (
        <Card>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontWeight:700, color:T.slate }}>Assigned Employees ({emps.length})</div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn variant="subtle" size="sm" onClick={()=>showDetailToast("✅ Employee data exported as CSV!")}>⬇ Export</Btn>
              <Btn variant="subtle" size="sm" onClick={()=>showDetailToast("🔔 Reminders sent to all pending employees!")}>🔔 Send Reminders</Btn>
            </div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
                {["Employee","Status","Progress","Score","Last Activity","Actions"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:T.slateL, fontWeight:700, letterSpacing:"0.06em" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emps.map((e,i)=>{
                const dC = deptColors[e.dept]||deptColors.default;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar initials={e.initials} size={34} bg={T.indigoPale} color={T.indigoMid} fontSize={12}/>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{e.name}</div>
                          <Badge color={dC} bg={dC+"18"} size={10}>{e.dept}</Badge>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px" }}><StatusBadge status={e.tStatus}/></td>
                    <td style={{ padding:"12px 16px", minWidth:120 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1 }}><ProgressBar pct={e.tProgress} height={6}/></div>
                        <span style={{ fontSize:12, color:T.slateM, fontWeight:600, minWidth:30 }}>{e.tProgress}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 16px", fontWeight:700, color:e.score?(e.score>=70?T.green:T.red):T.slateL, fontSize:14 }}>
                      {e.score?`${e.score}%`:"—"}
                    </td>
                    <td style={{ padding:"12px 16px", fontSize:12, color:T.slateL }}>{e.lastActivity}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", gap:6 }}>
                        {e.tStatus==="completed" && e.tProgress===100 ? (
                          <button onClick={()=>setReportEmp(e)}
                            style={{ border:"none", background:"linear-gradient(135deg,#1447E6,#3B68F9)", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:11, color:"#fff", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                            📊 View Report
                          </button>
                        ) : (
                          <>
                            {e.tStatus!=="completed" && <button onClick={()=>showDetailToast(`🔔 Reminder sent to ${e.name}!`)} style={{ border:"none", background:T.amberLight, padding:"4px 8px", borderRadius:6, cursor:"pointer", fontSize:11, color:T.amber, fontWeight:600 }}>🔔 Remind</button>}
                            <button onClick={()=>showDetailToast(`👤 Opening ${e.name}'s profile...`)} style={{ border:"none", background:T.slateXL, padding:"4px 8px", borderRadius:6, cursor:"pointer", fontSize:11, color:T.slateM }}>View</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[["Completion Rate",pct+"%"],["Avg Score",(training.avgScore||0)+"%"],["Overdue",training.notStarted+" employees"],["Deadline","Apr 30, 2026"]].map(([l,v])=>(
            <Card key={l} style={{ padding:20 }}>
              <div style={{ fontSize:13, color:T.slateL, marginBottom:8 }}>{l}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, color:T.slate }}>{v}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CANDIDATE REPORT
═══════════════════════════════════════════════════════════════ */
function CandidateReport({ emp, training, onClose }) {
  const [tab, setTab] = useState("overview");
  const [reportToast, setReportToast] = useState(null);
  const showToast = (msg) => { setReportToast(msg); setTimeout(()=>setReportToast(null),3000); };
  const tt  = TRAINING_TYPES.find(x=>x.id===training.type);
  const passed = emp.score >= 70;
  const dC  = deptColors[emp.dept] || deptColors.default;

  // Mock per-slide data
  const slideData = SLIDES.map((s,i)=>({
    ...s,
    timeSpent: ["4m 12s","3m 48s","5m 02s","2m 55s","6m 18s"][i],
    timeSpentSec: [252,228,302,175,378][i],
    questionsAsked: [1,0,2,0,0][i],
    viewed: true,
    minTime: 30,
  }));

  // Mock Q&A log
  const qaLog = [
    { slide:"Company Culture & Values",   time:"04:32", question:"Company mein casual leaves kab milti hain?", answer:"HR policy ke according 5 casual leaves milti hain alag se." },
    { slide:"IT Setup & Tools",           time:"12:14", question:"Laptop setup mein problem ho to kise contact karo?", answer:"IT helpdesk pe call karo: ext 1100, ya email it@company.com" },
    { slide:"IT Setup & Tools",           time:"14:02", question:"VPN kaise setup karein?", answer:"VPN setup guide aapke onboarding email mein hai. IT se bhi help le sakte hain." },
  ];

  // Mock assessment answers
  const assessAnswers = [
    { q:ASSESS_QS[0].q, selected:1, correct:1, isRight:true  },
    { q:ASSESS_QS[1].q, selected:2, correct:2, isRight:true  },
    { q:ASSESS_QS[2].q, selected:0, correct:1, isRight:false },
    { q:ASSESS_QS[3].q, selected:2, correct:2, isRight:true  },
    { q:ASSESS_QS[4].q, selected:2, correct:2, isRight:true  },
  ];
  const correct = assessAnswers.filter(a=>a.isRight).length;
  const scorePct = emp.score;

  return (
    <div className="fadeUp">
      {/* ── Back ── */}
      <button onClick={onClose}
        style={{ background:"none", border:"none", color:T.indigoMid, fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>
        ← Back to Training Detail
      </button>

      {/* ── Hero Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0D1B45 0%,#1447E6 60%,#3B68F9 100%)", borderRadius:14, padding:"28px 32px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:32, top:"50%", transform:"translateY(-50%)", fontSize:110, opacity:0.07 }}>📊</div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          {/* Left: Employee info */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:22, color:"#fff" }}>
              {emp.initials}
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, letterSpacing:"0.1em", marginBottom:3 }}>CANDIDATE REPORT</div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:22, marginBottom:5 }}>{emp.name}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", fontSize:11, padding:"3px 10px", borderRadius:100, fontWeight:600 }}>{emp.dept}</span>
                <span style={{ background:"rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.65)", fontSize:11, padding:"3px 10px", borderRadius:100 }}>{emp.role}</span>
                <span style={{ background:"rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.65)", fontSize:11, padding:"3px 10px", borderRadius:100 }}>Completed: {emp.completedOn}</span>
              </div>
            </div>
          </div>

          {/* Right: Score ring */}
          <div style={{ textAlign:"center", background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"18px 28px", backdropFilter:"blur(8px)" }}>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>FINAL SCORE</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:52, color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>{scorePct}%</div>
            <div style={{ marginTop:8 }}>
              <span style={{ background:passed?"rgba(16,185,129,0.25)":"rgba(220,38,38,0.25)", color:passed?"#6EE7B7":"#FCA5A5", fontSize:12, fontWeight:800, padding:"4px 14px", borderRadius:100, border:`1px solid ${passed?"rgba(52,211,153,0.4)":"rgba(252,165,165,0.4)"}` }}>
                {passed ? "✅ PASSED" : "❌ FAILED"}
              </span>
            </div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:6 }}>Pass score: 70%</div>
          </div>
        </div>

        {/* Training name */}
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:10 }}>
          <TypeIcon type={training.type} size={32}/>
          <div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>Training</div>
            <div style={{ color:"rgba(255,255,255,0.85)", fontSize:14, fontWeight:600 }}>{training.title}</div>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:24 }}>
        {[
          { icon:"⏱", label:"Time Spent",      val:emp.timeTaken,          sub:"Total training duration",  color:T.blue,      bg:T.blueLight  },
          { icon:"📄", label:"Slides Viewed",   val:`${emp.slidesViewed}/${training.slides}`, sub:"All slides completed", color:T.green,     bg:T.greenLight },
          { icon:"❓", label:"Questions Asked",  val:emp.questionsAsked,     sub:"To the AI Avatar",         color:"#7C3AED",   bg:"#EDE9FE"    },
          { icon:"🔄", label:"Attempts",         val:emp.attempts,           sub:"Assessment attempts",       color:T.amber,     bg:T.amberLight },
          { icon:"🏆", label:"Certificate",      val:"Issued",               sub:emp.completedOn,            color:T.green,     bg:T.greenLight },
        ].map(k=>(
          <Card key={k.label} style={{ padding:"16px 14px", textAlign:"center" }}>
            <div style={{ width:40, height:40, borderRadius:12, background:k.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, margin:"0 auto 10px" }}>{k.icon}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:k.color, letterSpacing:"-0.5px" }}>{k.val}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.slate, marginTop:3 }}>{k.label}</div>
            <div style={{ fontSize:10, color:T.slateL, marginTop:2 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#fff", border:"1px solid #E2E8F0", borderRadius:12, padding:4, width:"fit-content" }}>
        {[["overview","📊 Overview"],["slides","📄 Slide Activity"],["assessment","📝 Assessment"],["qa","❓ Q&A Log"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"7px 18px", borderRadius:9, border:"none", background:tab===id?T.indigoPale:"transparent", color:tab===id?T.indigoMid:T.slateM, fontWeight:tab===id?700:400, fontSize:13, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB: OVERVIEW ══ */}
      {tab==="overview" && (
        <div className="fadeIn" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
          {/* Timeline */}
          <Card style={{ padding:24 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:20 }}>Training Timeline</div>
            {[
              { icon:"🚀", label:"Training Assigned",   date:"Mar 1, 2026",  time:"9:00 AM",  color:T.indigoMid, done:true  },
              { icon:"▶",  label:"Training Started",    date:"Mar 4, 2026",  time:"10:22 AM", color:T.blue,      done:true  },
              { icon:"📄", label:"All Slides Completed",date:"Mar 4, 2026",  time:"12:04 PM", color:T.blue,      done:true  },
              { icon:"📝", label:"Assessment Taken",    date:"Mar 5, 2026",  time:"9:45 AM",  color:T.amber,     done:true  },
              { icon:"✅", label:"Training Completed",  date:"Mar 5, 2026",  time:"9:58 AM",  color:T.green,     done:true  },
              { icon:"🏆", label:"Certificate Issued",  date:"Mar 5, 2026",  time:"10:00 AM", color:"#D97706",   done:true  },
            ].map((ev,i,arr)=>(
              <div key={ev.label} style={{ display:"flex", gap:14, position:"relative" }}>
                {/* Line */}
                {i < arr.length-1 && <div style={{ position:"absolute", left:19, top:36, width:2, height:"calc(100% - 4px)", background:"#F2F4F7" }}/>}
                {/* Dot */}
                <div style={{ width:38, height:38, borderRadius:"50%", background:ev.done?ev.color+"18":"#F2F4F7", border:`2px solid ${ev.done?ev.color:"#E4E7EC"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1, fontSize:15 }}>{ev.icon}</div>
                <div style={{ paddingBottom:20, flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{ev.label}</div>
                  <div style={{ fontSize:11, color:T.slateL, marginTop:2 }}>{ev.date} at {ev.time}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Score breakdown + engagement */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Card style={{ padding:22 }}>
              <div style={{ fontWeight:700, fontSize:14, color:T.slate, marginBottom:16 }}>📊 Score Breakdown</div>
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:16 }}>
                {/* Score arc visual */}
                <div style={{ position:"relative", width:90, height:90, flexShrink:0 }}>
                  <svg viewBox="0 0 90 90" style={{ width:90, height:90, transform:"rotate(-90deg)" }}>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="#F2F4F7" strokeWidth="10"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke={passed?T.green:T.red} strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*36*scorePct/100} ${2*Math.PI*36}`} strokeLinecap="round"/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, color:T.slate, lineHeight:1 }}>{scorePct}%</div>
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.slateM, marginBottom:5 }}>
                    <span>Correct</span><span style={{ fontWeight:700, color:T.green }}>{correct}/{ASSESS_QS.length}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.slateM, marginBottom:5 }}>
                    <span>Wrong</span><span style={{ fontWeight:700, color:T.red }}>{ASSESS_QS.length-correct}/{ASSESS_QS.length}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.slateM }}>
                    <span>Pass threshold</span><span style={{ fontWeight:700 }}>70%</span>
                  </div>
                </div>
              </div>
              <ProgressBar pct={scorePct} color={passed?T.green:T.red} height={8}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.slateL, marginTop:5 }}>
                <span>0%</span><span style={{ color:T.amber }}>70% pass</span><span>100%</span>
              </div>
            </Card>

            <Card style={{ padding:22 }}>
              <div style={{ fontWeight:700, fontSize:14, color:T.slate, marginBottom:14 }}>🎯 Engagement Score</div>
              {[
                ["Slides Completed", 100, T.green],
                ["Avg Time per Slide", 74, T.blue],
                ["Questions Asked", 60, "#7C3AED"],
                ["Assessment Score", scorePct, passed?T.green:T.red],
              ].map(([label,pct_,color])=>(
                <div key={label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.slateM, marginBottom:4 }}>
                    <span>{label}</span><span style={{ fontWeight:700, color }}>{pct_}%</span>
                  </div>
                  <ProgressBar pct={pct_} color={color} height={6}/>
                </div>
              ))}
            </Card>

            {/* AI Feedback */}
            <Card style={{ padding:20, background:`linear-gradient(135deg,#EEF2FF,#F5F3FF)`, border:"1.5px solid #C7D2FE" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:18 }}>✨</span>
                <div style={{ fontWeight:700, fontSize:13, color:T.indigoMid }}>AI Performance Feedback</div>
              </div>
              <div style={{ fontSize:13, color:"#3730A3", lineHeight:1.7 }}>
                {emp.name.split(" ")[0]} ne training bahut achhe se complete ki. Slides pe average {Math.round(emp.timeTaken?.split("h")[0]*60 + parseInt(emp.timeTaken?.split("m")[0]?.split(" ").pop()))/SLIDES.length|0} min spend ki. {emp.questionsAsked} questions avatar se pooche — yeh engagement ka achha sign hai.
                {!passed && " Assessment mein IT setup section mein improvement ki zaroorat hai."}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ══ TAB: SLIDE ACTIVITY ══ */}
      {tab==="slides" && (
        <div className="fadeIn">
          <Card style={{ padding:24, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:18 }}>Slide-by-Slide Activity</div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {slideData.map((s,i)=>{
                const pctTime = Math.min(100, Math.round(s.timeSpentSec / 400 * 100));
                const isFast = s.timeSpentSec < s.minTime;
                return (
                  <div key={s.id} style={{ display:"grid", gridTemplateColumns:"36px 1fr 120px 100px 80px", gap:16, alignItems:"center", padding:"14px 0", borderBottom:i<slideData.length-1?"1px solid #F8FAFC":"none" }}>
                    {/* Slide number */}
                    <div style={{ width:36, height:36, borderRadius:10, background:s.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>

                    {/* Title */}
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{s.title}</div>
                      <div style={{ fontSize:11, color:T.slateL, marginTop:2 }}>Slide {i+1} of {SLIDES.length}</div>
                    </div>

                    {/* Time bar */}
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.slateL, marginBottom:4 }}>
                        <span>Time</span>
                        <span style={{ fontWeight:700, color:isFast?T.red:T.slateM }}>{s.timeSpent}</span>
                      </div>
                      <ProgressBar pct={pctTime} color={isFast?T.red:T.indigoLight} height={5}/>
                      {isFast && <div style={{ fontSize:10, color:T.red, marginTop:2 }}>⚡ Too fast</div>}
                    </div>

                    {/* Questions */}
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:18, marginBottom:2 }}>{s.questionsAsked > 0 ? "❓" : "—"}</div>
                      <div style={{ fontSize:11, color:T.slateL }}>{s.questionsAsked} question{s.questionsAsked!==1?"s":""}</div>
                    </div>

                    {/* Status */}
                    <div>
                      <Badge color={T.green} bg={T.greenLight} size={10}>✓ Viewed</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Total row */}
          <Card style={{ padding:"14px 24px", background:T.indigoPale, border:`1px solid #C7D2FE` }}>
            <div style={{ display:"flex", justifyContent:"space-around", textAlign:"center" }}>
              {[["Total Time",emp.timeTaken],["Slides Viewed",`${emp.slidesViewed}/${training.slides}`],["Total Questions",emp.questionsAsked],["Completion","100%"]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.indigoMid }}>{v}</div>
                  <div style={{ fontSize:11, color:T.slateM, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: ASSESSMENT ══ */}
      {tab==="assessment" && (
        <div className="fadeIn">
          {/* Result header */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:20 }}>
            {[
              ["📝 Score", `${correct}/${ASSESS_QS.length} correct`, `${scorePct}%`, passed?T.green:T.red, passed?T.greenLight:T.redLight],
              ["⏱ Time Taken", "Assessment duration","13 min 02 sec", T.blue, T.blueLight],
              ["🔄 Attempts", "Assessment attempts","1st attempt",T.amber,T.amberLight],
            ].map(([title,sub,val,c,bg])=>(
              <Card key={title} style={{ padding:18, textAlign:"center" }}>
                <div style={{ fontSize:13, color:T.slateL, marginBottom:4 }}>{title}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, color:c, letterSpacing:"-0.5px" }}>{val}</div>
                <div style={{ fontSize:11, color:T.slateL, marginTop:3 }}>{sub}</div>
              </Card>
            ))}
          </div>

          {/* Q&A answers */}
          <Card style={{ padding:24 }}>
            <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:20 }}>Answer Review</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {assessAnswers.map((a,i)=>(
                <div key={i} style={{ borderRadius:14, border:`1.5px solid ${a.isRight?"#BBF7D0":"#FECACA"}`, background:a.isRight?"#F0FDF4":"#FEF2F2", padding:"16px 18px" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ width:26, height:26, borderRadius:8, background:a.isRight?T.green:T.red, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:800, flexShrink:0 }}>{a.isRight?"✓":"✗"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                        <Badge color={T.indigoMid} bg={T.indigoPale} size={10}>Q{i+1}</Badge>
                        <Badge color={a.isRight?T.green:T.red} bg={a.isRight?T.greenLight:T.redLight} size={10}>{a.isRight?"Correct":"Wrong"}</Badge>
                      </div>
                      <div style={{ fontWeight:600, fontSize:14, color:T.slate, marginBottom:10, lineHeight:1.4 }}>{a.q}</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                        {ASSESS_QS[i].opts.map((opt,j)=>{
                          const isCorrect = j === a.correct;
                          const isSelected = j === a.selected;
                          const isWrongSelected = isSelected && !isCorrect;
                          return (
                            <div key={j} style={{ fontSize:12, padding:"7px 10px", borderRadius:8,
                              background:isCorrect?"#DCFCE7":isWrongSelected?"#FEE2E2":"#fff",
                              color:isCorrect?T.green:isWrongSelected?T.red:T.slateM,
                              border:`1px solid ${isCorrect?"#BBF7D0":isWrongSelected?"#FECACA":"#E4E7EC"}`,
                              fontWeight:isCorrect||isWrongSelected?700:400,
                              display:"flex", gap:6, alignItems:"center" }}>
                              {isCorrect && <span>✓</span>}
                              {isWrongSelected && <span>✗</span>}
                              {opt}
                              {isSelected && !isCorrect && <span style={{ fontSize:10, color:T.red }}>(Employee's answer)</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: Q&A LOG ══ */}
      {tab==="qa" && (
        <div className="fadeIn">
          <Card style={{ padding:24, marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:T.slate }}>Avatar Q&A Log</div>
                <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>{emp.name} ne training ke dauran ye questions pooche</div>
              </div>
              <Badge color="#7C3AED" bg="#EDE9FE">{emp.questionsAsked} questions asked</Badge>
            </div>

            {qaLog.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:T.slateL }}>
                <div style={{ fontSize:36, marginBottom:10 }}>💬</div>
                <div>Koi questions nahi pooche gaye</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {qaLog.map((qa,i)=>(
                  <div key={i} style={{ background:T.bg, borderRadius:14, padding:"16px 18px", border:"1px solid #E2E8F0" }}>
                    {/* Meta */}
                    <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
                      <Badge color={T.indigoMid} bg={T.indigoPale} size={10}>Q{i+1}</Badge>
                      <span style={{ fontSize:11, color:T.slateL }}>📄 {qa.slide}</span>
                      <span style={{ fontSize:11, color:T.slateL }}>⏱ {qa.time} into training</span>
                    </div>

                    {/* Employee question */}
                    <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:T.indigoPale, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:11, color:T.indigoMid, flexShrink:0 }}>{emp.initials}</div>
                      <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"0 12px 12px 12px", padding:"10px 14px", flex:1 }}>
                        <div style={{ fontSize:11, color:T.slateL, marginBottom:4, fontWeight:600 }}>{emp.name}</div>
                        <div style={{ fontSize:13, color:T.slate }}>{qa.question}</div>
                      </div>
                    </div>

                    {/* Avatar answer */}
                    <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                      <div style={{ background:`linear-gradient(135deg,${T.indigoPale},#F5F3FF)`, border:"1px solid #C7D2FE", borderRadius:"12px 0 12px 12px", padding:"10px 14px", maxWidth:"75%" }}>
                        <div style={{ fontSize:11, color:T.indigoMid, marginBottom:4, fontWeight:700 }}>👩‍💼 Priya (AI Avatar)</div>
                        <div style={{ fontSize:13, color:"#3730A3", lineHeight:1.6 }}>{qa.answer}</div>
                      </div>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:T.indigoPale, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👩‍💼</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Insight box */}
          <Card style={{ padding:20, background:"#FFFBEB", border:"1px solid #FDE68A" }}>
            <div style={{ display:"flex", gap:10 }}>
              <span style={{ fontSize:20 }}>💡</span>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:T.amber, marginBottom:4 }}>Insight</div>
                <div style={{ fontSize:13, color:"#92400E", lineHeight:1.6 }}>
                  {emp.name.split(" ")[0]} ne IT Setup slide pe sabse zyada questions pooche (2 questions). Iska matlab yeh topic thoda complex laga. Future trainings mein IT section ko thoda simplify karna help karega.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Action Bar ── */}
      {reportToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{reportToast}</div>}
      <div style={{ display:"flex", gap:10, marginTop:24, paddingTop:20, borderTop:"1px solid #E2E8F0", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, color:T.slateL }}>Report generated: {emp.completedOn}</div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("🖨 Report sent to printer!")}>🖨 Print Report</Btn>
          <Btn variant="white" size="sm" onClick={()=>showToast("✅ Report exported as PDF!")}>⬇ Export PDF</Btn>
          {passed && <Btn variant="success" size="sm" onClick={()=>showToast(`🏆 Certificate downloaded for ${emp.name}!`)}>🏆 Download Certificate</Btn>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ASSIGN TRAINING FLOW
═══════════════════════════════════════════════════════════════ */
function AssignTraining({ training, onBack, onDone }) {
  const tt = TRAINING_TYPES.find(x=>x.id===training.type);

  // Step: "select" | "configure" | "confirm" | "done"
  const [step, setStep]               = useState("select");
  const [selMode, setSelMode]         = useState("individual"); // individual | department | designation
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedDesig, setSelectedDesig] = useState([]);
  const [search, setSearch]           = useState("");
  const [deadline, setDeadline]       = useState(training.deadline || "");
  const [priority, setPriority]       = useState("mandatory");
  const [notify, setNotify]           = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");
  const [sending, setSending]         = useState(false);
  const [done, setDone]               = useState(false);

  const DEPTS = ["HR","Sales","Tech","Finance","Operations","All Departments"];
  const DESIGS = ["HR Executive","Sales Executive","Software Engineer","Finance Analyst","Ops Manager","Recruiter","DevOps Engineer","Sales Manager"];

  const filteredEmps = EMPLOYEES.filter(e => {
    if(!search) return true;
    return e.name.toLowerCase().includes(search.toLowerCase()) ||
           e.dept.toLowerCase().includes(search.toLowerCase()) ||
           e.role.toLowerCase().includes(search.toLowerCase());
  });

  // Already assigned employees (mock)
  const alreadyAssigned = [1, 3];

  const toggleEmp = (id) => {
    if(alreadyAssigned.includes(id)) return;
    setSelectedEmp(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const toggleDept = (d) => setSelectedDepts(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);
  const toggleDesig = (d) => setSelectedDesig(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);

  // Count how many will be assigned
  const getAssignCount = () => {
    if(selMode==="individual") return selectedEmp.length;
    if(selMode==="department") {
      if(selectedDepts.includes("All Departments")) return EMPLOYEES.length;
      return EMPLOYEES.filter(e => selectedDepts.includes(e.dept)).length;
    }
    return EMPLOYEES.filter(e => selectedDesig.includes(e.role)).length;
  };

  const canProceed = () => {
    if(selMode==="individual") return selectedEmp.length > 0;
    if(selMode==="department") return selectedDepts.length > 0;
    return selectedDesig.length > 0;
  };

  const doAssign = () => {
    setSending(true);
    setTimeout(()=>{ setSending(false); setDone(true); }, 2200);
  };

  const PRIORITY_OPTIONS = [
    { id:"mandatory", label:"Mandatory", icon:"🔴", desc:"Employee ko yeh karna hi hoga", color:T.red, bg:T.redLight },
    { id:"high",      label:"High",      icon:"🟠", desc:"Jaldi complete karna chahiye", color:T.amber, bg:T.amberLight },
    { id:"medium",    label:"Medium",    icon:"🟡", desc:"Normal priority",              color:"#CA8A04", bg:"#FEF9C3" },
    { id:"low",       label:"Low",       icon:"🟢", desc:"Jab time ho tab karo",         color:T.green, bg:T.greenLight },
  ];

  if(done) return (
    <div className="fadeUp" style={{ maxWidth:520, margin:"60px auto", textAlign:"center" }}>
      <div style={{ background:`linear-gradient(135deg,${T.green},#10B981)`, borderRadius:24, padding:"48px 40px", color:"#fff", marginBottom:24 }}>
        <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:400, marginBottom:8 }}>Training Assigned!</h2>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, marginBottom:0 }}>
          {getAssignCount()} employee{getAssignCount()!==1?"s":""} ko <strong>"{training.title.substring(0,35)}..."</strong> assign ho gayi.
        </p>
        {notify && <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, marginTop:8 }}>📧 Email notification bhej di gayi hai.</p>}
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Btn onClick={onDone} size="lg">View Training Details</Btn>
        <Btn variant="ghost" size="lg" onClick={onBack}>← Back to Trainings</Btn>
      </div>
    </div>
  );

  return (
    <div className="fadeUp" style={{ maxWidth:860, margin:"0 auto" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background:"none", border:"none", color:T.indigoMid, fontWeight:600, fontSize:13, cursor:"pointer", marginBottom:20, padding:0, display:"flex", alignItems:"center", gap:5 }}>← Back</button>

      {/* Training summary strip */}
      <div style={{ background:"linear-gradient(135deg,#0B1120,#1447E6)", borderRadius:12, padding:"18px 24px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <TypeIcon type={training.type} size={48}/>
          <div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700, letterSpacing:"0.08em", marginBottom:3 }}>ASSIGNING TRAINING</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16, lineHeight:1.3 }}>{training.title}</div>
            <div style={{ display:"flex", gap:8, marginTop:5 }}>
              <Badge color="#C7D2FE" bg="rgba(255,255,255,0.15)" size={10}>{tt?.icon} {tt?.label}</Badge>
              <Badge color="#C7D2FE" bg="rgba(255,255,255,0.15)" size={10}>📄 {training.slides} slides</Badge>
              {training.mandatory && <Badge color="#FCA5A5" bg="rgba(220,38,38,0.25)" size={10}>MANDATORY</Badge>}
            </div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>Already assigned to</div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:28 }}>{training.assigned}</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>employees</div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:28, gap:0 }}>
        {[["select","1","Select Employees"],["configure","2","Settings & Deadline"],["confirm","3","Review & Assign"]].map(([sid,num,label],i,arr)=>{
          const states = ["select","configure","confirm"];
          const idx = states.indexOf(step);
          const thisIdx = states.indexOf(sid);
          const done_ = idx > thisIdx;
          const active = idx === thisIdx;
          return (
            <div key={sid} style={{ display:"flex", alignItems:"center", flex: i < arr.length-1 ? 1 : 0 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, margin:"0 auto",
                  background:done_?T.green:active?T.indigoMid:"#E4E7EC",
                  color:done_||active?"#fff":T.slateL }}>
                  {done_?"✓":num}
                </div>
                <div style={{ fontSize:11, color:active?T.indigoMid:done_?T.green:T.slateL, fontWeight:active||done_?700:400, marginTop:5, whiteSpace:"nowrap" }}>{label}</div>
              </div>
              {i < arr.length-1 && <div style={{ flex:1, height:2, background:done_?T.green:"#E4E7EC", margin:"0 8px", marginBottom:20 }}/>}
            </div>
          );
        })}
      </div>

      <Card style={{ padding:28 }}>

        {/* ── STEP 1: SELECT EMPLOYEES ── */}
        {step==="select" && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:400, color:T.slate, marginBottom:4 }}>Employees Select Karo</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:22 }}>Yeh training kisko assign karni hai?</p>

            {/* Mode tabs */}
            <div style={{ display:"flex", gap:0, marginBottom:22, background:T.slateXL, borderRadius:12, padding:4, width:"fit-content" }}>
              {[["individual","👤 Individual"],["department","🏢 By Department"],["designation","💼 By Designation"]].map(([mode,label])=>(
                <button key={mode} onClick={()=>{ setSelMode(mode); setSelectedEmp([]); setSelectedDepts([]); setSelectedDesig([]); }}
                  style={{ padding:"8px 20px", borderRadius:9, border:"none", background:selMode===mode?"#fff":"transparent", color:selMode===mode?T.slate:T.slateM, fontWeight:selMode===mode?700:400, fontSize:13, cursor:"pointer", boxShadow:selMode===mode?"0 1px 4px rgba(0,0,0,0.08)":"none", transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* INDIVIDUAL */}
            {selMode==="individual" && (
              <div>
                <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
                  <div style={{ position:"relative", flex:1 }}>
                    <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, department ya role se search karo..." style={{ paddingLeft:34, paddingRight:14, paddingTop:9, paddingBottom:9, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:"100%", color:T.slate }}/>
                  </div>
                  {selectedEmp.length>0 && (
                    <div style={{ background:T.indigoPale, color:T.indigoMid, fontSize:13, fontWeight:700, padding:"8px 16px", borderRadius:10, whiteSpace:"nowrap" }}>
                      {selectedEmp.length} selected
                    </div>
                  )}
                  <button onClick={()=>{ const ids = filteredEmps.filter(e=>!alreadyAssigned.includes(e.id)).map(e=>e.id); setSelectedEmp(ids); }}
                    style={{ border:"1.5px solid #1447E6", background:T.indigoPale, color:T.indigoMid, padding:"8px 14px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
                    Select All
                  </button>
                </div>

                <div style={{ display:"grid", gap:8 }}>
                  {filteredEmps.map(e=>{
                    const isSelected = selectedEmp.includes(e.id);
                    const isAlready  = alreadyAssigned.includes(e.id);
                    const dC = deptColors[e.dept]||deptColors.default;
                    return (
                      <div key={e.id} onClick={()=>toggleEmp(e.id)}
                        style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:12, border:`1.5px solid ${isSelected?T.indigoMid:isAlready?"#BBF7D0":"#E4E7EC"}`,
                          background:isSelected?T.indigoPale:isAlready?"#F0FDF4":"#fff",
                          cursor:isAlready?"default":"pointer", transition:"all 0.15s", opacity:isAlready?0.75:1 }}
                        onMouseEnter={e_=>{ if(!isAlready&&!isSelected) e_.currentTarget.style.borderColor="#C7D2FE"; e_.currentTarget.style.background=!isAlready&&!isSelected?"#FAFAFE":e_.currentTarget.style.background; }}
                        onMouseLeave={e_=>{ if(!isAlready&&!isSelected){ e_.currentTarget.style.borderColor="#E4E7EC"; e_.currentTarget.style.background="#fff"; }}}>

                        {/* Checkbox */}
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                          background:isAlready?"#10B981":isSelected?T.indigoMid:"#fff",
                          border:`2px solid ${isAlready?"#10B981":isSelected?T.indigoMid:"#CBD5E1"}` }}>
                          {(isSelected || isAlready) && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                        </div>

                        <Avatar initials={e.initials} size={38} bg={T.indigoPale} color={T.indigoMid} fontSize={13}/>

                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14, color:T.slate }}>{e.name}</div>
                          <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}>
                            <Badge color={dC} bg={dC+"18"} size={10}>{e.dept}</Badge>
                            <span style={{ fontSize:11, color:T.slateL }}>{e.role}</span>
                          </div>
                        </div>

                        <div style={{ textAlign:"right" }}>
                          {isAlready ? (
                            <Badge color={T.green} bg={T.greenLight} size={10}>✓ Already Assigned</Badge>
                          ) : (
                            <div style={{ fontSize:11, color:T.slateL }}>
                              {e.completed}/{e.assigned} done
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DEPARTMENT */}
            {selMode==="department" && (
              <div>
                <p style={{ fontSize:13, color:T.slateL, marginBottom:16 }}>Kaunse departments ko assign karni hai?</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {DEPTS.map(d=>{
                    const empCount = d==="All Departments" ? EMPLOYEES.length : EMPLOYEES.filter(e=>e.dept===d).length;
                    const isSelected = selectedDepts.includes(d);
                    return (
                      <div key={d} onClick={()=>toggleDept(d)}
                        style={{ border:`1.5px solid ${isSelected?T.indigoMid:"#E4E7EC"}`, borderRadius:14, padding:"16px", cursor:"pointer", textAlign:"center",
                          background:isSelected?T.indigoPale:"#fff", transition:"all 0.15s" }}
                        onMouseEnter={e=>{if(!isSelected){e.currentTarget.style.borderColor="#C7D2FE";e.currentTarget.style.background="#FAFAFE";}}}
                        onMouseLeave={e=>{if(!isSelected){e.currentTarget.style.borderColor="#E4E7EC";e.currentTarget.style.background="#fff";}}}>
                        <div style={{ fontSize:28, marginBottom:8 }}>{d==="All Departments"?"🌐":["💼","📈","💻","💰","⚙️"][DEPTS.indexOf(d)]||"🏢"}</div>
                        <div style={{ fontWeight:700, fontSize:14, color:isSelected?T.indigoMid:T.slate, marginBottom:3 }}>{d}</div>
                        <div style={{ fontSize:12, color:T.slateL }}>{empCount} employee{empCount!==1?"s":""}</div>
                        {isSelected && <div style={{ marginTop:8 }}><Badge color={T.indigoMid} bg="#C7D2FE" size={10}>✓ Selected</Badge></div>}
                      </div>
                    );
                  })}
                </div>
                {selectedDepts.length>0 && (
                  <div style={{ background:T.indigoPale, border:`1px solid #C7D2FE`, borderRadius:12, padding:"12px 16px", marginTop:16, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:T.indigoMid, fontWeight:600 }}>
                      📊 {getAssignCount()} employees will be assigned
                    </span>
                    <span style={{ fontSize:12, color:T.slateL }}>Selected: {selectedDepts.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* DESIGNATION */}
            {selMode==="designation" && (
              <div>
                <p style={{ fontSize:13, color:T.slateL, marginBottom:16 }}>Kaunsi designations ko assign karni hai?</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {DESIGS.map(d=>{
                    const cnt = EMPLOYEES.filter(e=>e.role===d).length;
                    const isSelected = selectedDesig.includes(d);
                    return (
                      <div key={d} onClick={()=>toggleDesig(d)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:12, border:`1.5px solid ${isSelected?T.indigoMid:"#E4E7EC"}`, background:isSelected?T.indigoPale:"#fff", cursor:"pointer", transition:"all 0.15s" }}>
                        <div style={{ width:20, height:20, borderRadius:6, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                          background:isSelected?T.indigoMid:"#fff", border:`2px solid ${isSelected?T.indigoMid:"#CBD5E1"}` }}>
                          {isSelected && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:isSelected?T.indigoMid:T.slate }}>{d}</div>
                          <div style={{ fontSize:11, color:T.slateL }}>{cnt} employee{cnt!==1?"s":""}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedDesig.length>0 && (
                  <div style={{ background:T.indigoPale, border:`1px solid #C7D2FE`, borderRadius:12, padding:"12px 16px", marginTop:16 }}>
                    <span style={{ fontSize:13, color:T.indigoMid, fontWeight:600 }}>📊 {getAssignCount()} employees will be assigned</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: CONFIGURE ── */}
        {step==="configure" && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:400, color:T.slate, marginBottom:4 }}>Settings & Deadline</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>Deadline, priority aur notifications configure karo</p>

            {/* Deadline */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:700, color:T.slate, display:"block", marginBottom:10 }}>📅 Completion Deadline *</label>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["2026-03-31","2026-04-15","2026-04-30","2026-05-15"].map(d=>{
                  const labels = {"2026-03-31":"Mar 31 (24 days)","2026-04-15":"Apr 15 (39 days)","2026-04-30":"Apr 30 (54 days)","2026-05-15":"May 15 (69 days)"};
                  return (
                    <button key={d} onClick={()=>setDeadline(d)}
                      style={{ padding:"9px 18px", borderRadius:10, border:`1.5px solid ${deadline===d?T.indigoMid:"#E4E7EC"}`, background:deadline===d?T.indigoPale:"#fff", color:deadline===d?T.indigoMid:T.slateM, fontSize:13, fontWeight:deadline===d?700:400, cursor:"pointer" }}>
                      {labels[d]}
                    </button>
                  );
                })}
                <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}
                  style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:T.slate }}/>
              </div>
            </div>

            {/* Priority */}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:700, color:T.slate, display:"block", marginBottom:10 }}>⚡ Priority Level</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {[
                  {id:"mandatory",label:"Mandatory",icon:"🔴",desc:"Karna hi hoga",color:T.red,bg:T.redLight},
                  {id:"high",     label:"High",     icon:"🟠",desc:"Jaldi karni chahiye",color:T.amber,bg:T.amberLight},
                  {id:"medium",   label:"Medium",   icon:"🟡",desc:"Normal priority",color:"#CA8A04",bg:"#FEF9C3"},
                  {id:"low",      label:"Low",      icon:"🟢",desc:"Jab time ho",color:T.green,bg:T.greenLight},
                ].map(p=>(
                  <div key={p.id} onClick={()=>setPriority(p.id)}
                    style={{ border:`1.5px solid ${priority===p.id?p.color:"#E4E7EC"}`, borderRadius:12, padding:"14px 12px", cursor:"pointer", textAlign:"center",
                      background:priority===p.id?p.bg:"#fff", transition:"all 0.15s" }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{p.icon}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:priority===p.id?p.color:T.slate, marginBottom:2 }}>{p.label}</div>
                    <div style={{ fontSize:11, color:T.slateL }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:20 }}>
              <label style={{ fontSize:13, fontWeight:700, color:T.slate, display:"block", marginBottom:14 }}>🔔 Notifications</label>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[
                  { label:"Assignment notification bhejo", sub:"Employee ko immediately email milegi", val:notify, set:setNotify },
                  { label:"Deadline reminder bhejo", sub:`${reminderDays} days pehle reminder jaayega`, val:sendReminder, set:setSendReminder },
                ].map(n=>(
                  <div key={n.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:T.bg, borderRadius:12 }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.slate }}>{n.label}</div>
                      <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>{n.sub}</div>
                    </div>
                    <div onClick={()=>n.set(v=>!v)} style={{ width:44, height:24, borderRadius:12, background:n.val?T.indigoMid:"#CBD5E1", cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:n.val?23:3, transition:"all 0.2s" }}/>
                    </div>
                  </div>
                ))}
                {sendReminder && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:T.amberLight, borderRadius:10 }}>
                    <span style={{ fontSize:13, color:T.amber }}>📅 Deadline se</span>
                    <select value={reminderDays} onChange={e=>setReminderDays(e.target.value)} style={{ border:"1px solid #FDE68A", borderRadius:8, padding:"4px 10px", fontSize:13, background:"#fff", color:T.slate }}>
                      {["1","2","3","5","7"].map(d=><option key={d} value={d}>{d} din pehle</option>)}
                    </select>
                    <span style={{ fontSize:13, color:T.amber }}>reminder jaayega</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step==="confirm" && (
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:400, color:T.slate, marginBottom:4 }}>Review & Assign</h3>
            <p style={{ fontSize:13, color:T.slateL, marginBottom:22 }}>Sab kuch check karo, phir assign karo</p>

            {/* Summary box */}
            <div style={{ background:`linear-gradient(135deg,${T.indigoPale},#F5F3FF)`, border:`1.5px solid #C7D2FE`, borderRadius:12, padding:"20px 24px", marginBottom:24 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  ["📚 Training", training.title.substring(0,40)+"..."],
                  ["👥 Assigning To", `${getAssignCount()} employee${getAssignCount()!==1?"s":""}` + (selMode==="department" ? ` (${selectedDepts.join(", ")})` : selMode==="designation" ? ` (${selectedDesig.join(", ")})` : "")],
                  ["📅 Deadline", deadline ? new Date(deadline).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "Not set"],
                  ["⚡ Priority", priority.charAt(0).toUpperCase()+priority.slice(1)],
                  ["📧 Notification", notify ? "Email jaayegi immediately" : "No notification"],
                  ["🔔 Reminder", sendReminder ? `${reminderDays} days before deadline` : "No reminder"],
                ].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ fontSize:13, color:T.slateL, minWidth:110, fontWeight:500 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.slate, lineHeight:1.4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee preview (individual mode only) */}
            {selMode==="individual" && selectedEmp.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.slate, marginBottom:12 }}>Assigned Employees Preview:</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:240, overflowY:"auto", paddingRight:4 }}>
                  {EMPLOYEES.filter(e=>selectedEmp.includes(e.id)).map(e=>{
                    const dC = deptColors[e.dept]||deptColors.default;
                    return (
                      <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:T.bg, borderRadius:10 }}>
                        <Avatar initials={e.initials} size={34} bg={T.indigoPale} color={T.indigoMid} fontSize={12}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{e.name}</div>
                          <Badge color={dC} bg={dC+"18"} size={10}>{e.dept} • {e.role}</Badge>
                        </div>
                        <button onClick={()=>setSelectedEmp(prev=>prev.filter(x=>x!==e.id))} style={{ border:"none", background:"none", color:T.slateL, cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning if mandatory */}
            {priority==="mandatory" && (
              <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:T.red }}>Mandatory Training</div>
                  <div style={{ fontSize:12, color:"#B91C1C", marginTop:2 }}>
                    Yeh training Mandatory mark hai. Employees ko deadline miss karne pe manager ko alert jaayega.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:28, paddingTop:20, borderTop:"1px solid #F1F5F9", alignItems:"center" }}>
          <Btn variant="white" onClick={()=>{ if(step==="select") onBack(); else if(step==="configure") setStep("select"); else setStep("configure"); }}>
            {step==="select"?"Cancel":"← Back"}
          </Btn>

          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {canProceed() && step==="select" && (
              <span style={{ fontSize:13, color:T.slateL }}>{getAssignCount()} employee{getAssignCount()!==1?"s":""} selected</span>
            )}
            {step==="select" && (
              <Btn onClick={()=>setStep("configure")} disabled={!canProceed()}>Next: Settings →</Btn>
            )}
            {step==="configure" && (
              <Btn onClick={()=>setStep("confirm")} disabled={!deadline}>Review Assignment →</Btn>
            )}
            {step==="confirm" && (
              <Btn onClick={doAssign} variant="success" style={{ minWidth:160 }}>
                {sending ? (
                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                    Assigning...
                  </span>
                ) : `✓ Assign to ${getAssignCount()} Employee${getAssignCount()!==1?"s":""}`}
              </Btn>
            )}
          </div>
        </div>

      </Card>
    </div>
  );
}

/* Employee List */
// Per-employee mock training data
const EMP_TRAININGS = {
  1: [ // Priya Sharma
    { id:1, tStatus:"completed",   tProgress:100, score:84,  completedOn:"Mar 5, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 1, 2026"  },
    { id:3, tStatus:"in-progress", tProgress:65,  score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:79,  completedOn:"Feb 28, 2026" },
  ],
  2: [ // Rahul Mehta
    { id:1, tStatus:"in-progress", tProgress:40,  score:null,completedOn:null           },
    { id:5, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:72,  completedOn:"Mar 3, 2026"  },
  ],
  3: [ // Anika Singh
    { id:1, tStatus:"completed",   tProgress:100, score:95,  completedOn:"Mar 2, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:91,  completedOn:"Feb 25, 2026" },
    { id:4, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 6, 2026"  },
    { id:5, tStatus:"completed",   tProgress:100, score:90,  completedOn:"Mar 1, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:94,  completedOn:"Feb 20, 2026" },
  ],
  4: [ // Deepak Verma
    { id:1, tStatus:"completed",   tProgress:100, score:77,  completedOn:"Mar 4, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:80,  completedOn:"Feb 22, 2026" },
    { id:8, tStatus:"in-progress", tProgress:30,  score:null,completedOn:null           },
  ],
  5: [ // Meera Patel
    { id:1, tStatus:"completed",   tProgress:100, score:91,  completedOn:"Mar 3, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:85,  completedOn:"Feb 28, 2026" },
    { id:3, tStatus:"completed",   tProgress:100, score:88,  completedOn:"Mar 5, 2026"  },
    { id:5, tStatus:"completed",   tProgress:100, score:92,  completedOn:"Mar 1, 2026"  },
    { id:6, tStatus:"completed",   tProgress:100, score:86,  completedOn:"Mar 6, 2026"  },
    { id:7, tStatus:"completed",   tProgress:100, score:89,  completedOn:"Feb 20, 2026" },
  ],
  6: [ // Arjun Kapoor
    { id:1, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
    { id:5, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
  ],
  7: [ // Sneha Joshi
    { id:1, tStatus:"completed",   tProgress:100, score:82,  completedOn:"Mar 4, 2026"  },
    { id:2, tStatus:"completed",   tProgress:100, score:79,  completedOn:"Mar 1, 2026"  },
    { id:3, tStatus:"in-progress", tProgress:55,  score:null,completedOn:null           },
    { id:7, tStatus:"completed",   tProgress:100, score:76,  completedOn:"Feb 25, 2026" },
  ],
  8: [ // Rohit Das
    { id:1, tStatus:"completed",   tProgress:100, score:65,  completedOn:"Mar 3, 2026"  },
    { id:4, tStatus:"in-progress", tProgress:20,  score:null,completedOn:null           },
    { id:7, tStatus:"not-started", tProgress:0,   score:null,completedOn:null           },
  ],
};

function EmployeeTrainingsModal({ emp, onClose }) {
  const empTrainings = EMP_TRAININGS[emp.id] || [];
  const dC = deptColors[emp.dept] || deptColors.default;
  const completed = empTrainings.filter(t => t.tStatus === "completed").length;
  const inProgress = empTrainings.filter(t => t.tStatus === "in-progress").length;
  const notStarted = empTrainings.filter(t => t.tStatus === "not-started").length;
  const avgScore = empTrainings.filter(t=>t.score).length
    ? Math.round(empTrainings.filter(t=>t.score).reduce((s,t)=>s+t.score,0) / empTrainings.filter(t=>t.score).length)
    : null;

  return (
    // Backdrop
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:100, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", backdropFilter:"blur(3px)" }}>
      {/* Drawer */}
      <div onClick={e=>e.stopPropagation()}
        style={{ width:520, height:"100vh", background:"#fff", boxShadow:"-8px 0 40px rgba(0,0,0,0.18)", display:"flex", flexDirection:"column", animation:"slideIn 0.25s ease" }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:none}}`}</style>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0B1120,#1447E6)", padding:"24px 24px 20px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff" }}>
                {emp.initials}
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:18 }}>{emp.name}</div>
                <div style={{ display:"flex", gap:6, marginTop:4 }}>
                  <span style={{ background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)", fontSize:11, padding:"2px 9px", borderRadius:100, fontWeight:600 }}>{emp.dept}</span>
                  <span style={{ background:"rgba(255,255,255,0.10)", color:"rgba(255,255,255,0.65)", fontSize:11, padding:"2px 9px", borderRadius:100 }}>{emp.role}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* KPI row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {[
              ["📚", "Total",       empTrainings.length, "#fff"],
              ["✅", "Completed",   completed,           "#6EE7B7"],
              ["▶",  "In Progress", inProgress,          "#93C5FD"],
              ["⭐", "Avg Score",   avgScore ? avgScore+"%" : "—", "#FCD34D"],
            ].map(([ic,label,val,c])=>(
              <div key={label} style={{ background:"rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:16, marginBottom:3 }}>{ic}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, color:c, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Training list */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.slateL, letterSpacing:"0.08em", marginBottom:12 }}>
            ASSIGNED TRAININGS ({empTrainings.length})
          </div>

          {empTrainings.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:T.slateL }}>
              <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
              <div style={{ fontSize:14 }}>Koi training assign nahi hui abhi</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {empTrainings.map((et, i) => {
                const tr = TRAININGS.find(t => t.id === et.id);
                if(!tr) return null;
                const tt = TRAINING_TYPES.find(x => x.id === tr.type);
                const isCompleted = et.tStatus === "completed" && et.tProgress === 100;
                const passed = et.score && et.score >= 70;

                return (
                  <div key={i} style={{ borderRadius:14, border:`1.5px solid ${isCompleted?"#BBF7D0":et.tStatus==="in-progress"?"#BFDBFE":"#E4E7EC"}`, background:isCompleted?"#F0FDF4":et.tStatus==="in-progress"?"#EFF6FF":"#fff", padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <TypeIcon type={tr.type} size={40}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        {/* Title + badges */}
                        <div style={{ fontWeight:700, fontSize:13, color:T.slate, marginBottom:6, lineHeight:1.3 }}>{tr.title}</div>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                          <Badge color={tt?.color||T.indigoMid} bg={tt?.bg||T.indigoPale} size={10}>{tt?.icon} {tt?.label}</Badge>
                          <StatusBadge status={et.tStatus}/>
                          {tr.mandatory && <Badge color={T.red} bg={T.redLight} size={10}>MANDATORY</Badge>}
                        </div>

                        {/* Progress bar */}
                        <div style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.slateL, marginBottom:4 }}>
                            <span>Progress</span>
                            <span style={{ fontWeight:700, color:isCompleted?T.green:T.indigoMid }}>{et.tProgress}%</span>
                          </div>
                          <ProgressBar pct={et.tProgress} color={isCompleted?T.green:T.indigoLight} height={5}/>
                        </div>

                        {/* Score row — only for completed */}
                        {isCompleted && (
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:4 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                <span style={{ fontSize:11, color:T.slateL }}>Score:</span>
                                <span style={{ fontSize:16, fontWeight:800, color:passed?T.green:T.red }}>{et.score}%</span>
                                <span style={{ fontSize:11, fontWeight:700, color:passed?T.green:T.red }}>{passed?"✅ Pass":"❌ Fail"}</span>
                              </div>
                            </div>
                            <span style={{ fontSize:10, color:T.slateL }}>✓ {et.completedOn}</span>
                          </div>
                        )}

                        {/* Not started deadline nudge */}
                        {et.tStatus === "not-started" && (
                          <div style={{ fontSize:11, color:T.red, fontWeight:600 }}>📅 Due: Apr 30, 2026 — Not started yet</div>
                        )}

                        {/* In progress: slide info */}
                        {et.tStatus === "in-progress" && (
                          <div style={{ fontSize:11, color:T.blue, fontWeight:600 }}>📖 In progress — {et.tProgress}% complete</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 20px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontSize:12, color:T.slateL }}>{completed} of {empTrainings.length} completed</div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn variant="white" size="sm" onClick={onClose}>Close</Btn>
            <Btn size="sm" onClick={()=>{ onClose(); }}>📚 Assign New Training</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeList({ onAssign }) {
  const [viewEmp, setViewEmp] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
  const [empDept, setEmpDept] = useState("All Departments");
  const [empToast, setEmpToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const showToast = (msg) => { setEmpToast(msg); setTimeout(()=>setEmpToast(null),3000); };

  const filteredEmps = EMPLOYEES.filter(e=>{
    const matchSearch = !empSearch || e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.dept.toLowerCase().includes(empSearch.toLowerCase());
    const matchDept = empDept==="All Departments" || e.dept===empDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="fadeUp">
      {empToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{empToast}</div>}
      {viewEmp && <EmployeeTrainingsModal emp={viewEmp} onClose={()=>setViewEmp(null)}/>}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div onClick={()=>setShowAddModal(false)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:32, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, color:T.slate, fontWeight:700, marginBottom:20 }}>+ Add New Employee</div>
            {[["Full Name","e.g. Rahul Sharma"],["Email","rahul@company.com"],["Department","HR / Sales / Tech..."],["Designation","Role / Job Title"]].map(([label,ph])=>(
              <div key={label} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:600, color:T.slateM, display:"block", marginBottom:5 }}>{label}</label>
                <input placeholder={ph} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:13, boxSizing:"border-box" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
              <Btn variant="white" onClick={()=>setShowAddModal(false)}>Cancel</Btn>
              <Btn onClick={()=>{ setShowAddModal(false); showToast("✅ Employee added & invitation sent!"); }}>Add Employee</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
            <input value={empSearch} onChange={e=>setEmpSearch(e.target.value)} placeholder="Search employees..." style={{ paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, width:200 }}/>
          </div>
          <select value={empDept} onChange={e=>setEmpDept(e.target.value)} style={{ padding:"8px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:T.slateM }}>
            <option>All Departments</option>
            {["HR","Sales","Tech","Finance","Operations"].map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("📋 CSV template downloaded!")}>⬆ Import CSV</Btn>
          <Btn size="sm" onClick={()=>setShowAddModal(true)}>+ Add Employee</Btn>
        </div>
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
              {["Employee","Department","Role","Trainings","Avg Score","Status","Actions"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:T.slateL, fontWeight:700, letterSpacing:"0.06em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmps.map((e,i)=>{
              const dC = deptColors[e.dept]||deptColors.default;
              return (
                <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={e.initials} size={36} bg={T.indigoPale} color={T.indigoMid} fontSize={13}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{e.name}</div>
                        <div style={{ fontSize:11, color:T.slateL }}>Reports to: {e.manager}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}><Badge color={dC} bg={dC+"18"}>{e.dept}</Badge></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:T.slateM }}>{e.role}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontSize:13, color:T.slate }}>{e.completed}/{e.assigned}</div>
                    <ProgressBar pct={e.completed/e.assigned*100} height={4}/>
                  </td>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:e.avgScore?(e.avgScore>=70?T.green:T.red):T.slateL, fontSize:13 }}>
                    {e.avgScore?`${e.avgScore}%`:"—"}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <Badge color={e.status==="active"?T.green:T.slateM} bg={e.status==="active"?T.greenLight:T.slateXL}>{e.status==="active"?"● Active":"○ Inactive"}</Badge>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>setViewEmp(e)} style={{ border:"none", background:T.indigoPale, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, color:T.indigoMid, fontWeight:600 }}>👁 View Details</button>
                      <button style={{ border:"none", background:T.slateXL, padding:"5px 10px", borderRadius:7, cursor:"pointer", fontSize:11, color:T.slateM }}>Edit</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERALL LEADERBOARD
═══════════════════════════════════════════════════════════════ */
function OverallLeaderboard() {
  const [sortBy, setSortBy] = useState("points");
  const [filterDept, setFilterDept] = useState("All");
  const [lbToast, setLbToast] = useState(null);
  const showToast = (msg) => { setLbToast(msg); setTimeout(()=>setLbToast(null),3000); };

  // Build leaderboard data from EMP_TRAININGS
  const leaderboardData = EMPLOYEES.map(emp => {
    const empT = EMP_TRAININGS[emp.id] || [];
    const completed = empT.filter(t=>t.tStatus==="completed").length;
    const scores = empT.filter(t=>t.score).map(t=>t.score);
    const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    const totalPoints = scores.reduce((sum,s)=>{
      if(s>=90) return sum+150;
      if(s>=80) return sum+120;
      if(s>=70) return sum+100;
      return sum+50;
    }, 0);
    const badges = [];
    if(completed>=5) badges.push("⭐");
    if(avgScore>=90) badges.push("💯");
    if(completed>=3) badges.push("🔥");
    badges.push("🚀");
    return { emp, completed, avgScore, totalPoints, badges: badges.slice(0,3), totalTrainings: empT.length };
  });

  const sorted = [...leaderboardData].filter(d=>filterDept==="All"||d.emp.dept===filterDept)
    .sort((a,b)=> sortBy==="points"? b.totalPoints-a.totalPoints : sortBy==="score" ? b.avgScore-a.avgScore : b.completed-a.completed);

  const top3 = sorted.slice(0,3);
  const podiumOrder = top3.length>=3 ? [top3[1],top3[0],top3[2]] : top3;

  return (
    <div className="fadeUp">
      {lbToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{lbToast}</div>}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0B1120,#1447E6)", borderRadius:14, padding:"24px 32px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>OVERALL PLATFORM LEADERBOARD</div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:26, fontWeight:700 }}>🏆 Employee Rankings</div>
          <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginTop:4 }}>Sab trainings ke across — points, score aur completions ke basis pe ranked</div>
        </div>
        <Btn variant="white" size="sm" onClick={()=>showToast("✅ Leaderboard exported!")}>⬇ Export</Btn>
      </div>

      {/* Filters + Sort */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", gap:8 }}>
          {["All","HR","Sales","Tech","Finance","Operations"].map(d=>(
            <button key={d} onClick={()=>setFilterDept(d)} style={{ padding:"6px 16px", borderRadius:100, border:`1.5px solid ${filterDept===d?T.indigoMid:"#E4E7EC"}`, background:filterDept===d?T.indigoPale:"#fff", color:filterDept===d?T.indigoMid:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>{d}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:T.slateL }}>Sort by:</span>
          {[["points","⭐ Points"],["score","📊 Avg Score"],["completed","✅ Completed"]].map(([id,label])=>(
            <button key={id} onClick={()=>setSortBy(id)} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${sortBy===id?T.indigoMid:"#E4E7EC"}`, background:sortBy===id?T.indigoPale:"#fff", color:sortBy===id?T.indigoMid:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Podium */}
      {sorted.length >= 3 && (
        <Card style={{ padding:"28px 24px", marginBottom:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:24, textAlign:"center" }}>🏅 Top Performers</div>
          <div style={{ display:"flex", gap:16, justifyContent:"center", alignItems:"flex-end" }}>
            {podiumOrder.map((d,pi)=>{
              const medals = ["🥈","🥇","🥉"];
              const heights = [110, 140, 90];
              const borders = ["#A8A8A8","#F59E0B","#CD7F32"];
              const bgs = ["linear-gradient(180deg,#C0C0C0,#9CA3AF)","linear-gradient(180deg,#FBBF24,#D97706)","linear-gradient(180deg,#CD7F32,#B8691E)"];
              return (
                <div key={d.emp.id} style={{ textAlign:"center", flex:1, maxWidth:200 }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{medals[pi]}</div>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:T.indigoPale, border:`3px solid ${borders[pi]}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:T.indigoMid, margin:"0 auto 8px" }}>{d.emp.initials}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:T.slate }}>{d.emp.name}</div>
                  <div style={{ fontSize:11, color:T.slateL, marginBottom:10 }}>{d.emp.dept}</div>
                  <div style={{ height:heights[pi], background:bgs[pi], borderRadius:"12px 12px 0 0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:"#fff" }}>⭐ {d.totalPoints}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>Avg: {d.avgScore}%</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)" }}>✅ {d.completed} done</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Full Rankings Table */}
      <Card>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9", fontWeight:700, color:T.slate }}>
          Full Rankings ({sorted.length} employees)
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
              {["Rank","Employee","Department","Trainings Done","Avg Score","Total Points","Badges"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"10px 16px", fontSize:11, color:T.slateL, fontWeight:700, letterSpacing:"0.05em" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d,i)=>{
              const rank = i+1;
              const dC = deptColors[d.emp.dept]||deptColors.default;
              const rankBg = rank===1?"#FEF3C7":rank===2?"#F2F4F7":rank===3?"#FEF3E7":"transparent";
              const rankColor = rank===1?"#D97706":rank===2?"#64748B":rank===3?"#B45309":T.slateM;
              return (
                <tr key={d.emp.id} style={{ borderBottom:"1px solid #F8FAFC", background:rank<=3?"#FFFBEB":"#fff" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, background:rankBg, color:rankColor }}>
                      {rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":rank}
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar initials={d.emp.initials} size={36} bg={T.indigoPale} color={T.indigoMid} fontSize={12}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:T.slate }}>{d.emp.name}</div>
                        <div style={{ fontSize:11, color:T.slateL }}>{d.emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}><Badge color={dC} bg={dC+"18"} size={11}>{d.emp.dept}</Badge></td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, maxWidth:80 }}><ProgressBar pct={d.completed/d.totalTrainings*100||0} height={5}/></div>
                      <span style={{ fontSize:13, fontWeight:700, color:T.slate }}>{d.completed}/{d.totalTrainings}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ fontWeight:800, fontSize:15, color:d.avgScore>=80?T.green:d.avgScore>=70?T.amber:T.red }}>{d.avgScore>0?d.avgScore+"%":"—"}</span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#D97706" }}>⭐ {d.totalPoints}</span>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:18, letterSpacing:2 }}>{d.badges.join(" ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Reports() {
  const [repToast, setRepToast] = useState(null);
  const showToast = (msg) => { setRepToast(msg); setTimeout(()=>setRepToast(null),3000); };
  return (
    <div className="fadeUp">
      {repToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{repToast}</div>}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:T.slate, fontWeight:400 }}>Analytics & Reports</div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant="white" size="sm" onClick={()=>showToast("📊 Report exported as PDF!")}>⬇ Export PDF</Btn>
          <Btn variant="white" size="sm" onClick={()=>showToast("📧 Report emailed to admin@company.com!")}>📧 Email Report</Btn>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[["Total Hours Trained","1,284 hrs","⏱",T.indigoMid],["Org Completion Rate","74%","📊",T.green],["Compliance Done","92%","⚖️",T.amber],["Certificates Issued","143","🏆",T.blue]].map(([l,v,ic,c])=>(
          <Card key={l} style={{ padding:18, textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{ic}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:30, color:c, letterSpacing:"-1px" }}>{v}</div>
            <div style={{ fontSize:12, color:T.slateL, marginTop:3 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:24 }}>
        <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:16 }}>Training Completion by Department</div>
        {["HR","Sales","Tech","Finance","Operations"].map((dept,i)=>{
          const pct = [92,64,88,76,71][i];
          return (
            <div key={dept} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:90, fontSize:13, color:T.slateM, fontWeight:500, textAlign:"right" }}>{dept}</div>
              <div style={{ flex:1 }}><ProgressBar pct={pct} color={pct>=80?T.green:T.indigoLight} height={10}/></div>
              <div style={{ width:40, fontSize:13, fontWeight:700, color:pct>=80?T.green:T.amber }}>{pct}%</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function SettingsPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [settingsToast, setSettingsToast] = useState(null);
  const showToast = (msg) => { setSettingsToast(msg); setTimeout(()=>setSettingsToast(null),3000); };

  const settingSections = {
    "🏢 Organisation Profile": {
      desc:"Company name, logo, timezone",
      fields:[["Company Name","LearnFlow Pvt Ltd"],["Timezone","Asia/Kolkata (IST)"],["Industry","HR & Training"],["Website","www.learnflow.in"]]
    },
    "🔔 Default Notifications": {
      desc:"Global notification settings",
      fields:[["Assignment Email","Enabled"],["Deadline Reminder","3 days before"],["Completion Email","Enabled"],["Weekly Summary","Every Monday"]]
    },
    "👥 Role Management": {
      desc:"Admin, Manager roles assign karo",
      fields:[["Super Admin","Neha Agarwal"],["HR Admin","Priya Sharma"],["Manager","Vikram Joshi"],["Viewer","Sunita Rao"]]
    },
    "🎨 Certificate Template": {
      desc:"Certificate ka design customize karo",
      fields:[["Template Style","Professional Blue"],["Signature Name","Neha Agarwal, HR Head"],["Logo Position","Top Center"],["Validity","Permanent"]]
    },
    "🔗 Integrations": {
      desc:"HRMS, Slack, Email integrations",
      fields:[["HRMS","Keka HR — Connected ✅"],["Email","Gmail SMTP — Connected ✅"],["Slack","Slack Workspace — Not configured"],["SSO","Google SSO — Connected ✅"]]
    },
  };

  return (
    <div className="fadeUp">
      {settingsToast && <div style={{ position:"fixed", bottom:24, right:24, background:"#101828", color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"fadeUp 0.3s ease" }}>{settingsToast}</div>}

      {/* Settings Modal */}
      {activeModal && (
        <div onClick={()=>setActiveModal(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:32, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, color:T.slate, fontWeight:700, marginBottom:4 }}>{activeModal}</div>
            <div style={{ fontSize:13, color:T.slateL, marginBottom:24 }}>{settingSections[activeModal]?.desc}</div>
            {settingSections[activeModal]?.fields.map(([label,val])=>(
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
                <span style={{ fontSize:13, color:T.slateM, fontWeight:500 }}>{label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.slate }}>{val}</span>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:24 }}>
              <Btn variant="white" onClick={()=>setActiveModal(null)}>Cancel</Btn>
              <Btn onClick={()=>{ setActiveModal(null); showToast("✅ Settings saved successfully!"); }}>Save Changes</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:T.slate, marginBottom:20, fontWeight:400 }}>Settings</div>
      <div style={{ display:"grid", gap:16 }}>
        {Object.entries(settingSections).map(([title,data])=>(
          <Card key={title} style={{ padding:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:T.slate }}>{title}</div>
              <div style={{ fontSize:12, color:T.slateL, marginTop:3 }}>{data.desc}</div>
            </div>
            <button onClick={()=>setActiveModal(title)} style={{ border:"1px solid #E2E8F0", background:"#fff", padding:"6px 16px", borderRadius:8, fontSize:13, cursor:"pointer", color:T.slateM }}>Configure →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMPLOYEE PANEL
═══════════════════════════════════════════════════════════════ */
function EmployeePanel({ onExit }) {
  const [nav, setNav] = useState("dashboard");
  const [activeTraining, setActiveTraining] = useState(null);
  const [trainingPhase, setTrainingPhase] = useState("landing"); // landing|room|assessment|result

  const myTrainings = [
    { ...TRAININGS[0], myStatus:"in-progress", myPct:40, mySlide:2 },
    { ...TRAININGS[4], myStatus:"not-started",  myPct:0,  mySlide:0 },
    { ...TRAININGS[2], myStatus:"completed",    myPct:100,mySlide:5, myScore:84 },
    { ...TRAININGS[6], myStatus:"completed",    myPct:100,mySlide:5, myScore:91 },
  ];

  const startTraining = (t) => { setActiveTraining({...t,...myTrainings.find(x=>x.id===t.id)}); setTrainingPhase("landing"); setNav("training"); };

  if(nav==="training" && activeTraining) {
    if(trainingPhase==="landing") return <><Sty/><TrainingLanding training={activeTraining} onStart={()=>setTrainingPhase("room")} onExit={()=>setNav("my-trainings")}/></>;
    if(trainingPhase==="room")    return <><Sty/><TrainingRoom training={activeTraining} onAssessment={()=>setTrainingPhase("assessment")} onExit={()=>setNav("my-trainings")}/></>;
    if(trainingPhase==="assessment") return <><Sty/><AssessmentScreen training={activeTraining} onDone={score=>{ setActiveTraining({...activeTraining,finalScore:score}); setTrainingPhase("result"); }}/></>;
    if(trainingPhase==="result") return <><Sty/><ResultScreen training={activeTraining} onDone={()=>setNav("my-trainings")}/></>;
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Inter',sans-serif" }}>
      <Sty/>
      {/* Navbar */}
      <nav style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:22 }}>🤖</span>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, color:T.slate }}>LearnFlow</span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["dashboard","Dashboard"],["my-trainings","My Trainings"],["my-reports","My Reports"]].map(([id,label])=>(
            <button key={id} onClick={()=>setNav(id)} style={{ padding:"6px 16px", borderRadius:8, border:"none", background:nav===id?T.indigoPale:"transparent", color:nav===id?T.indigoMid:T.slateM, fontWeight:nav===id?700:400, fontSize:13, cursor:"pointer" }}>{label}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Avatar initials="RS" size={34} bg={T.indigoPale} color={T.indigoMid}/>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.slate }}>Rahul Sharma</div>
            <div style={{ fontSize:11, color:T.slateL }}>Sales Executive</div>
          </div>
          <button onClick={onExit} style={{ border:"none", background:"none", color:T.slateL, fontSize:12, cursor:"pointer", marginLeft:8 }}>Exit</button>
        </div>
      </nav>

      <div style={{ padding:28 }}>
        {nav==="dashboard" && <EmpDashboard myTrainings={myTrainings} onStart={startTraining}/>}
        {nav==="my-trainings" && <EmpTrainings myTrainings={myTrainings} onStart={startTraining}/>}
        {nav==="my-reports" && <EmpReports/>}
      </div>
    </div>
  );
}

function EmpDashboard({ myTrainings, onStart }) {
  const pending = myTrainings.filter(t=>t.myStatus!=="completed");
  const mandatory = myTrainings.filter(t=>t.mandatory && t.myStatus!=="completed");
  return (
    <div className="fadeUp">
      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,#0B1120 0%,#1447E6 100%)", borderRadius:14, padding:"28px 32px", color:"#fff", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", fontSize:90, opacity:0.08 }}>🎓</div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:400, marginBottom:4 }}>Good morning, Rahul! 👋</div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:15, marginBottom:20 }}>
          {pending.length} training{pending.length!==1?"s":""} pending. {mandatory.length>0?`${mandatory.length} mandatory!`:"Keep up the great work!"}
        </div>
        {mandatory.length>0 && (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>onStart(mandatory[0])} style={{ background:"#fff", color:"#1447E6", border:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>Start Mandatory Training →</button>
          </div>
        )}
        {/* Streak */}
        <div style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 14px", textAlign:"center", backdropFilter:"blur(8px)" }}>
          <div style={{ fontSize:22 }}>🔥</div>
          <div style={{ color:"#fff", fontSize:18, fontWeight:800 }}>5</div>
          <div style={{ color:"rgba(255,255,255,0.65)", fontSize:10 }}>Day streak</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[["📚","Assigned",myTrainings.length,T.indigoMid,T.indigoPale],["▶","In Progress",myTrainings.filter(t=>t.myStatus==="in-progress").length,T.blue,T.blueLight],["✅","Completed",myTrainings.filter(t=>t.myStatus==="completed").length,T.green,T.greenLight],["🏆","Certificates",myTrainings.filter(t=>t.myStatus==="completed").length,T.amber,T.amberLight]].map(([ic,l,v,c,bg])=>(
          <Card key={l} style={{ padding:18, textAlign:"center" }}>
            <div style={{ width:44, height:44, borderRadius:14, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, margin:"0 auto 10px" }}>{ic}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, color:c, letterSpacing:"-0.5px" }}>{v}</div>
            <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* In-progress + Mandatory */}
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:20 }}>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, color:T.slate, fontSize:15, marginBottom:16 }}>Continue Learning</div>
          {myTrainings.filter(t=>t.myStatus==="in-progress").map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ display:"flex", gap:14, alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
                <TypeIcon type={t.type} size={46}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:T.slate, marginBottom:2 }}>{t.title.substring(0,40)}...</div>
                  <div style={{ fontSize:11, color:T.slateL, marginBottom:8 }}>{tt?.label} • Slide {t.mySlide}/{t.slides}</div>
                  <ProgressBar pct={t.myPct}/>
                  <div style={{ fontSize:11, color:T.slateL, marginTop:4 }}>{t.myPct}% complete</div>
                </div>
                <Btn onClick={()=>onStart(t)} size="sm">Resume →</Btn>
              </div>
            );
          })}
        </Card>
        <Card style={{ padding:24 }}>
          <div style={{ fontWeight:700, color:T.slate, fontSize:15, marginBottom:16 }}>⚠️ Mandatory Pending</div>
          {myTrainings.filter(t=>t.mandatory && t.myStatus!=="completed").map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            return (
              <div key={t.id} style={{ background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <TypeIcon type={t.type} size={38}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:T.slate, marginBottom:3 }}>{t.title.substring(0,36)}...</div>
                    <div style={{ fontSize:11, color:T.red, fontWeight:600, marginBottom:10 }}>📅 Due: Apr 30, 2026</div>
                    <Btn onClick={()=>onStart(t)} size="sm" variant="danger" full>Start Now</Btn>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ background:T.amberLight, border:"1px solid #FDE68A", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:12, color:T.amber, fontWeight:700 }}>🔔 Reminder</div>
            <div style={{ fontSize:12, color:"#92400E", marginTop:3 }}>Workplace Safety Training — 2 days left</div>
          </div>
        </Card>
      </div>

      {/* My Rewards & Badges */}
      <Card style={{ padding:24, marginTop:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <div style={{ fontWeight:700, color:T.slate, fontSize:15 }}>🎖️ My Rewards & Badges</div>
            <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>Trainings complete karne pe earned kiye</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, color:"#D97706" }}>⭐ 340</div>
            <div style={{ fontSize:11, color:T.slateL }}>Total Points</div>
          </div>
        </div>

        {/* Points breakdown */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
          {[
            { icon:"⭐", label:"This Month",   pts:200, color:"#D97706", bg:"#FEF3C7" },
            { icon:"🏅", label:"Total Earned", pts:340, color:T.indigoMid, bg:T.indigoPale },
            { icon:"🥇", label:"Best Rank",    pts:"#1", color:T.green, bg:T.greenLight },
            { icon:"🔥", label:"Day Streak",   pts:"5",  color:T.red, bg:T.redLight },
          ].map(k=>(
            <div key={k.label} style={{ background:k.bg, borderRadius:12, padding:"12px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{k.icon}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:k.color }}>{k.pts}</div>
              <div style={{ fontSize:10, color:T.slateM, marginTop:2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ fontSize:11, fontWeight:700, color:T.slateL, letterSpacing:"0.08em", marginBottom:12 }}>BADGES EARNED</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { icon:"🚀", label:"Fast Learner",   desc:"Top 10% time mein complete", earned:true  },
            { icon:"🔥", label:"On a Streak",    desc:"5 consecutive trainings",     earned:true  },
            { icon:"⭐", label:"Star Employee",  desc:"5+ trainings complete",       earned:true  },
            { icon:"💯", label:"Perfect Score",  desc:"100% assessment score",       earned:false },
            { icon:"🏆", label:"Top of Class",   desc:"Batch mein #1 rank",          earned:false },
            { icon:"📚", label:"Knowledge Guru", desc:"10+ trainings complete",      earned:false },
          ].map(b=>(
            <div key={b.label} style={{ borderRadius:14, border:`1.5px solid ${b.earned?"#FDE68A":"#E4E7EC"}`, background:b.earned?"#FFFBEB":"#F4F6FA", padding:"12px 16px", textAlign:"center", minWidth:110, opacity:b.earned?1:0.5, position:"relative" }}>
              <div style={{ fontSize:26, marginBottom:6, filter:b.earned?"none":"grayscale(1)" }}>{b.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:b.earned?"#92400E":T.slateM }}>{b.label}</div>
              <div style={{ fontSize:10, color:T.slateL, marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
              {!b.earned && <div style={{ position:"absolute", inset:0, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:16 }}>🔒</span></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EmpTrainings({ myTrainings, onStart }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("all");
  const [mandatoryFilter, setMandatoryFilter] = useState("all"); // all | mandatory | optional
  const [sortBy,       setSortBy]       = useState("default");   // default | deadline | score | progress
  const [search,       setSearch]       = useState("");

  // ── Certificate Modal ──
  const [certTraining, setCertTraining] = useState(null);

  // ── Extension Modal ──
  const [extTraining,  setExtTraining]  = useState(null);
  const [extStep,      setExtStep]      = useState(1);   // 1=reason, 2=confirm, 3=done
  const [extReason,    setExtReason]    = useState("");
  const [extDate,      setExtDate]      = useState("");
  const [extNote,      setExtNote]      = useState("");

  const openExt = (t) => { setExtTraining(t); setExtStep(1); setExtReason(""); setExtDate(""); setExtNote(""); };

  // ── Filtered + sorted list ──
  const counts = {
    all:        myTrainings.length,
    "not-started": myTrainings.filter(t=>t.myStatus==="not-started").length,
    "in-progress": myTrainings.filter(t=>t.myStatus==="in-progress").length,
    completed:  myTrainings.filter(t=>t.myStatus==="completed").length,
  };

  let filtered = myTrainings.filter(t=>{
    if(statusFilter!=="all" && t.myStatus!==statusFilter) return false;
    if(typeFilter!=="all"   && t.type!==typeFilter) return false;
    if(mandatoryFilter==="mandatory" && !t.mandatory) return false;
    if(mandatoryFilter==="optional"  && t.mandatory)  return false;
    if(search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if(sortBy==="deadline") filtered = [...filtered].sort((a,b)=>new Date(a.deadline||"9999")-new Date(b.deadline||"9999"));
  if(sortBy==="score")    filtered = [...filtered].sort((a,b)=>(b.myScore||0)-(a.myScore||0));
  if(sortBy==="progress") filtered = [...filtered].sort((a,b)=>b.myPct-a.myPct);

  const usedTypes = [...new Set(myTrainings.map(t=>t.type))];

  return (
    <div className="fadeUp">

      {/* ─── Certificate Modal ─── */}
      {certTraining && (
        <div onClick={()=>setCertTraining(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:20, maxWidth:560, width:"100%", margin:24, boxShadow:"0 24px 80px rgba(0,0,0,0.25)", overflow:"hidden" }}>
            {/* Certificate display */}
            <div style={{ background:"linear-gradient(135deg,#0D1B45,#1447E6,#3B68F9)", padding:"40px 48px", textAlign:"center", position:"relative" }}>
              <div style={{ position:"absolute", inset:0, opacity:0.05, backgroundImage:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)", backgroundSize:"20px 20px" }}/>
              <div style={{ fontSize:52, marginBottom:10 }}>🏆</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, letterSpacing:"0.2em", fontWeight:700, marginBottom:6 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:13, marginBottom:16, opacity:0.7 }}>This is to certify that</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#FCD34D", fontSize:28, fontWeight:800, marginBottom:8, letterSpacing:"-0.5px" }}>Rahul Sharma</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginBottom:12 }}>has successfully completed</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:18, fontWeight:700, maxWidth:360, margin:"0 auto 16px", lineHeight:1.4 }}>{certTraining.title}</div>
              <div style={{ display:"flex", justifyContent:"center", gap:24, color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                <span>⭐ Score: {certTraining.myScore}%</span>
                <span>•</span>
                <span>📅 Completed: Mar 5, 2026</span>
                <span>•</span>
                <span>✅ {certTraining.myScore>=70?"PASSED":""}</span>
              </div>
              <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.15)", display:"flex", justifyContent:"center", gap:40 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.4)", paddingTop:6, color:"rgba(255,255,255,0.55)", fontSize:10 }}>Neha Agarwal — HR Head</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:18, marginBottom:2 }}>🤖</div>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.4)", paddingTop:6, color:"rgba(255,255,255,0.55)", fontSize:10 }}>LearnFlow Platform</div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div style={{ padding:"20px 32px", display:"flex", gap:10, justifyContent:"flex-end", borderTop:"1px solid #F1F5F9" }}>
              <Btn variant="white" onClick={()=>setCertTraining(null)}>Close</Btn>
              <Btn variant="white" onClick={()=>alert("🖨 Certificate sent to printer!")}>🖨 Print</Btn>
              <Btn onClick={()=>{ setCertTraining(null); alert("✅ Certificate downloaded as PDF!"); }}>⬇ Download PDF</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ─── Extension Request Modal ─── */}
      {extTraining && (
        <div onClick={()=>setExtTraining(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(5px)" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:18, maxWidth:480, width:"100%", margin:24, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#FFF7ED,#FFFBEB)", padding:"22px 28px", borderBottom:"1px solid #FDE68A", borderRadius:"18px 18px 0 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:26 }}>⏱</span>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:17, color:T.slate }}>Deadline Extension Request</div>
                  <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>{extTraining.title.substring(0,50)}...</div>
                </div>
              </div>
              {/* Step indicator */}
              <div style={{ display:"flex", gap:6, marginTop:16, alignItems:"center" }}>
                {[1,2,3].map(s=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12,
                      background:extStep>s?"#10B981":extStep===s?"#F59E0B":"#E4E7EC",
                      color:extStep>=s?"#fff":T.slateM }}>
                      {extStep>s?"✓":s}
                    </div>
                    <span style={{ fontSize:11, color:extStep===s?"#B54708":T.slateL, fontWeight:extStep===s?700:400 }}>
                      {["Reason","New Date","Confirm"][s-1]}
                    </span>
                    {s<3 && <div style={{ width:24, height:2, background:extStep>s?"#10B981":"#E4E7EC" }}/>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"24px 28px" }}>

              {/* Step 1: Reason */}
              {extStep===1 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.slate, marginBottom:12 }}>Extension kyun chahiye? *</div>
                  <div style={{ display:"grid", gap:8, marginBottom:16 }}>
                    {["Workload zyada tha — time nahi mila","Health issue ki wajah se complete nahi hua","Training material samajhne mein time laga","Project deadline clash ho gayi","Personal emergency aa gayi","Kuch aur wajah hai"].map(r=>(
                      <div key={r} onClick={()=>setExtReason(r)}
                        style={{ padding:"11px 14px", borderRadius:10, border:`1.5px solid ${extReason===r?"#F59E0B":"#E4E7EC"}`, background:extReason===r?"#FFFBEB":"#fff", cursor:"pointer", fontSize:13, color:extReason===r?"#92400E":T.slateM, fontWeight:extReason===r?600:400, transition:"all 0.12s" }}>
                        {extReason===r ? "● " : "○ "}{r}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtTraining(null)}>Cancel</Btn>
                    <Btn disabled={!extReason} onClick={()=>setExtStep(2)}>Next →</Btn>
                  </div>
                </div>
              )}

              {/* Step 2: New Date */}
              {extStep===2 && (
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.slate, marginBottom:4 }}>Naya deadline date choose karo *</div>
                  <div style={{ fontSize:12, color:T.slateL, marginBottom:16 }}>Current deadline: <strong>Apr 30, 2026</strong></div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                    {[["2026-05-15","May 15 (+15 days)"],["2026-05-31","May 31 (+31 days)"],["2026-06-15","Jun 15 (+46 days)"]].map(([d,label])=>(
                      <button key={d} onClick={()=>setExtDate(d)}
                        style={{ padding:"9px 16px", borderRadius:10, border:`1.5px solid ${extDate===d?"#F59E0B":"#E4E7EC"}`, background:extDate===d?"#FFFBEB":"#fff", color:extDate===d?"#92400E":T.slateM, fontSize:13, fontWeight:extDate===d?700:400, cursor:"pointer" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Ya custom date select karo</label>
                    <input type="date" value={extDate} onChange={e=>setExtDate(e.target.value)}
                      style={{ padding:"9px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, color:T.slate }}/>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:T.slateM, display:"block", marginBottom:6 }}>Additional note (optional)</label>
                    <textarea value={extNote} onChange={e=>setExtNote(e.target.value)} rows={2} placeholder="Manager ke liye koi extra detail..."
                      style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13, resize:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtStep(1)}>← Back</Btn>
                    <Btn disabled={!extDate} onClick={()=>setExtStep(3)}>Review Request →</Btn>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {extStep===3 && (
                <div>
                  <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:12, padding:"16px 18px", marginBottom:16 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:T.green, marginBottom:10 }}>📋 Request Summary</div>
                    {[["Training", extTraining.title.substring(0,45)+"..."],["Current Deadline","Apr 30, 2026"],["Requested Deadline", new Date(extDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})],["Reason", extReason]].map(([l,v])=>(
                      <div key={l} style={{ display:"flex", gap:12, padding:"6px 0", borderBottom:"1px solid #D1FAE5", fontSize:13 }}>
                        <span style={{ color:T.slateL, minWidth:140 }}>{l}</span>
                        <span style={{ color:T.slate, fontWeight:600 }}>{v}</span>
                      </div>
                    ))}
                    {extNote && <div style={{ marginTop:8, fontSize:12, color:T.slateM }}>Note: {extNote}</div>}
                  </div>
                  <div style={{ background:T.amberLight, border:"1px solid #FDE68A", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#92400E", marginBottom:20 }}>
                    ℹ️ Yeh request aapke manager aur HR ko jaayegi. Approval milne pe naya deadline set ho jaayega.
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}>
                    <Btn variant="white" onClick={()=>setExtStep(2)}>← Back</Btn>
                    <Btn variant="success" onClick={()=>{ setExtTraining(null); alert(`✅ Extension request submitted!\n\nAapke manager ko notification send ho gayi. Approval milne par aapko email aayega.`); }}>✓ Submit Request</Btn>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Filter Bar ─── */}
      <div style={{ background:"#fff", border:"1px solid #E4E7EC", borderRadius:14, padding:"16px 20px", marginBottom:20, display:"flex", gap:16, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>

        {/* Left: Search + Status */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Search */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trainings..." style={{ paddingLeft:32, paddingRight:12, paddingTop:7, paddingBottom:7, borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:13, width:190, color:T.slate }}/>
          </div>

          {/* Status filter pills */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["all","All",counts.all],["not-started","Not Started",counts["not-started"]],["in-progress","In Progress",counts["in-progress"]],["completed","Completed",counts.completed]].map(([id,label,cnt])=>(
              <button key={id} onClick={()=>setStatusFilter(id)}
                style={{ padding:"5px 13px", borderRadius:100, border:`1.5px solid ${statusFilter===id?T.indigoMid:"#E4E7EC"}`, background:statusFilter===id?T.indigoPale:"#fff", color:statusFilter===id?T.indigoMid:T.slateM, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {label} <span style={{ opacity:0.7 }}>({cnt})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Type + Mandatory + Sort */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          {/* Type filter */}
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:12, color:T.slateM, background:"#fff", cursor:"pointer" }}>
            <option value="all">All Types</option>
            {usedTypes.map(tid=>{
              const tt = TRAINING_TYPES.find(x=>x.id===tid);
              return <option key={tid} value={tid}>{tt?.icon} {tt?.label}</option>;
            })}
          </select>

          {/* Mandatory filter */}
          <select value={mandatoryFilter} onChange={e=>setMandatoryFilter(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:12, color:T.slateM, background:"#fff", cursor:"pointer" }}>
            <option value="all">All Priority</option>
            <option value="mandatory">🔴 Mandatory Only</option>
            <option value="optional">🟢 Optional Only</option>
          </select>

          {/* Sort */}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            style={{ padding:"6px 12px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:12, color:T.slateM, background:"#fff", cursor:"pointer" }}>
            <option value="default">Sort: Default</option>
            <option value="deadline">Sort: Deadline ↑</option>
            <option value="progress">Sort: Progress ↓</option>
            <option value="score">Sort: Score ↓</option>
          </select>
        </div>
      </div>

      {/* ─── Results count ─── */}
      {(search || statusFilter!=="all" || typeFilter!=="all" || mandatoryFilter!=="all") && (
        <div style={{ fontSize:12, color:T.slateL, marginBottom:12 }}>
          {filtered.length} training{filtered.length!==1?"s":""} found
          {search && <> for "<strong>{search}</strong>"</>}
          <button onClick={()=>{ setSearch(""); setStatusFilter("all"); setTypeFilter("all"); setMandatoryFilter("all"); setSortBy("default"); }}
            style={{ border:"none", background:"none", color:T.indigoMid, fontSize:12, cursor:"pointer", marginLeft:8, fontWeight:600 }}>✕ Clear filters</button>
        </div>
      )}

      {/* ─── Training Cards ─── */}
      {filtered.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:T.slateL }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:16, fontWeight:600, color:T.slateM }}>Koi training nahi mili</div>
          <div style={{ fontSize:13, marginTop:6 }}>Filters change karo ya search clear karo</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
          {filtered.map(t=>{
            const tt = TRAINING_TYPES.find(x=>x.id===t.type);
            const isCompleted = t.myStatus==="completed";
            return (
              <Card key={t.id} hover style={{ overflow:"hidden" }}>
                <div style={{ height:6, background:tt?.color||T.indigoMid }}/>
                <div style={{ padding:20 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
                    <TypeIcon type={t.type} size={44}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.slate, lineHeight:1.3, marginBottom:6 }}>{t.title}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <Badge color={tt?.color||T.indigoMid} bg={tt?.bg||T.indigoPale} size={10}>{tt?.icon} {tt?.label}</Badge>
                        <StatusBadge status={t.myStatus}/>
                        {t.mandatory && <Badge color={T.red} bg={T.redLight} size={10}>MANDATORY</Badge>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8, fontSize:12, color:T.slateL, marginBottom:12 }}>
                    <span>📄 {t.slides} slides</span>
                    <span>•</span>
                    <span>🤖 AI Avatar</span>
                    {t.myScore && <><span>•</span><span style={{ color:T.green, fontWeight:700 }}>⭐ {t.myScore}%</span></>}
                  </div>

                  {/* Progress bar — for in-progress only */}
                  {t.myStatus==="in-progress" && (
                    <div style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.slateL, marginBottom:4 }}>
                        <span>Progress</span><span style={{ fontWeight:700 }}>{t.myPct}%</span>
                      </div>
                      <ProgressBar pct={t.myPct} color={T.indigoLight}/>
                    </div>
                  )}

                  {/* Completed summary row */}
                  {isCompleted && (
                    <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", gap:14 }}>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, color:T.green, fontWeight:700 }}>{t.myScore}%</div>
                          <div style={{ fontSize:10, color:T.slateL }}>Score</div>
                        </div>
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, color:T.slate, fontWeight:700 }}>100%</div>
                          <div style={{ fontSize:10, color:T.slateL }}>Progress</div>
                        </div>
                      </div>
                      <Badge color={T.green} bg={T.greenLight} size={11}>✅ Completed</Badge>
                    </div>
                  )}

                  {/* Deadline for non-completed */}
                  {!isCompleted && (
                    <div style={{ fontSize:11, color:t.mandatory?T.red:T.slateL, fontWeight:t.mandatory?600:400, marginBottom:10 }}>
                      📅 Due: Apr 30, 2026{t.mandatory?" — Mandatory":""}</div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:8 }}>
                    {isCompleted ? (
                      <>
                        <Btn variant="success" size="sm" style={{ flex:1 }} onClick={()=>setCertTraining(t)}>🏆 View Certificate</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>setCertTraining(t)}>📊 My Score</Btn>
                      </>
                    ) : t.myStatus==="in-progress" ? (
                      <>
                        <Btn onClick={()=>onStart(t)} variant="ghost" size="sm" style={{ flex:1 }}>▶ Continue</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>openExt(t)}>⏱ Request Extension</Btn>
                      </>
                    ) : (
                      <>
                        <Btn onClick={()=>onStart(t)} variant="primary" size="sm" style={{ flex:1 }}>▶ Start Training</Btn>
                        <Btn variant="subtle" size="sm" onClick={()=>openExt(t)}>⏱ Request Extension</Btn>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Training Landing */
function TrainingLanding({ training, onStart, onExit }) {
  const slide = SLIDES[0];
  return (
    <div style={{ height:"100vh", position:"relative", overflow:"hidden", fontFamily:"'Inter',sans-serif" }}>
      {/* BG slide */}
      <div style={{ position:"absolute", inset:0, background:slide.gradient, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:160, opacity:0.08 }}>{slide.icon}</div>
      </div>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.55)" }}/>

      {/* Top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, padding:"16px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:2 }}>
        <button onClick={onExit} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", padding:"7px 16px", borderRadius:8, cursor:"pointer", fontSize:13, backdropFilter:"blur(8px)" }}>← Back</button>
        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:"6px 14px", backdropFilter:"blur(8px)" }}>
          <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{training.slides} slides • ~{training.slides*3} min</span>
        </div>
      </div>

      {/* Center content */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:2, padding:24, textAlign:"center" }}>
        <div style={{ marginBottom:12 }}>
          {training.mandatory && <Badge color="#FEF3C7" bg="rgba(245,158,11,0.25)" size={12}>⚠️ MANDATORY TRAINING</Badge>}
        </div>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:36, fontWeight:400, maxWidth:600, lineHeight:1.25, marginBottom:12, letterSpacing:"-0.5px" }}>{training.title}</h1>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:15, marginBottom:32, maxWidth:440 }}>AI Avatar Trainer slide-by-slide explain karegi. Beech mein questions pooch sakte ho.</p>
        <button onClick={onStart} style={{ background:T.indigoMid, color:"#fff", border:"none", padding:"16px 48px", borderRadius:14, fontSize:17, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 32px rgba(67,56,202,0.4)", transition:"all 0.2s", letterSpacing:"-0.3px" }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04)"; e.currentTarget.style.background=T.indigo; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background=T.indigoMid; }}>
          ▶ Start Training
        </button>
        {training.myPct>0 && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:12 }}>Resume from Slide {training.mySlide} ({training.myPct}% done)</div>}
      </div>

      {/* Avatar — bottom right */}
      <div style={{ position:"absolute", bottom:0, right:60, zIndex:3, textAlign:"center" }}>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:8, background:"rgba(0,0,0,0.4)", borderRadius:100, padding:"4px 14px", backdropFilter:"blur(8px)" }}>👩‍🏫 Priya — Your AI Trainer</div>
        <div style={{ width:120, height:140, background:`linear-gradient(180deg,${T.indigoPale} 0%,${T.indigoPale} 60%,transparent)`, borderRadius:"60px 60px 0 0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:72, animation:"fadeUp 0.6s ease" }}>👩‍💼</div>
      </div>
    </div>
  );
}

/* Training Room */
function TrainingRoom({ training, onAssessment, onExit }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [speaking, setSpeaking] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [slideReady, setSlideReady] = useState(false);

  const slide = SLIDES[Math.min(slideIdx, SLIDES.length-1)];
  const isLast = slideIdx >= SLIDES.length-1;

  useEffect(() => {
    setSpeaking(true); setSlideReady(false); setAnswer(null); setShowAsk(false);
    const t = setTimeout(()=>{ setSpeaking(false); setSlideReady(true); }, 3000);
    return ()=>clearTimeout(t);
  }, [slideIdx]);

  const askQ = () => {
    if(!question.trim()) return;
    setThinking(true); setAnswer(null);
    setTimeout(()=>{
      const ans = {
        "salary":"Company mein compensation bands HR se confirm karein. Probation period 6 months hota hai.",
        "leave":"18 paid leaves per year milti hain, 5 sick leaves alag se. Leave portal pe apply karo.",
        "laptop":"IT helpdesk se Day 1 pe mil jaata hai. Extension 1100 pe call karo.",
        "dress code":"Business casual on weekdays. Fridays casual allowed hai.",
      };
      let resp = `Bahut accha sawaal! ${slide.title} ke baare mein: ${slide.bullets[0]}. Iske baare mein aur detail chahiye to slides padho ya HR se contact karo.`;
      Object.entries(ans).forEach(([k,v])=>{ if(question.toLowerCase().includes(k)) resp=v; });
      setAnswer(resp); setThinking(false); setQuestion("");
    }, 1800);
  };

  return (
    <div style={{ height:"100vh", background:"#0F172A", display:"flex", flexDirection:"column", fontFamily:"'Inter',sans-serif", overflow:"hidden" }}>
      <style>{`@keyframes wave{0%{height:4px}100%{height:20px}}`}</style>

      {/* Top bar */}
      <div style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <button onClick={()=>{ if(window.confirm("Progress save ho jaayega. Exit?")) onExit(); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontSize:13 }}>← Exit & Save</button>
        <div style={{ textAlign:"center" }}>
          <div style={{ color:"#E4E7EC", fontWeight:600, fontSize:14 }}>{training.title.substring(0,48)}</div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginTop:2 }}>Slide {slideIdx+1} of {SLIDES.length}: {slide.title}</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>⏱ 08:32</span>
          <button onClick={()=>setPaused(p=>!p)} style={{ background:"rgba(255,255,255,0.08)", border:"none", color:"#A5B4FC", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>{paused?"▶ Resume":"⏸ Pause"}</button>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", color:"#fff" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⏸</div>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:400, marginBottom:8 }}>Training Paused</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", marginBottom:24 }}>Aapki progress save ho gayi</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <Btn onClick={()=>setPaused(false)} size="lg">▶ Resume</Btn>
              <Btn variant="ghost" onClick={onExit} size="lg" style={{ color:"rgba(255,255,255,0.5)", borderColor:"rgba(255,255,255,0.2)" }}>Exit & Save</Btn>
            </div>
          </div>
        </div>
      )}

      {/* 3-panel layout */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Left: Slide */}
        <div style={{ flex:1, padding:24, display:"flex", flexDirection:"column", gap:16, overflowY:"auto" }}>
          {/* Slide card */}
          <div style={{ borderRadius:12, overflow:"hidden", flexShrink:0, border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ height:180, background:slide.gradient, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ fontSize:80, opacity:0.3 }}>{slide.icon}</div>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#fff", fontSize:26, textAlign:"center", padding:20, fontWeight:400 }}>{slide.title}</h2>
              </div>
              <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"4px 10px", fontSize:11, color:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)" }}>
                Slide {slideIdx+1}/{SLIDES.length}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.04)", padding:"16px 20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {slide.bullets.map((b,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"8px 10px" }}>
                    <span style={{ color:T.indigoLight, fontWeight:700, flexShrink:0 }}>•</span>
                    <span style={{ color:"#CBD5E1", fontSize:12, lineHeight:1.5 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick reactions */}
          {slideReady && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", animation:"fadeIn 0.4s ease" }}>
              {[["👍 Samajh aaya",()=>{}],["😕 Dobara explain karo",()=>setAnswer(`Bilkul! ${slide.bullets.join(". ")}`)],["💡 Example chahiye",()=>setAnswer(`Ek example: ${slide.bullets[1]}`)],["⏭ Next slide",()=>{ if(!isLast) setSlideIdx(i=>i+1); else onAssessment(); }]].map(([label,action])=>(
                <button key={label} onClick={action} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", padding:"7px 14px", borderRadius:100, fontSize:12, cursor:"pointer", fontWeight:600, transition:"all 0.15s" }}>{label}</button>
              ))}
            </div>
          )}

          {/* Ask question */}
          {slideReady && (
            <div>
              {!showAsk ? (
                <button onClick={()=>setShowAsk(true)} style={{ background:"rgba(99,102,241,0.2)", border:"1.5px solid rgba(99,102,241,0.4)", color:"#A5B4FC", padding:"10px 20px", borderRadius:12, cursor:"pointer", fontSize:14, fontWeight:600, animation:"fadeIn 0.5s ease", width:"100%" }}>
                  ❓ Avatar se question poocho
                </button>
              ) : (
                <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:14 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askQ()} placeholder="Priya se kuch bhi poocho..." style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(99,102,241,0.35)", borderRadius:10, padding:"9px 14px", color:"#E4E7EC", fontSize:13 }}/>
                    <button onClick={askQ} style={{ background:T.indigoMid, border:"none", color:"#fff", padding:"9px 16px", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:700 }}>➤</button>
                  </div>
                  {thinking && (
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, color:"#94A3B8", fontSize:13 }}>
                      <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${T.indigoLight}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }}/>
                      Priya soch rahi hai...
                    </div>
                  )}
                  {answer && (
                    <div style={{ marginTop:10, background:"rgba(99,102,241,0.15)", borderRadius:10, padding:"12px 14px", animation:"fadeIn 0.3s ease" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:16 }}>👩‍💼</span>
                        <span style={{ color:"#A5B4FC", fontSize:12, fontWeight:700 }}>Priya ka jawab:</span>
                      </div>
                      <div style={{ color:"#CBD5E1", fontSize:13, lineHeight:1.7 }}>{answer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Avatar */}
        <div style={{ width:280, background:"rgba(255,255,255,0.02)", borderLeft:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", padding:20, flexShrink:0 }}>
          {/* Avatar card */}
          <div style={{ background:"rgba(99,102,241,0.1)", borderRadius:12, padding:20, border:`1px solid rgba(99,102,241,0.2)`, marginBottom:16, textAlign:"center", animation:speaking?"pulse 2s infinite":"none" }}>
            <div style={{ fontSize:64, marginBottom:12 }}>👩‍💼</div>
            <div style={{ color:"#E4E7EC", fontWeight:700, fontSize:14, marginBottom:2 }}>Priya</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginBottom:12 }}>AI Trainer</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
              <WaveAnim active={speaking && !paused}/>
            </div>
            <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px", textAlign:"left" }}>
              <div style={{ color:"#CBD5E1", fontSize:12, lineHeight:1.7, fontStyle:"italic" }}>
                {speaking ? `"Ab hum ${slide.title} ke baare mein baat karenge..."` : `"${slide.bullets[0].substring(0,60)}..."`}
              </div>
            </div>
          </div>

          {/* Slide outline */}
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, fontWeight:700, letterSpacing:"0.1em", marginBottom:12 }}>COURSE OUTLINE</div>
            {SLIDES.map((s,i)=>(
              <div key={s.id} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, marginTop:1,
                  background:i<slideIdx?"#10B981":i===slideIdx?T.indigoMid:"rgba(255,255,255,0.1)",
                  color:i<=slideIdx?"#fff":"rgba(255,255,255,0.3)" }}>
                  {i<slideIdx?"✓":i+1}
                </div>
                <div style={{ fontSize:11, color:i===slideIdx?"#E4E7EC":i<slideIdx?"#64748B":"rgba(255,255,255,0.3)", fontWeight:i===slideIdx?700:400, lineHeight:1.4 }}>{s.title}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div style={{ paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:6 }}>
              <span>Progress</span><span style={{ fontWeight:700, color:T.indigoLight }}>{Math.round(slideIdx/SLIDES.length*100)}%</span>
            </div>
            <ProgressBar pct={slideIdx/SLIDES.length*100} color={T.indigoLight} bg="rgba(255,255,255,0.08)" height={5}/>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ background:"rgba(255,255,255,0.04)", borderTop:"1px solid rgba(255,255,255,0.08)", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <button onClick={()=>slideIdx>0&&setSlideIdx(i=>i-1)} disabled={slideIdx===0}
          style={{ background:"rgba(255,255,255,0.07)", border:"none", color:slideIdx===0?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.65)", padding:"9px 20px", borderRadius:10, cursor:slideIdx===0?"not-allowed":"pointer", fontSize:13, fontWeight:600 }}>◀ Previous</button>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={()=>setAutoplay(a=>!a)} style={{ background:autoplay?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.07)", border:"none", color:autoplay?"#A5B4FC":"rgba(255,255,255,0.45)", padding:"9px 16px", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:600 }}>↺ Autoplay {autoplay?"ON":"OFF"}</button>
        </div>
        <button onClick={()=>{ if(isLast) onAssessment(); else setSlideIdx(i=>i+1); }} disabled={!slideReady}
          style={{ background:slideReady?T.indigoMid:"rgba(255,255,255,0.07)", border:"none", color:slideReady?"#fff":"rgba(255,255,255,0.3)", padding:"9px 24px", borderRadius:10, cursor:slideReady?"pointer":"not-allowed", fontSize:13, fontWeight:700, transition:"all 0.2s" }}>
          {isLast?"Assessment →":"Next ▶"}
        </button>
      </div>
    </div>
  );
}

/* Assessment */
function AssessmentScreen({ training, onDone }) {
  const [phase, setPhase] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(1200);

  useEffect(()=>{
    if(phase!=="quiz") return;
    const t = setInterval(()=>setTimer(s=>s>0?s-1:0),1000);
    return()=>clearInterval(t);
  },[phase]);

  const fmt = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const score = Object.entries(answers).filter(([qi,ai])=>ASSESS_QS[qi]?.ans===ai).length;
  const q = ASSESS_QS[qIdx];

  if(phase==="intro") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0B1120,#1447E6)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif" }}>
      <Card style={{ maxWidth:480, width:"100%", padding:36, textAlign:"center", margin:24 }} className="fadeUp">
        <div style={{ fontSize:56, marginBottom:16 }}>📝</div>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, color:T.slate, fontWeight:700, marginBottom:8 }}>Time for Assessment!</h2>
        <p style={{ color:T.slateL, fontSize:14, marginBottom:24 }}>{training.title}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {[["📝 Questions","5"],["⏱ Time Limit","20 min"],["🎯 Pass Score","70%"],["🔄 Retakes","1 allowed"]].map(([l,v])=>(
            <div key={l} style={{ background:T.bg, borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:12, color:T.slateL }}>{l}</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, marginTop:2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <Btn onClick={()=>setPhase("quiz")} size="lg" full>Start Assessment →</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column", fontFamily:"'Inter',sans-serif" }}>
      {/* Top */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:600, color:T.slateM, fontSize:14 }}>Question {qIdx+1} of {ASSESS_QS.length}</div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:timer<300?T.red:T.slate, fontWeight:700 }}>{fmt(timer)}</div>
        <button style={{ background:T.redLight, border:"none", color:T.red, padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}>✗ Quit</button>
      </div>
      {/* Navigator */}
      <div style={{ display:"flex", gap:8, padding:"14px 24px", justifyContent:"center" }}>
        {ASSESS_QS.map((_,i)=>(
          <div key={i} onClick={()=>setQIdx(i)} style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:13, fontWeight:700, transition:"all 0.15s",
            background:i===qIdx?T.indigoMid:answers[i]!==undefined?T.green:"#fff",
            color:i===qIdx||answers[i]!==undefined?"#fff":T.slateM,
            border:`2px solid ${i===qIdx?T.indigoLight:answers[i]!==undefined?"transparent":"#E4E7EC"}` }}>
            {answers[i]!==undefined&&i!==qIdx?"✓":i+1}
          </div>
        ))}
      </div>
      {/* Question */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ maxWidth:600, width:"100%" }} className="fadeIn">
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <Badge color={T.indigoMid} bg={T.indigoPale}>Q{qIdx+1}</Badge>
            <Badge color="#7C3AED" bg="#EDE9FE">MCQ</Badge>
          </div>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:T.slate, fontWeight:700, marginBottom:24, lineHeight:1.4 }}>{q.q}</div>
          <div style={{ display:"grid", gap:10 }}>
            {q.opts.map((opt,i)=>(
              <div key={i} onClick={()=>setAnswers({...answers,[qIdx]:i})}
                style={{ padding:"16px 18px", borderRadius:14, cursor:"pointer", fontSize:14, fontWeight:500, transition:"all 0.15s",
                  background:answers[qIdx]===i?T.indigoPale:"#fff",
                  color:answers[qIdx]===i?T.indigoMid:T.slateM,
                  border:`1.5px solid ${answers[qIdx]===i?T.indigoMid:"#E4E7EC"}` }}
                onMouseEnter={e=>{ if(answers[qIdx]!==i) e.currentTarget.style.borderColor="#C7D2FE"; }}
                onMouseLeave={e=>{ if(answers[qIdx]!==i) e.currentTarget.style.borderColor="#E4E7EC"; }}>
                <span style={{ fontWeight:700, marginRight:10, color:answers[qIdx]===i?T.indigoMid:"#CBD5E1" }}>{String.fromCharCode(65+i)}.</span>
                {opt}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
            <Btn variant="white" onClick={()=>setQIdx(q=>Math.max(0,q-1))} disabled={qIdx===0}>← Previous</Btn>
            {qIdx<ASSESS_QS.length-1
              ? <Btn onClick={()=>setQIdx(q=>q+1)} disabled={answers[qIdx]===undefined}>Next Question →</Btn>
              : <Btn variant="success" onClick={()=>onDone(score)} disabled={Object.keys(answers).length<ASSESS_QS.length}>Submit Assessment ✓</Btn>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* Result */
function ResultScreen({ training, onDone }) {
  const score = training.finalScore || 3;
  const total = ASSESS_QS.length;
  const pct = Math.round(score/total*100);
  const passed = pct >= 70;
  const isPerfect = pct === 100;
  const isFast = true; // mock

  return (
    <div style={{ minHeight:"100vh", background:passed?`linear-gradient(135deg,#064E3B,#065F46)`:`linear-gradient(135deg,#7F1D1D,#991B1B)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',sans-serif", padding:24, overflowY:"auto" }}>
      <div style={{ textAlign:"center", color:"#fff", maxWidth:520, width:"100%" }} className="fadeUp">
        <div style={{ fontSize:72, marginBottom:16, animation:"bounceIn 0.6s ease" }}>{passed?"🏆":"😔"}</div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:36, fontWeight:400, marginBottom:8 }}>{passed?"Congratulations!":"Try Again!"}</div>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:15, marginBottom:24 }}>
          {passed?"Training successfully complete ki! Certificate download karo.":"Pass karne ke liye 70% chahiye tha."}
        </p>

        {/* Score card */}
        <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"24px 36px", marginBottom:20, backdropFilter:"blur(12px)" }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:68, fontWeight:400, marginBottom:4, letterSpacing:"-2px" }}>{score}/{total}</div>
          <div style={{ fontSize:18, opacity:0.8, marginBottom:12 }}>{pct}% Score</div>
          <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:14, fontWeight:700, padding:"6px 20px", borderRadius:100 }}>{passed?"✅ PASSED":"❌ NEEDS IMPROVEMENT"}</span>
          {passed && <div style={{ marginTop:12, fontSize:13, opacity:0.7 }}>Better than 68% of your colleagues!</div>}
        </div>

        {/* Rewards earned — only if passed */}
        {passed && (
          <div style={{ background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(251,191,36,0.4)", borderRadius:14, padding:"20px 24px", marginBottom:20, backdropFilter:"blur(8px)", animation:"fadeIn 0.6s 0.3s ease both", textAlign:"left" }}>
            <div style={{ fontWeight:700, fontSize:15, color:"#FCD34D", marginBottom:16, textAlign:"center", display:"flex", gap:8, alignItems:"center", justifyContent:"center" }}>
              <span>🎖️</span> Rewards Earned
            </div>

            {/* Points */}
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <div style={{ flex:1, background:"rgba(245,158,11,0.2)", borderRadius:12, padding:"12px 16px", textAlign:"center", border:"1px solid rgba(245,158,11,0.3)" }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, color:"#FCD34D" }}>+100</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>⭐ Points Earned</div>
              </div>
              {isPerfect && (
                <div style={{ flex:1, background:"rgba(245,158,11,0.2)", borderRadius:12, padding:"12px 16px", textAlign:"center", border:"1px solid rgba(245,158,11,0.3)" }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, color:"#FCD34D" }}>+50</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>💯 Perfect Score Bonus</div>
                </div>
              )}
              {isFast && (
                <div style={{ flex:1, background:"rgba(245,158,11,0.2)", borderRadius:12, padding:"12px 16px", textAlign:"center", border:"1px solid rgba(245,158,11,0.3)" }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, color:"#FCD34D" }}>+50</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>🚀 First Completer Bonus</div>
                </div>
              )}
            </div>

            {/* Badges unlocked */}
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontWeight:700, letterSpacing:"0.08em", marginBottom:10 }}>BADGES UNLOCKED</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[
                { icon:"🚀", label:"Fast Learner", desc:"Top 10% mein" },
                ...(isPerfect ? [{ icon:"💯", label:"Perfect Score", desc:"100% accuracy" }] : []),
                { icon:"🔥", label:"On a Streak", desc:"3rd training done" },
              ].map(b=>(
                <div key={b.label} style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(251,191,36,0.35)", borderRadius:10, padding:"8px 14px", display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:20 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#FCD34D" }}>{b.label}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Leaderboard rank */}
            <div style={{ marginTop:14, background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:18 }}>📊</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Current Leaderboard Rank</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>This training mein</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, color:"#FCD34D" }}>#2</div>
            </div>
          </div>
        )}

        {/* Answer review */}
        <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:14, padding:18, marginBottom:22, textAlign:"left", backdropFilter:"blur(8px)" }}>
          <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>Quick Review</div>
          {ASSESS_QS.slice(0,3).map((q,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:8, fontSize:12, color:"rgba(255,255,255,0.7)" }}>
              <span>{i===0||i===2?"✅":"❌"}</span>
              <span style={{ opacity:0.8 }}>{q.q.substring(0,44)}...</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          {passed && <button onClick={()=>alert("🏆 Certificate downloaded! (PDF saved to your device)")} style={{ background:"#F59E0B", color:"#1C1917", border:"none", padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer" }}>🏆 Download Certificate</button>}
          <button onClick={onDone} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"1.5px solid rgba(255,255,255,0.3)", padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {passed?"Back to Dashboard":"Retry Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmpReports() {
  return (
    <div className="fadeUp">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
        {[["✅ Completed","2",T.green,T.greenLight],["⏱ Hours Trained","6.5h",T.blue,T.blueLight],["📊 Avg Score","87.5%",T.amber,T.amberLight]].map(([l,v,c,bg])=>(
          <Card key={l} style={{ padding:20, textAlign:"center" }}>
            <div style={{ width:44, height:44, borderRadius:14, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 10px" }}>{l[0]}</div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:30, color:c }}>{v}</div>
            <div style={{ fontSize:12, color:T.slateL, marginTop:3 }}>{l.split(" ").slice(1).join(" ")}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:24 }}>
        <div style={{ fontWeight:700, fontSize:15, color:T.slate, marginBottom:20 }}>My Training History</div>
        {[{title:"Effective Communication & Presentation",type:"softskills",date:"Mar 5, 2026",score:84,time:"2h 10m"},{title:"Data Privacy & GDPR Compliance",type:"compliance",date:"Feb 20, 2026",score:91,time:"1h 45m"}].map((r,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:i<1?"1px solid #F1F5F9":"none" }}>
            <TypeIcon type={r.type} size={44}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:T.slate }}>{r.title}</div>
              <div style={{ fontSize:12, color:T.slateL, marginTop:2 }}>Completed: {r.date} • Time spent: {r.time}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:T.green }}>{r.score}%</div>
              <Badge color={T.green} bg={T.greenLight} size={10}>✅ PASSED</Badge>
            </div>
            <Btn variant="ghost" size="sm" onClick={()=>alert("🏆 Certificate downloaded!")}>🏆 Certificate</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [role, setRole] = useState(null);
  if(!role) return <RoleSelector onSelect={setRole}/>;
  if(role==="admin") return <AdminPanel onExit={()=>setRole(null)}/>;
  return <EmployeePanel onExit={()=>setRole(null)}/>;
}
