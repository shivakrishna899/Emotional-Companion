from supabase import create_client
from dotenv import load_dotenv

import os

load_dotenv()


SUPABASE_URL = os.getenv(
    "SUPABASE_URL"
)

SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY"
)


supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# =========================
# SAVE CHAT
# =========================

def save_chat(
    user_id,
    title,
    messages
):

    data = {

        "user_id": user_id,

        "title": title,

        "messages": messages
    }

    response = (
        supabase
        .table("saved_chats")
        .insert(data)
        .execute()
    )

    return response.data


# =========================
# GET SAVED CHATS
# =========================

def get_saved_chats(
    user_id
):

    response = (
        supabase
        .table("saved_chats")
        .select("*")
        .eq("user_id", user_id)
        .order("id", desc=True)
        .execute()
    )

    return response.data