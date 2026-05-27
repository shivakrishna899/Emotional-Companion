import os
import json
import requests
import time

from dotenv import load_dotenv

from app.services.emotion_detector import (
    detect_emotion
)

from app.prompts.system_prompt import (
    build_system_prompt
)

from app.utils.memory_store import (
    conversation_memory
)

# ==========================================
# LOAD ENV VARIABLES
# ==========================================

load_dotenv()

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

OPENROUTER_URL = (
    "https://openrouter.ai/api/v1/chat/completions"
)

# ==========================================
# STREAM RESPONSE
# ==========================================

def generate_response_stream(
    message,
    user_id
):

    # ======================================
    # USER MEMORY INIT
    # ======================================

    if user_id not in conversation_memory:

        conversation_memory[user_id] = []

    # ======================================
    # LOCAL EMOTION DETECTION
    # ======================================

    emotion_data = detect_emotion(
        message
    )

    emotion = emotion_data[
        "emotion"
    ]

    intensity = emotion_data[
        "intensity"
    ]

    # ======================================
    # SYSTEM PROMPT
    # ======================================

    system_prompt = (
        build_system_prompt(
            emotion,
            intensity
        )
    )

    # ======================================
    # RECENT MEMORY
    # ======================================

    recent_messages = (
        conversation_memory[user_id][-8:]
    )

    # ======================================
    # BUILD MESSAGE ARRAY
    # ======================================

    messages = [

        {
            "role": "system",

            "content":
            system_prompt
        }
    ]

    messages.extend(
        recent_messages
    )

    messages.append({

        "role": "user",

        "content": message
    })

    # ======================================
    # STORE USER MESSAGE
    # ======================================

    conversation_memory[user_id].append({

        "role": "user",

        "content": message
    })

    # ======================================
    # HEADERS
    # ======================================

    headers = {

        "Authorization":
        f"Bearer {OPENROUTER_API_KEY}",

        "Content-Type":
        "application/json"
    }

    # ======================================
    # PAYLOAD
    # ======================================

    payload = {

        "model":
        "openai/gpt-4o-mini",

        "messages": messages,

        "stream": True
    }

    # ======================================
    # API REQUEST
    # ======================================

    response = requests.post(

        OPENROUTER_URL,

        headers=headers,

        json=payload,

        stream=True
    )

    # ======================================
    # STREAM RESPONSE
    # ======================================

    full_ai_response = ""

    for line in response.iter_lines():

        if line:

            decoded_line = (
                line.decode("utf-8")
            )

            if decoded_line.startswith(
                "data: "
            ):

                data = decoded_line[6:]

                if data == "[DONE]":
                    break

                try:

                    json_data = (
                        json.loads(data)
                    )

                    content = (
                        json_data[
                            "choices"
                        ][0][
                            "delta"
                        ].get(
                            "content",
                            ""
                        )
                    )

                    if content:

                        full_ai_response += content

                        yield content

                except:
                    pass

    # ======================================
    # STORE AI RESPONSE
    # ======================================

    conversation_memory[user_id].append({

        "role": "assistant",

        "content":
        full_ai_response
    })

    # ======================================
    # SLIDING WINDOW
    # ======================================

    conversation_memory[user_id] = (

        conversation_memory[user_id][-8:]
    )