# 🌸 NurtureAI

> **An Advanced Voice-Enabled Maternity & Health Companion built with an Agentic Workflow, Hybrid RAG/Graph RAG, and a High-Performance Vector Database.**

NurtureAI is a modern, state-of-the-art medical and pregnancy companion application. It provides real-time, personalized, and context-aware responses to users through text and voice interfaces. The system utilizes a sophisticated team of cooperative AI agents, advanced retrieval pipelines, and localized vector storage to ensure responses are safe, factual, and backed by clinical guidelines.

---

## 🚀 Key Features

*   **🎙️ Immersive Voice Mode**: High-speed, natural conversation flow driven by AI Whisper (Speech-to-Text) and gTTS (Text-to-Speech) modules.
*   **🤖 Multi-Agent Agentic Workflow**: A cooperative ecosystem of expert agents coordinate to solve complex medical queries:
    *   **Planner Agent**: Orchestrates query breakdown and coordinates specialized agents.
    *   **Specialist Agents**: Dedicated domain experts for *Pregnancy*, *Nutrition*, *Mental Health*, *Symptom Tracking*, and *Emergency Detection*.
    *   **Critic Agent**: Reviews responses against medical safety standards before they reach the user.
*   **📚 Hybrid RAG & Graph RAG**: Combines vector searches with structure-mapped medical guideline indices (WHO, CDC, ACOG) to prevent AI hallucinations.
*   **🗄️ ChromaDB Vector Database**: Fast, local vector database storage that indexes clinical PDFs dynamically for real-time semantic retrieval.
*   **💻 Sleek Dashboard**: Premium, modern interface featuring a dark mode aesthetic, smooth micro-animations, dynamic tracking, and full conversation history.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, `@tanstack/react-start`, Vite, Tailwind CSS, Lucide Icons, Zustand |
| **AI Backend** | FastAPI, Python 3.10+, Uvicorn, Google Gemini API (`google-generativeai`) |
| **Vector DB / RAG** | ChromaDB, `sentence-transformers`, `pypdf`, `reportlab` |
| **Database** | PostgreSQL (`postgres` client) for auth, user records, and session data |
| **Speech Processors** | Whisper STT, gTTS |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User Client]) -->|Voice / Text| FE[TanStack Start Frontend]
    FE -->|API Queries| BE[FastAPI Agent Backend]
    FE -->|Auth & History| PG[(PostgreSQL DB)]
    
    subgraph Agentic Workflow
        BE --> Planner[Planner Agent]
        Planner --> Router{Expert Router}
        Router --> Preg[Pregnancy Agent]
        Router --> Nutr[Nutrition Agent]
        Router --> Mental[Mental Health Agent]
        Router --> Sympt[Symptom Agent]
        Router --> Emerg[Emergency Agent]
        
        Preg & Nutr & Mental & Sympt & Emerg --> RAG[RAG & Graph RAG Retriever]
        RAG <--> ChromaDB[(ChromaDB Vector DB)]
        
        Preg & Nutr & Mental & Sympt & Emerg --> Critic[Critic / Safety Agent]
        Critic --> Output[Safe Final Response]
    end
    
    Output -->|TTS Generator| FE
```

---

## ⚙️ Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Python](https://www.python.org/) (v3.10 or higher)
*   [PostgreSQL](https://www.postgresql.org/) (running locally or hosted)

---

### Step 1: Clone and Environment Setup

Create a `.env` file in the root directory and configure the variables:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database Connection
DATABASE_URL=postgres://username:password@localhost:5432/nurtureai

# Server Config
BACKEND_URL=http://localhost:8000
```

---

### Step 2: Backend Setup (Python)

1. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```

2. Install python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

### Step 3: Seed Vector Database (RAG Ingestion)

Before running the app, ingest the medical guidelines PDFs into the ChromaDB vector database:

1. Place your clinical guideline PDFs inside `agents/rag/documents/`.
2. Run the ingestion pipeline script:
   ```bash
   python -m agents.rag.ingest
   ```

---

### Step 4: Frontend Setup (Node)

1. Install frontend packages:
   ```bash
   npm install
   ```

2. Initialize the database schema (creates tables for users, sessions, and messages):
   ```bash
   npm run build:dev
   ```

---

### Step 5: Running the Project

You will need two terminals running concurrently:

**Terminal A: Start the FastAPI AI Agent Backend**
```bash
# Make sure your virtual environment is active
uvicorn agents.main:app --reload --port 8000
```

**Terminal B: Start the TanStack Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in the console) to view NurtureAI in action! 🎉
