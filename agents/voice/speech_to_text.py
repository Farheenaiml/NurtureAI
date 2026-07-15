import whisper
import os

_model = None

def get_whisper_model():
    global _model
    if _model is None:
        print("[Voice STT] Loading Whisper model ('base')...")
        # Loading 'base' model for a good balance of accuracy and performance on CPU
        _model = whisper.load_model("base")
    return _model

def transcribe_audio(audio_file_path: str) -> str:
    if not os.path.exists(audio_file_path):
        raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
    
    try:
        model = get_whisper_model()
        print(f"[Voice STT] Transcribing file: {audio_file_path}...")
        result = model.transcribe(audio_file_path)
        text = result.get("text", "").strip()
        print(f"[Voice STT] Transcribed text: '{text}'")
        return text
    except Exception as e:
        print(f"[Voice STT] Error transcribing with Whisper: {e}")
        # Provide a descriptive error to let the route handler know what failed
        raise RuntimeError(f"Speech recognition failed: {e}")
