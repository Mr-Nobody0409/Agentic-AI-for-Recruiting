# 🤖 Agentic AI for Recruiting

> **AI-powered talent acquisition agent that parses job descriptions, discovers matching candidates, runs personalized outreach conversations, and ranks them by match + interest scores.**

---

## 🎯 Quick Start

### Live Demo
🚀 **[https://agentic-ai-for-recruiting.vercel.app/]** 

### Local Setup (2 minutes)
- git clone https://github.com/Mr-Nobody0409/agentic-ai-recruiting.git
- cd agentic-ai-recruiting
- npm install
- npm start

Opens at http://localhost:3000

---
### ✨ Features

# 🔍 Smart JD Parsing
- Automatically extracts core skills, seniority level, location, and bonus requirements
- Structured output ready for matching

# 🎯 Intelligent Candidate Matching
- Scores candidates using hybrid algorithm: 55% skill match + 45% interest
- Handles skill aliases (e.g., "CI/CD" = "GitHub Actions")
- Experience bonus: +10% for 5+ years, +5% for 3-4 years

# 💬 Natural Conversational Outreach
- Runs 7 personalized questions per candidate
- Sounds like a real recruiter (not AI-sounding)
- Tracks positive/negative responses in real-time

# 📊 Ranked Shortlist
- Combined score: (Match × 0.55) + (Interest × 0.45)
- Exportable as TXT file for team sharing
- View full conversation history per candidate
  
# 🎨 Beautiful Terminal UI
- Cyberpunk-style dark theme with green/cyan accents
- Real-time animations and live chat streaming
- Responsive sidebar log showing all agent actions

---

###🚀 Usage Workflow
- Paste Job Description → Agent auto-parses it
- Click "Activating Search" → Agent discovers 9 candidates
- Watch Live Outreach → 7-question conversations per candidate
- Review Results → Ranked shortlist with scores
- Export Shortlist → Download as TXT for team
  
# Sample Flow (30-60 seconds)
* Landing → JD Input → Parse (2s) → Discover (8s) → Engage (40s) → Results

---

### 📊 Architecture

See ARCHITECTURE.md for:

- Detailed scoring algorithm with math
- System design & data flow
- Trade-offs & design decisions
- Candidate matching logic

# Quick Overview:
- Input (JD) 
  ↓
- Parse Skills & Requirements (SAMPLE_JD)
  ↓
- Score 9 Candidates (Match Score = skills + experience)
  ↓
- Run 7 Questions Per Candidate (Conversational AI)
  ↓
- Calculate Interest Score (% positive responses)
  ↓
- Combined Score = (Match × 0.55) + (Interest × 0.45)
  ↓
- Output (Ranked Shortlist)

---

### 🎮 Key Technologies
- React - Component-based UI
- TypeScript - Type safety (setup ready)
- CSS-in-JS - Styled components with animations
- No external APIs - All logic client-side with mock data

---

### 🎯 Use Cases
- ✅ Startup Recruiting - Screen dozens of candidates in minutes
- ✅ Scale Team Building - Run parallel outreach to multiple candidates
- ✅ Talent Sourcing - Auto-score candidate pools by match + interest
- ✅ Preliminary Screening - Get interest levels before recruiter calls
- ✅ Skill Gap Analysis - Identify which candidates lack key skills

🔄 Performance
- Full workflow: 30-60 seconds for 9 candidates
- Per candidate: ~5 seconds (parsing + 7 questions)
- Scoring: Real-time as responses come in
- Memory: <10MB (all client-side)

---

