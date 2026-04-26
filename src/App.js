import { useState, useEffect, useRef } from "react";

const SAMPLE_JD = `We are looking for a Senior Full Stack Engineer to join our product team. 

Requirements:
- 5+ years of experience with React, Node.js, and TypeScript
- Experience with cloud platforms (AWS or GCP)
- Familiarity with PostgreSQL and Redis
- Strong understanding of REST APIs and microservices
- Experience with CI/CD pipelines (GitHub Actions preferred)
- Bonus: Machine Learning or AI integration experience

Responsibilities:
- Build and maintain scalable web applications
- Collaborate with design and product teams
- Mentor junior developers
- Participate in architecture decisions

Location: Remote-first. Startup environment. Competitive equity.`;

const MOCK_CANDIDATES = [
  { id:1, name:"Arjun Mehta", title:"Senior Software Engineer", location:"Bangalore, India", avatar:"AM", skills:["React","Node.js","TypeScript","AWS","PostgreSQL","Redis","Docker"], experience:"6 years", summary:"Full-stack engineer at a Series B startup. Led migration of monolith to microservices. Open to remote opportunities." },
  { id:2, name:"Priya Sharma", title:"Lead Frontend Engineer", location:"Mumbai, India", avatar:"PS", skills:["React","TypeScript","GraphQL","GCP","PostgreSQL","CI/CD"], experience:"7 years", summary:"Led a team of 5 engineers at a fintech. Passionate about AI/ML integrations and developer tooling." },
  { id:3, name:"Rohan Das", title:"Full Stack Developer", location:"Hyderabad, India", avatar:"RD", skills:["React","Python","Node.js","AWS","Redis","GitHub Actions"], experience:"4 years", summary:"Working at a product startup. Built ML-powered features for e-commerce. Looking to grow into a senior role." },
  { id:4, name:"Sneha Kulkarni", title:"Backend Engineer", location:"Pune, India", avatar:"SK", skills:["Node.js","TypeScript","PostgreSQL","Redis","AWS","Microservices"], experience:"5 years", summary:"Backend specialist, deep in microservices and distributed systems. Interested in full-stack opportunities." },
  { id:5, name:"Divya Rao", title:"Full Stack Engineer", location:"Delhi, India", avatar:"DR", skills:["React","Node.js","TypeScript","GCP","PostgreSQL","Microservices","CI/CD"], experience:"6 years", summary:"Built and scaled two SaaS platforms. Loves remote-first culture and async collaboration." },
  { id:6, name:"Karthik Iyer", title:"Cloud & Backend Engineer", location:"Coimbatore, India", avatar:"KI", skills:["AWS","Node.js","TypeScript","Redis","Docker","GitHub Actions","Kubernetes"], experience:"5 years", summary:"Architected multi-tenant AWS infrastructure. Strong in DevOps and backend engineering." },
  { id:7, name:"Pooja Nair", title:"Senior Software Engineer", location:"Kochi, India", avatar:"PN", skills:["React","TypeScript","Node.js","Redis","AWS","Microservices","Docker"], experience:"6 years", summary:"6 years at a Series A health-tech. Led API redesign and improved system throughput by 40%." },
  { id:8, name:"Deepak Kumar", title:"AI-Integrated Engineer", location:"Chandigarh, India", avatar:"DK", skills:["Python","Node.js","React","AWS","PostgreSQL","TensorFlow","GitHub Actions"], experience:"5 years", summary:"Specialist in AI-integrated products. Led integration of GPT-based features into a B2B SaaS platform." },
  { id:9, name:"Rahul Saxena", title:"Platform Engineer", location:"Noida, India", avatar:"RS", skills:["Node.js","TypeScript","PostgreSQL","GCP","CI/CD","Kubernetes","Redis"], experience:"7 years", summary:"Platform-layer expert. Designed CI/CD pipelines that cut deployment time by 60% at a fintech startup." },
];

const REQUIRED_SKILLS = ["React","Node.js","TypeScript","AWS","GCP","PostgreSQL","Redis","GitHub Actions","CI/CD","Microservices"];

