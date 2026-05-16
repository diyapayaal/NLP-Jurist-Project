# NLP-Jurist — AI Compliance Gap Analyzer

NLP-Jurist is an AI-powered compliance intelligence platform designed for regulated financial institutions. It analyzes RBI regulations and legal circulars, compares them against existing bank policies, and identifies actionable compliance gaps using Large Language Models (LLMs).

The platform combines PDF extraction, AI-driven regulation understanding, policy comparison, and compliance analytics into a modern full-stack dashboard experience.

---

# Key Features

✅ AI-powered regulation analysis using Gemini LLM
✅ PDF extraction and regulatory text parsing
✅ Automated compliance gap detection
✅ Alignment score generation between regulations and bank policies
✅ Severity-based risk categorization
✅ Measurable remediation action points
✅ FastAPI backend with modular architecture
✅ Modern React + Tailwind enterprise dashboard
✅ Structured JSON reporting system
✅ Report history and compliance tracking

---

# Tech Stack

## Backend

* Python
* FastAPI
* pdfplumber
* Gemini API
* dotenv

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* TanStack Router
* Recharts

---

# System Workflow

1. Upload RBI regulation PDF
2. Extract regulation text
3. Analyze regulation using Gemini AI
4. Compare against existing bank policies
5. Detect compliance gaps
6. Generate alignment scores and remediation actions
7. Visualize results in dashboard

---

# Project Structure

```bash
NLP-Jurist/
│
├── backend/
│   ├── api.py
│   ├── utils/
│   ├── prompts/
│   ├── reports/
│   └── data/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── routes/
│   └── styles/
│
└── README.md
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <your-repository-link>
cd NLP-Jurist
```

---

## 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Get Gemini API Key from:
https://aistudio.google.com/app/apikeys

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Running the Application

## Start Backend

```bash
uvicorn api:app --reload
```

## Start Frontend

```bash
npm run dev
```

---

# API Endpoints

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| GET    | `/`             | Health check                    |
| POST   | `/analyze`      | Upload & analyze regulation PDF |
| GET    | `/reports`      | Fetch report history            |
| GET    | `/reports/{id}` | Fetch detailed report           |

---

# Sample Output

```json
{
  "alignment_score": 78,
  "overall_compliance_status": "partially_compliant",
  "critical_gaps_count": 2,
  "gaps": [
    {
      "severity": "high",
      "description": "Missing AML reporting controls"
    }
  ]
}
```

---

# Current Capabilities

* RBI regulation analysis
* Compliance gap detection
* Policy alignment scoring
* Risk categorization
* Department impact mapping
* Remediation prioritization
* Dashboard-based compliance visualization

---

# Future Enhancements

* Vector database integration
* RAG-based semantic policy retrieval
* Multi-document analysis
* Real-time compliance monitoring
* AI-generated policy recommendations
* Audit trail system
* Cloud deployment
* Role-based access control

---

# Security Notes

⚠️ Never commit `.env` files
⚠️ Store API keys securely
⚠️ Use sanitized policy datasets in public repositories

---

# License

This project is built for educational, research, and compliance automation purposes.

