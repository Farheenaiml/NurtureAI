from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environmental variables
load_dotenv()

# Import specialized agents
from agents.planner_agent import route_query
from agents.pregnancy_agent import handle_pregnancy
from agents.nutrition_agent import handle_nutrition
from agents.symptom_agent import handle_symptom
from agents.mental_health_agent import handle_mental_health
from agents.emergency_agent import handle_emergency
from agents.critic_agent import review_draft

import traceback
from fastapi.responses import JSONResponse
from fastapi import Request
from agents.voice.routes import router as voice_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Nurture AI Companion - Agentic RAG Backend")
app.include_router(voice_router)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("=== GLOBAL EXCEPTION HANDLER ===")
    traceback.print_exception(type(exc), exc, exc.__traceback__)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)}
    )

class FileInput(BaseModel):
    base64: str
    mimeType: str
    name: str

class MessageInput(BaseModel):
    role: str
    text: Optional[str] = ""

class PatientProfile(BaseModel):
    fullName: Optional[str] = None
    stage: Optional[str] = None
    currentWeek: Optional[int] = None
    dueDate: Optional[str] = None
    conditions: Optional[str] = None
    allergies: Optional[str] = None
    language: Optional[str] = None
    postpartum: Optional[bool] = None

class ChatRequest(BaseModel):
    prompt: str
    conversationId: Optional[str] = None
    history: List[MessageInput] = []
    file: Optional[FileInput] = None
    patientProfile: Optional[PatientProfile] = None

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is missing on Python backend")

    prompt = request.prompt
    history_dict = [h.dict() for h in request.history]
    file_dict = request.file.dict() if request.file else None
    profile_dict = request.patientProfile.dict() if request.patientProfile else None

    # 1. Planner routing
    print(f"\n[FastAPI] Query received: '{prompt[:50]}...'")
    category = route_query(api_key, prompt)
    print(f"[FastAPI] Planner selected: {category.upper()}")

    # 2. Specialized RAG execution
    draft_response = ""
    if category == "pregnancy_agent":
        draft_response = handle_pregnancy(api_key, prompt, history_dict, file_dict, profile_dict)
    elif category == "nutrition_agent":
        draft_response = handle_nutrition(api_key, prompt, history_dict, file_dict, profile_dict)
    elif category == "symptom_agent":
        draft_response = handle_symptom(api_key, prompt, history_dict, file_dict, profile_dict)
    elif category == "mental_health_agent":
        draft_response = handle_mental_health(api_key, prompt, history_dict, file_dict, profile_dict)
    elif category == "emergency_agent":
        draft_response = handle_emergency(api_key, prompt, history_dict, file_dict, profile_dict)
    else:
        draft_response = handle_pregnancy(api_key, prompt, history_dict, file_dict, profile_dict)

    # Check for specialized agent execution errors
    if draft_response.startswith("Error executing"):
        print(f"[FastAPI] Specialized agent failed: {draft_response}")
        raise HTTPException(status_code=500, detail=draft_response)

    print(f"[FastAPI] Gemini draft generated")

    # 3. Critic safety review and output compilation
    final_output = review_draft(api_key, prompt, category, draft_response)
    print(f"[FastAPI] Critic review completed")

    return final_output

@app.get("/health")
def health():
    return {"status": "ok", "api_key_configured": bool(os.environ.get("GEMINI_API_KEY"))}