const QUESTION_POOLS = [
  [
    "Are you currently open to exploring new opportunities?",
    "How do you handle competing deadlines in a fast-paced environment?",
    "Would a fully remote setup work well for you?",
    "Have you ever guided a junior developer through a production incident?",
    "What's your experience with scaling backend systems?",
    "How do you approach taking full ownership of features end-to-end?",
    "Do you enjoy working closely with design and product teams?",
  ],
  [
    "Are you actively exploring new roles right now?",
    "How comfortable are you shipping fast and iterating on feedback?",
    "Are you set up well for async, remote collaboration?",
    "Have you worked on microservices architecture before?",
    "What's your approach to code quality and testing?",
    "How do you handle technical debt in a growing codebase?",
    "What excites you most about building at an early-stage company?",
  ],
  [
    "Would this be a good time for you to consider a role switch?",
    "Have you worked in a high-growth environment before?",
    "Do you prefer remote work or do you need an office setup?",
    "Tell me about your experience with DevOps and CI/CD pipelines.",
    "How do you approach picking up new technologies quickly?",
    "What's your strongest area — frontend, backend, or full-stack?",
    "Are you comfortable with equity as part of a compensation package?",
  ],
  [
    "Are you passively or actively looking for new opportunities?",
    "What's your comfort level with startup pace and uncertainty?",
    "Would a fully remote role fit your current lifestyle?",
    "What's been your biggest technical win in a recent project?",
    "How do you approach architecture decisions collaboratively?",
    "What does a healthy engineering culture look like to you?",
    "How do you stay updated with changes in the industry?",
  ],
];

function getQuestionsForCandidate(idx) {
  return QUESTION_POOLS[idx % QUESTION_POOLS.length];
}

function computeMatchScore(candidate) {
  const matched = candidate.skills.filter(s =>
    REQUIRED_SKILLS.some(r => r.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()))
  );
  const base = Math.round((matched.length / REQUIRED_SKILLS.length) * 100);
  const expYears = parseInt(candidate.experience);
  const expBonus = expYears >= 5 ? 10 : expYears >= 3 ? 5 : 0;
  return Math.min(100, base + expBonus);
}

function getMatchedSkills(candidate) {
  return candidate.skills.filter(s =>
    REQUIRED_SKILLS.some(r => r.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()))
  );
}

function getMissingSkills(candidate) {
  return REQUIRED_SKILLS.filter(r =>
    !candidate.skills.some(s => s.toLowerCase() === r.toLowerCase() || s.toLowerCase().includes(r.toLowerCase()))
  ).slice(0, 3);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Small reusable components ──────────────────────────────────────────────

function Avatar({ name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#00ff88,#00d4ff)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color: "#0a0a0f", flexShrink: 0,
    }}>
      {name.slice(0, 2)}
    </div>
  );
}

function SkillTag({ label, color }) {
  return (
    <span style={{
      fontSize: 10, padding: "3px 8px", borderRadius: 4,
      background: `${color}14`, border: `1px solid ${color}30`,
      color, fontWeight: 500,
    }}>{label}</span>
  );
}

function ScorePill({ val, color }) {
  return (
    <div style={{
      padding: "4px 10px", borderRadius: 100,
      background: `${color}14`, border: `1px solid ${color}30`,
      fontSize: 12, color, fontWeight: 600,
    }}>{val}%</div>
  );
}

function ScoreRow({ label, val, fillClass, bold }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: bold ? "#e2e8f0" : "#4a5568", marginBottom: 4, fontWeight: bold ? 600 : 400 }}>
        <span>{label}</span><span>{val != null ? `${val}%` : "—"}</span>
      </div>
      <div style={{ height: 5, background: "#1a1f2e", borderRadius: 3, overflow: "hidden" }}>
        <div className={fillClass} style={{ width: val != null ? `${val}%` : "0%", height: "100%", borderRadius: 3 }} />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 10, color: "#4a5568" }}>{label}</span>
    </div>
  );
}

