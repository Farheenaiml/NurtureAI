import google.generativeai as genai
import json

def route_query(api_key: str, prompt: str) -> str:
    genai.configure(api_key=api_key)
    
    planner_prompt = """You are the Planner Agent for a maternal care companion.
Your only job is to classify the user's message into exactly one of these categories:
- "pregnancy_agent": milestone queries, baby development, safe gestational activities, trimester timelines.
- "nutrition_agent": foods, fruits, coffee, supplements, iron, calcium, protein, hydration, diets.
- "symptom_agent": standard gestational discomforts, swollen parts, nausea, fatigue, safe home care.
- "mental_health_agent": postpartum depression, baby blues, stress, crying, anxiety, emotional wellness.
- "emergency_agent": urgent medical warning signs (heavy bleeding, chest pain, loss of consciousness, seizures, no baby movement).

Return your response strictly as a JSON object:
{ "category": "category_name" }
Do not return any other text."""

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=planner_prompt
    )
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        data = json.loads(response.text.strip())
        return data.get("category", "pregnancy_agent")
    except Exception as e:
        print(f"[Planner Agent] Error: {e}")
        return "pregnancy_agent"
