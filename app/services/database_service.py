import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise Exception("SUPABASE_URL missing")

if not SUPABASE_KEY:
    raise Exception("SUPABASE_KEY missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# ====================================
# SAVE CHAT
# ====================================

def save_chat(user_id, messages):

    title = "New Conversation"

    for msg in messages:

        if msg["sender"] == "user":

            title = msg["text"][:30]
            break

    response = supabase.table(
        "saved_chats"
    ).insert({

        "user_id": user_id,

        "title": title,

        "messages": messages

    }).execute()

    return response.data


# ====================================
# GET SAVED CHATS
# ====================================

def get_saved_chats(user_id):

    response = supabase.table(
        "saved_chats"
    ).select("*").eq(
        "user_id",
        user_id
    ).order(
        "created_at",
        desc=True
    ).execute()

    return response.data