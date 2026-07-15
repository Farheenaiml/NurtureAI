from gtts import gTTS
import io

def generate_speech(text: str, lang: str = "en") -> io.BytesIO:
    if not text or not text.strip():
        raise ValueError("Text content for TTS is empty")
    
    print(f"[Voice TTS] Generating speech for text: '{text[:50]}...'")
    try:
        tts = gTTS(text=text, lang=lang)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e:
        print(f"[Voice TTS] Error generating speech with gTTS: {e}")
        raise RuntimeError(f"Text-to-speech generation failed: {e}")