function ProcessingHeader({ step }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%", background: "#00ff88",
              animation: `pulseDot 1.2s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: "#00ff88", letterSpacing: ".1em", textTransform: "uppercase" }}>{step}</span>
      </div>
      <div style={{ height: 2, background: "#1a1f2e", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#00ff88,#00d4ff)", borderRadius: 2, animation: "processingBar 2.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function PipelineStats() {
  const stats = [
    { icon: "🔍", label: "JD Parsing", desc: "Extracts required skills, seniority level, location, and bonus criteria from free-text job descriptions.", val: "9 fields", sub: "Auto-structured", accent: "#00ff88", bars: [{ w: 92, c: "#00ff88" }, { w: 74, c: "#00d4ff" }, { w: 85, c: "#00ff88" }], detail: "React · Node.js · TypeScript · AWS · GCP · Redis · PostgreSQL" },
    { icon: "🎯", label: "Candidate Scoring", desc: "Each candidate is scored against extracted JD criteria — skill overlap, years of experience, and seniority fit.", val: "9 profiles", sub: "Ranked by fit", accent: "#00d4ff", bars: [{ w: 88, c: "#00d4ff" }, { w: 65, c: "#00ff88" }, { w: 72, c: "#00d4ff" }], detail: "Skills × Experience × Seniority" },
    { icon: "💬", label: "Conversational Outreach", desc: "7 tailored questions are asked per candidate. Responses are scored to gauge genuine interest and availability.", val: "7 Q&A rounds", sub: "Per candidate", accent: "#ff6b35", bars: [{ w: 80, c: "#ff6b35" }, { w: 90, c: "#ff6b35" }, { w: 60, c: "#ff0080" }], detail: "Availability · Culture fit · Role appetite" },
    { icon: "📊", label: "Ranked Shortlist", desc: "Match score (55%) and interest score (45%) are blended into a final rank. Export or share results instantly.", val: "Combined score", sub: "Match 55% · Interest 45%", accent: "#9b59b6", bars: [{ w: 95, c: "#9b59b6" }, { w: 80, c: "#00ff88" }, { w: 88, c: "#9b59b6" }], detail: "Shortlist ready in seconds" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 36 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: "rgba(255,255,255,.025)", border: "1px solid rgba(0,255,136,.1)",
          borderRadius: 10, padding: "20px 18px", position: "relative", overflow: "hidden",
          transition: "border-color .25s, background .25s", cursor: "default",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,.35)"; e.currentTarget.style.background = "rgba(0,255,136,.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,255,136,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.025)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{s.label}</span>
          </div>
          <p style={{ fontSize: 10, color: "#4a5568", lineHeight: 1.65, marginBottom: 14 }}>{s.desc}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
            {s.bars.map((b, bi) => (
              <div key={bi} style={{ height: 3, background: "#1a1f2e", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${b.w}%`, height: "100%", background: b.c, borderRadius: 2, opacity: 0.55 + bi * 0.2 }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: s.accent, fontWeight: 600, marginBottom: 2, letterSpacing: ".05em" }}>{s.val}</div>
          <div style={{ fontSize: 9, color: "#2d3748", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{s.sub}</div>
          <div style={{ fontSize: 9, color: "#4a5568", padding: "5px 8px", background: "rgba(255,255,255,.02)", borderRadius: 4, border: "1px solid rgba(255,255,255,.04)" }}>{s.detail}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function TalentScoutAgent() {
  const [phase, setPhase] = useState("landing");
  const [jd, setJd] = useState(SAMPLE_JD);
  const [parsedJD, setParsedJD] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [engagingIdx, setEngagingIdx] = useState(0);
  const [interestScores, setInterestScores] = useState({});
  const [chatLogs, setChatLogs] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [log, setLog] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingChat, setViewingChat] = useState(null);
  const [processingStep, setProcessingStep] = useState("");
  const chatRef = useRef(null);
  const logRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chatLogs, isTyping]);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  function addLog(msg) {
    setLog(prev => [...prev, { msg, time: new Date().toLocaleTimeString() }]);
  }

  async function startAgent() {
    setPhase("parsing"); setProcessingStep("Parsing Job Description");
    addLog("🔍 Parsing Job Description...");
    await sleep(1400);

    const parsed = {
      role: "Senior Full Stack Engineer",
      skills: ["React", "Node.js", "TypeScript", "AWS/GCP", "PostgreSQL", "Redis", "CI/CD"],
      experience: "5+ years", location: "Remote",
      bonus: ["Microservices Architecture", "System Design"],
    };
    setParsedJD(parsed);
    addLog("✅ JD parsed. Extracted 7 skills, seniority: Senior.");
    await sleep(600);

    setPhase("discovering"); setProcessingStep("Discovering Candidates");
    addLog("🌐 Searching candidate pool...");
    await sleep(1200);

    const scored = MOCK_CANDIDATES.map(c => ({ ...c, matchScore: computeMatchScore(c) }))
      .sort((a, b) => b.matchScore - a.matchScore);
    setCandidates(scored);
    addLog(`✅ Found ${scored.length} candidates. Top: ${scored[0].name} (${scored[0].matchScore}%)`);
    await sleep(600);

    setPhase("engaging"); setProcessingStep("Running Outreach");
    addLog("💬 Starting conversational outreach...");
    await beginOutreach(scored, 0);
  }

  async function beginOutreach(cands, idx) {
    if (idx >= cands.length) {
      setPhase("results"); setProcessingStep("");
      addLog("🏁 All candidates engaged. Shortlist ready.");
      return;
    }
    const c = cands[idx];
    setEngagingIdx(idx);
    addLog(`📩 Engaging ${c.name}...`);
    const questions = getQuestionsForCandidate(idx);
    setChatLogs(prev => ({
      ...prev,
      [c.id]: [{ from: "agent", text: `Hi ${c.name.split(" ")[0]}! I came across your profile and thought I'd reach out. We're hiring for a Senior Full Stack role at a fast-growing startup — do you have a few minutes to chat about it?` }]
    }));
    await sleep(1000);
    await askQuestion(cands, idx, 0, {}, questions);
  }

  async function askQuestion(cands, idx, qIdx, scores, questions) {
    const c = cands[idx];
    if (qIdx >= questions.length) {
      const positives = Object.values(scores).filter(Boolean).length;
      const interest = Math.round((positives / questions.length) * 100);
      setInterestScores(prev => ({ ...prev, [c.id]: interest }));
      addLog(`✅ ${c.name} → Interest: ${interest}%`);
      setChatLogs(prev => ({
        ...prev,
        [c.id]: [...(prev[c.id] || []), { from: "agent", text: `Thanks so much for taking the time, ${c.name.split(" ")[0]}! Really appreciated hearing about your experience. We'll be in touch with next steps soon. 🙌` }]
      }));
      await sleep(700);
      await beginOutreach(cands, idx + 1);
      return;
    }

    const q = questions[qIdx];
    setIsTyping(true);
    await sleep(800 + Math.random() * 400);
    setIsTyping(false);
    setChatLogs(prev => ({
      ...prev,
      [c.id]: [...(prev[c.id] || []), { from: "agent", text: q }]
    }));
    await sleep(500);

    const positiveRate = c.matchScore > 60 ? 0.75 : 0.5;
    const isPositive = Math.random() < positiveRate;
    const posReplies = [
      "Yes, definitely! I've been looking for the right opportunity.",
      "Absolutely, that aligns really well with what I enjoy.",
      "For sure — I thrive in that kind of environment.",
      "Yes, very much so. It's something I actively seek out.",
      "100%, that's been a big part of my recent work.",
      "Yes, I have solid experience with that.",
      "Sounds like a great fit, honestly.",
    ];
    const negReplies = [
      "Not at the moment, to be honest.",
      "I'd need to think more about that one.",
      "Not really my current priority right now.",
      "Hmm, that's not an area I've focused on much.",
      "It's not something I've done a lot of.",
    ];
    const reply = isPositive ? posReplies[qIdx % posReplies.length] : negReplies[qIdx % negReplies.length];
    setChatLogs(prev => ({
      ...prev,
      [c.id]: [...(prev[c.id] || []), { from: "candidate", text: reply, positive: isPositive }]
    }));
    await sleep(400);
    await askQuestion(cands, idx, qIdx + 1, { ...scores, [qIdx]: isPositive }, questions);
  }

  const finalRanked = candidates.map(c => ({
    ...c,
    interestScore: interestScores[c.id] ?? null,
    combined: interestScores[c.id] != null ? Math.round(c.matchScore * 0.55 + interestScores[c.id] * 0.45) : null,
  })).sort((a, b) => (b.combined ?? 0) - (a.combined ?? 0));

  const currentCandidate = candidates[engagingIdx];

  function handleShareView() {
    const text = finalRanked.map((c, i) =>
      `#${i + 1} ${c.name} — Match: ${c.matchScore}% | Interest: ${c.interestScore}% | Combined: ${c.combined}%`
    ).join("\n");
    const blob = new Blob([`Talent Scout Shortlist\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "shortlist.txt"; a.click();
  }

  const chatModalCandidate = finalRanked.find(c => c.id === viewingChat);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#00ff88;border-radius:2px}
    @keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.4)}50%{box-shadow:0 0 0 8px rgba(0,255,136,0)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes orbit{from{transform:rotate(0deg) translateX(18px) rotate(0deg)}to{transform:rotate(360deg) translateX(18px) rotate(-360deg)}}
    @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes processingBar{0%{width:0%;opacity:1}80%{width:90%;opacity:1}100%{width:90%;opacity:.6}}
    @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.7}}
    @keyframes modalIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    .slide-in{animation:slideIn .3s ease forwards}
    .fade-in{animation:fadeIn .5s ease forwards}
    .float{animation:floatAnim 3s ease-in-out infinite}
    .terminal-btn{background:transparent;border:1px solid #00ff88;color:#00ff88;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;padding:9px 22px;cursor:pointer;transition:all .2s;letter-spacing:.1em;text-transform:uppercase}
    .terminal-btn:hover{background:#00ff88;color:#0a0a0f;box-shadow:0 0 18px rgba(0,255,136,.35)}
    .card{background:rgba(255,255,255,.03);border:1px solid rgba(0,255,136,.12);border-radius:8px;transition:border-color .2s}
    .card:hover{border-color:rgba(0,255,136,.28)}
    .score-fill-match{background:linear-gradient(90deg,#00ff88,#00d4ff);transition:width 1s ease}
    .score-fill-interest{background:linear-gradient(90deg,#ff6b35,#ff0080);transition:width 1s ease}
    .score-fill-combined{background:linear-gradient(90deg,#9b59b6,#00ff88);transition:width 1s ease}
    .typing-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;display:inline-block;animation:blink 1.2s infinite}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
    .modal-box{background:#0d1117;border:1px solid rgba(0,255,136,.25);border-radius:12px;width:min(560px,92vw);max-height:80vh;display:flex;flex-direction:column;animation:modalIn .25s ease}
    textarea{resize:vertical;outline:none;transition:border-color .2s}
    textarea:focus{border-color:#00ff88!important}
  `;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a0f 0%,#0d1117 60%,#080d0a 100%)", fontFamily: "'IBM Plex Mono','Fira Code',monospace", color: "#e2e8f0" }}>
      <style>{css}</style>

      {/* TOPBAR */}
      <div style={{ borderBottom: "1px solid rgba(0,255,136,.15)", padding: "13px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,.35)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {phase !== "landing" && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "transparent", border: "1px solid rgba(0,255,136,.2)", color: "#00ff88", fontFamily: "inherit", fontSize: 11, padding: "4px 10px", cursor: "pointer", borderRadius: 4, marginRight: 4 }}>
              {sidebarOpen ? "◀ Log" : "▶ Log"}
            </button>
          )}
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", animation: "pulseGreen 2s infinite" }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 800, color: "#00ff88", letterSpacing: "-.01em" }}>Agentic AI for Recruiting</span>
        </div>
        {phase !== "landing" && (
          <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 20, background: phase === "results" ? "rgba(0,255,136,.12)" : "rgba(0,212,255,.1)", color: phase === "results" ? "#00ff88" : "#00d4ff", border: `1px solid ${phase === "results" ? "rgba(0,255,136,.3)" : "rgba(0,212,255,.2)"}` }}>
            {phase === "parsing" ? "Parsing JD" : phase === "discovering" ? "Discovering" : phase === "engaging" ? `Engaging ${engagingIdx + 1}/${candidates.length}` : "Screening Complete"}
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: phase !== "landing" && sidebarOpen ? "270px 1fr" : "1fr", minHeight: "calc(100vh - 50px)", transition: "grid-template-columns .3s ease" }}>

        {/* SIDEBAR LOG */}
        {phase !== "landing" && sidebarOpen && (
          <div ref={logRef} style={{ borderRight: "1px solid rgba(0,255,136,.1)", padding: "18px 14px", overflowY: "auto", maxHeight: "calc(100vh - 50px)", background: "rgba(0,0,0,.2)" }}>
            <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: ".15em", marginBottom: 12, textTransform: "uppercase" }}>Agent Log</div>
            {log.map((l, i) => (
              <div key={i} className="slide-in" style={{ marginBottom: 9, padding: "7px 10px", background: "rgba(255,255,255,.02)", borderRadius: 5, borderLeft: "2px solid rgba(0,255,136,.3)" }}>
                <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 2 }}>{l.time}</div>
                <div style={{ fontSize: 11, color: "#a0aec0", lineHeight: 1.5 }}>{l.msg}</div>
              </div>
            ))}
            {phase !== "results" && <span style={{ animation: "blink 1s infinite", color: "#00ff88", fontSize: 13 }}>▋</span>}
          </div>
        )}

        {/* MAIN PANEL */}
        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 50px)" }}>

          {/* ══ LANDING ══ */}
          {phase === "landing" && (
            <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px" }} className="fade-in">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,48px)", fontWeight: 800, color: "#f7fafc", lineHeight: 1.1, marginBottom: 14, letterSpacing: "-.03em" }}>
                    AI Talent Scout<br /><span style={{ color: "#00ff88" }}>&amp; Engagement Agent</span>
                  </h1>
                  <p style={{ fontSize: 13, color: "#718096", lineHeight: 1.85, maxWidth: 520 }}>
                    Drop in a Job Description. The agent parses it, discovers matching candidates, runs conversational outreach, and ranks them by Match + Interest — giving you an actionable shortlist in seconds.
                  </p>
                </div>
                {/* Animated logo */}
                <div style={{ flexShrink: 0, width: 150, height: 150, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }} className="float">
                  <svg width="150" height="150" style={{ position: "absolute", top: 0, left: 0 }}>
                    <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(0,255,136,.1)" strokeWidth="1.5" />
                    <circle cx="75" cy="75" r="68" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="50 400" style={{ animation: "spinRing 6s linear infinite", transformOrigin: "75px 75px" }} />
                    <circle cx="75" cy="75" r="52" fill="none" stroke="rgba(0,212,255,.12)" strokeWidth="1" />
                    <circle cx="75" cy="75" r="52" fill="none" stroke="#00d4ff" strokeWidth="1" strokeDasharray="20 300" style={{ animation: "spinRing 4s linear infinite reverse", transformOrigin: "75px 75px" }} />
                  </svg>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: ["#00ff88", "#00d4ff", "#ff6b35"][i], animation: `orbit ${3 + i}s linear infinite`, animationDelay: `${i * 1.1}s`, top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }} />
                  ))}
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#00ff88,#00d4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, zIndex: 2, boxShadow: "0 0 24px rgba(0,255,136,.4)" }}>🤖</div>
                  {["👩", "👨", "🧑", "👩‍💻"].map((em, i) => {
                    const angle = (i / 4) * 2 * Math.PI - Math.PI / 4;
                    const r = 60;
                    const x = 75 + r * Math.cos(angle) - 12;
                    const y = 75 + r * Math.sin(angle) - 12;
                    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: "#1a1f2e", border: "1px solid rgba(0,255,136,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, animation: `pulseDot 2s ${i * .4}s ease-in-out infinite` }}>{em}</div>;
                  })}
                </div>
              </div>

              <PipelineStats />

              <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 11, color: "#a0aec0", letterSpacing: ".1em", textTransform: "uppercase" }}>Job Description</label>
                <span style={{ fontSize: 10, color: "#4a5568" }}>Sample loaded · edit freely</span>
              </div>
              <textarea rows={9} value={jd} onChange={e => setJd(e.target.value)}
                style={{ width: "100%", background: "rgba(0,255,136,.03)", border: "1px solid rgba(0,255,136,.15)", borderRadius: 6, color: "#e2e8f0", fontFamily: "inherit", fontSize: 12, lineHeight: 1.75, padding: "14px 16px", marginBottom: 22 }}
              />
              <button className="terminal-btn" onClick={startAgent} style={{ fontSize: 13, padding: "13px 34px" }}>⚡ Activating Search</button>
            </div>
          )}

          {/* ══ PARSING / DISCOVERING ══ */}
          {(phase === "parsing" || phase === "discovering") && (
            <div style={{ padding: "40px 32px", maxWidth: 680 }}>
              <ProcessingHeader step={processingStep} />
              {parsedJD && (
                <div className="card slide-in" style={{ padding: 22, marginBottom: 22 }}>
                  <div style={{ fontSize: 10, color: "#4a5568", marginBottom: 14, letterSpacing: ".1em" }}>PARSED JD</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[["Role", parsedJD.role], ["Exp.", parsedJD.experience], ["Location", parsedJD.location]].map(([l, v]) => (
                      <div key={l} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                        <span style={{ fontSize: 10, color: "#4a5568", width: 70, flexShrink: 0 }}>{l}</span>
                        <span style={{ fontSize: 12, color: "#e2e8f0" }}>{v}</span>
                      </div>
                    ))}
                    <div>
                      <span style={{ fontSize: 10, color: "#4a5568" }}>Skills Extracted</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                        {parsedJD.skills.map(s => <SkillTag key={s} label={s} color="#00ff88" />)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: "#4a5568" }}>Key Traits</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                        {parsedJD.bonus.map(s => <SkillTag key={s} label={s} color="#00d4ff" />)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {candidates.map(c => (
                <div key={c.id} className="card slide-in" style={{ padding: "12px 16px", marginBottom: 9, display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar name={c.avatar} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: "#4a5568" }}>{c.title} · {c.experience}</div>
                  </div>
                  <ScorePill val={c.matchScore} color="#00ff88" />
                </div>
              ))}
            </div>
          )}

          {/* ══ ENGAGING ══ */}
          {phase === "engaging" && currentCandidate && (
            <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "start" }}>
              <div>
                <ProcessingHeader step={`Outreach ${engagingIdx + 1} / ${candidates.length}`} />
                <div className="card" style={{ padding: 20, marginTop: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                    <Avatar name={currentCandidate.avatar} size={46} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#f7fafc" }}>{currentCandidate.name}</div>
                      <div style={{ fontSize: 11, color: "#4a5568" }}>{currentCandidate.title}</div>
                      <div style={{ fontSize: 11, color: "#4a5568" }}>{currentCandidate.location}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "#718096", lineHeight: 1.7, marginBottom: 14 }}>{currentCandidate.summary}</p>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 7 }}>MATCHED SKILLS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {getMatchedSkills(currentCandidate).map(s => <SkillTag key={s} label={s} color="#00ff88" />)}
                    </div>
                  </div>
                  {getMissingSkills(currentCandidate).length > 0 && (
                    <div>
                      <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 7 }}>GAPS</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {getMissingSkills(currentCandidate).map(s => <SkillTag key={s} label={s} color="#ff6b35" />)}
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#4a5568", marginBottom: 5 }}>
                      <span>Match Score</span><span style={{ color: "#00ff88" }}>{currentCandidate.matchScore}%</span>
                    </div>
                    <div style={{ height: 5, background: "#1a1f2e", borderRadius: 3, overflow: "hidden" }}>
                      <div className="score-fill-match" style={{ width: `${currentCandidate.matchScore}%`, height: "100%", borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {candidates.map((c, i) => (
                    <div key={c.id} title={c.name} style={{ flex: 1, height: 3, borderRadius: 2, background: i < engagingIdx ? "#00ff88" : i === engagingIdx ? "rgba(0,255,136,.5)" : "#1a1f2e", transition: "background .3s" }} />
                  ))}
                </div>
              </div>

              {/* Live chat */}
              <div className="card" style={{ display: "flex", flexDirection: "column", height: 480 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,255,136,.1)", fontSize: 11, color: "#4a5568", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", animation: "pulseGreen 2s infinite" }} />
                  Live Conversation · {currentCandidate.name}
                </div>
                <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 14 }}>
                  {(chatLogs[currentCandidate.id] || []).map((msg, i) => (
                    <div key={i} className="slide-in" style={{ marginBottom: 11, display: "flex", justifyContent: msg.from === "agent" ? "flex-start" : "flex-end" }}>
                      <div style={{
                        maxWidth: "84%", padding: "9px 13px",
                        borderRadius: msg.from === "agent" ? "4px 13px 13px 13px" : "13px 4px 13px 13px",
                        background: msg.from === "agent" ? "rgba(0,255,136,.07)" : msg.positive === false ? "rgba(255,107,53,.08)" : "rgba(0,212,255,.08)",
                        border: `1px solid ${msg.from === "agent" ? "rgba(0,255,136,.18)" : msg.positive === false ? "rgba(255,107,53,.2)" : "rgba(0,212,255,.18)"}`,
                        fontSize: 11, lineHeight: 1.6, color: "#e2e8f0",
                      }}>
                        <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 3 }}>{msg.from === "agent" ? "💼 Recruiter" : `👤 ${currentCandidate.name}`}</div>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "rgba(0,255,136,.04)", borderRadius: "4px 14px 14px 14px", width: 58 }}>
                      <div className="typing-dot" /><div className="typing-dot" style={{ animationDelay: ".2s" }} /><div className="typing-dot" style={{ animationDelay: ".4s" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ RESULTS ══ */}
          {phase === "results" && (
            <div style={{ padding: "32px 32px" }} className="fade-in">
              <div style={{ marginBottom: 26 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#f7fafc", letterSpacing: "-.02em" }}>
                  {finalRanked.length} Candidates Ranked
                </h2>
                <div style={{ display: "flex", gap: 22, marginTop: 12 }}>
                  <Legend color="#00ff88" label="Match Score" />
                  <Legend color="#ff6b35" label="Interest Score" />
                  <Legend color="#9b59b6" label="Combined Score" />
                </div>
              </div>

              <div style={{ display: "grid", gap: 15 }}>
                {finalRanked.map((c, i) => (
                  <div key={c.id} className="card slide-in" style={{
                    padding: "22px 24px",
                    borderColor: i === 0 ? "rgba(0,255,136,.4)" : "rgba(0,255,136,.1)",
                    background: i === 0 ? "rgba(0,255,136,.04)" : "rgba(255,255,255,.02)",
                    animationDelay: `${i * 40}ms`,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: i === 0 ? "#00ff88" : i === 1 ? "rgba(0,255,136,.3)" : "rgba(255,255,255,.05)", color: i === 0 ? "#0a0a0f" : "#e2e8f0", flexShrink: 0 }}>
                        #{i + 1}
                      </div>
                      <Avatar name={c.avatar} size={42} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: "#f7fafc" }}>{c.name}</span>
                          {i === 0 && <span style={{ fontSize: 9, background: "#00ff88", color: "#0a0a0f", padding: "2px 8px", borderRadius: 100, fontWeight: 700, letterSpacing: ".1em" }}>TOP PICK</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 12 }}>{c.title} · {c.experience} · {c.location}</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          <ScoreRow label="Match Score" val={c.matchScore} fillClass="score-fill-match" />
                          <ScoreRow label="Interest Score" val={c.interestScore} fillClass="score-fill-interest" />
                          <ScoreRow label="Combined Score" val={c.combined} fillClass="score-fill-combined" bold />
                        </div>
                        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {getMatchedSkills(c).map(s => <SkillTag key={s} label={s} color="#00ff88" />)}
                          {getMissingSkills(c).map(s => <SkillTag key={s} label={s} color="#4a5568" />)}
                        </div>
                        <p style={{ fontSize: 11, color: "#718096", lineHeight: 1.6, marginTop: 10 }}>{c.summary}</p>
                        {chatLogs[c.id] && (
                          <button onClick={() => setViewingChat(c.id)} style={{ marginTop: 14, background: "transparent", border: "1px solid rgba(0,212,255,.3)", color: "#00d4ff", fontFamily: "inherit", fontSize: 10, padding: "6px 14px", cursor: "pointer", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>
                            💬 View Conversation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="terminal-btn" onClick={() => { setPhase("landing"); setLog([]); setCandidates([]); setInterestScores({}); setChatLogs({}); setParsedJD(null); setSidebarOpen(false); }}>
                  ↺ Reset
                </button>
                <button className="terminal-btn" style={{ borderColor: "#00d4ff", color: "#00d4ff" }} onClick={handleShareView}>
                  🔗 Share View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHAT MODAL */}
      {viewingChat && chatModalCandidate && (
        <div className="modal-overlay" onClick={() => setViewingChat(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,255,136,.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={chatModalCandidate.avatar} size={32} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f7fafc" }}>{chatModalCandidate.name}</div>
                  <div style={{ fontSize: 10, color: "#4a5568" }}>Interest Score: {chatModalCandidate.interestScore}%</div>
                </div>
              </div>
              <button onClick={() => setViewingChat(null)} style={{ background: "transparent", border: "none", color: "#4a5568", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {(chatLogs[chatModalCandidate.id] || []).map((msg, i) => (
                <div key={i} style={{ marginBottom: 11, display: "flex", justifyContent: msg.from === "agent" ? "flex-start" : "flex-end" }}>
                  <div style={{
                    maxWidth: "84%", padding: "9px 13px",
                    borderRadius: msg.from === "agent" ? "4px 13px 13px 13px" : "13px 4px 13px 13px",
                    background: msg.from === "agent" ? "rgba(0,255,136,.07)" : msg.positive === false ? "rgba(255,107,53,.08)" : "rgba(0,212,255,.08)",
                    border: `1px solid ${msg.from === "agent" ? "rgba(0,255,136,.18)" : msg.positive === false ? "rgba(255,107,53,.2)" : "rgba(0,212,255,.18)"}`,
                    fontSize: 11, lineHeight: 1.6, color: "#e2e8f0",
                  }}>
                    <div style={{ fontSize: 9, color: "#4a5568", marginBottom: 3 }}>{msg.from === "agent" ? "💼 Recruiter" : `👤 ${chatModalCandidate.name}`}</div>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}