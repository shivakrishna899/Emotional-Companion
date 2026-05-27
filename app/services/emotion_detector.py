import os
import requests

from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

URL = "https://openrouter.ai/api/v1/chat/completions"


def detect_emotion(message: str):

    system_prompt = """
You are an advanced emotional analysis system.

Analyze the user's message carefully.

Your task:
- detect the primary emotion
- detect emotional intensity
- understand emotional psychology

Possible emotions:
- sadness
- anxiety
- anger
- happiness
- loneliness
- insecurity
- confusion
- stress
- excitement
- neutral

Intensity levels:
- low
- medium
- high

Return ONLY valid JSON.

Example format:
{
  "emotion": "anxiety",
  "intensity": "high"
}
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "temperature": 0.2
    }

    response = requests.post(
        URL,
        headers=headers,
        json=payload
    )

    data = response.json()

    print(data)

    if "choices" not in data:
        return {
            "emotion": "neutral",
            "intensity": "medium"
        }

    content = data["choices"][0]["message"]["content"]

    try:
        import json
        emotion_data = json.loads(content)

        return emotion_data

    except:
        return {
            "emotion": "neutral",
            "intensity": "medium"
        }