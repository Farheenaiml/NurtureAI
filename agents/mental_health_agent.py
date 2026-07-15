import google.generativeai as genai
from agents.rag.retriever import retrieve_context

def handle_mental_health(api_key: str, prompt: str, history: list, file_data: dict = None, profile: dict = None) -> str:
    genai.configure(api_key=api_key)
    
    # 1. Retrieve relevant medical guidelines
    collection_name = "mental_health_docs"
    print(f"Searching collection: {collection_name}")
    retrieved_chunks = retrieve_context(collection_name, prompt, top_k=5)
    print(f"Retrieved: {len(retrieved_chunks)} chunks")
    
    if retrieved_chunks:
        scores = [c["score"] for c in retrieved_chunks]
        avg_score = sum(scores) / len(scores)
        print(f"Average similarity: {avg_score:.4f}")
        context_str = "\n\n".join([f"--- Context (Source: {c['source']}) ---\n{c['text']}" for c in retrieved_chunks])
    else:
        print(f"Average similarity: 0.0000")
        context_str = "No specific local guideline context available."
        
    # 2. Format Patient Profile
    profile_str = "No profile details provided."
    if profile:
        profile_parts = []
        if profile.get("fullName"): profile_parts.append(f"Name: {profile['fullName']}")
        if profile.get("stage"): profile_parts.append(f"Pregnancy Stage: {profile['stage']}")
        if profile.get("currentWeek"): profile_parts.append(f"Week: {profile['currentWeek']}")
        if profile.get("conditions"): profile_parts.append(f"Medical Conditions: {profile['conditions']}")
        if profile.get("allergies"): profile_parts.append(f"Allergies: {profile['allergies']}")
        if profile.get("language"): profile_parts.append(f"Preferred Language: {profile['language']}")
        if profile.get("postpartum"): profile_parts.append(f"Postpartum Status: {'Yes' if profile['postpartum'] else 'No'}")
        if profile_parts:
            profile_str = "\n".join(profile_parts)

    system_instruction = f"""You are an evidence-based maternal healthcare AI assistant specializing in postpartum depression, baby blues, anxiety, mood changes, and stress reduction.
    
    Use the retrieved medical context below as your primary source of truth.
    Do not invent medical facts.
    If the retrieved context is insufficient or not relevant, clearly state that additional consultation with health professionals is recommended.
    Always prioritize the retrieved context and structure your answers with empathy.
    
    --- Retrieved Medical Context ---
    {context_str}
    
    --- Patient Profile Details ---
    {profile_str}
    
    Answer the user's question safely, adhering to the retrieved guidelines. Do not perform definitive medical diagnoses."""

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction
    )
    
    # Format contents with history
    contents = []
    for h in history:
        contents.append({
            "role": "user" if h.get("role") == "user" else "model",
            "parts": [{"text": h.get("text") or ""}]
        })
        
    parts = []
    if file_data and file_data.get("base64") and file_data.get("mimeType"):
        parts.append({
            "inline_data": {
                "mime_type": file_data.get("mimeType"),
                "data": file_data.get("base64")
            }
        })
    parts.append({"text": prompt})
    contents.append({"role": "user", "parts": parts})
    
    try:
        print("Sending retrieved context to Gemini")
        response = model.generate_content(contents)
        return response.text
    except Exception as e:
        print(f"[Mental Health Agent] Error: {e}")
        return f"Error executing mental wellness agent: {e}"
