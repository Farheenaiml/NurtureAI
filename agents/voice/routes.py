from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import tempfile
import os
import shutil
from agents.voice.speech_to_text import transcribe_audio
from agents.voice.text_to_speech import generate_speech

router = APIRouter(prefix="", tags=["voice"])

class TTSRequest(BaseModel):
    text: str

@router.post("/speech-to-text")
async def speech_to_text_endpoint(file: UploadFile = File(...)):
    print(f"[Voice Router] Received STT request for file: {file.filename}")
    
    # Save the file temporarily
    suffix = os.path.splitext(file.filename)[1] or ".webm"
    temp_dir = tempfile.gettempdir()
    temp_file_path = os.path.join(temp_dir, f"nurture_voice_upload_{os.urandom(8).hex()}{suffix}")
    
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Transcribe audio using whisper
        transcribed_text = transcribe_audio(temp_file_path)
        return {"text": transcribed_text}
    except Exception as e:
        print(f"[Voice Router] Error in STT endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Ensure temporary file is cleaned up
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as cleanup_err:
                print(f"[Voice Router] Error cleaning up temp file: {cleanup_err}")

@router.post("/text-to-speech")
async def text_to_speech_endpoint(request: TTSRequest):
    text = request.text
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text field is required")
        
    try:
        audio_stream = generate_speech(text)
        return StreamingResponse(audio_stream, media_type="audio/mpeg")
    except Exception as e:
        print(f"[Voice Router] Error in TTS endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
