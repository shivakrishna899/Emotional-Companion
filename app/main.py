from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.routes.chat import router as chat_router
from app.routes.get_chats import (
    router as get_chats_router
)

from app.services.database_service import (
    save_chat
)

app = FastAPI()


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================
# CHAT ROUTES
# =========================

app.include_router(
    chat_router
)

app.include_router(
    get_chats_router
)


# =========================
# SAVE CHAT MODEL
# =========================

class SaveChatRequest(BaseModel):

    user_id: str

    title: str

    messages: list


# =========================
# SAVE CHAT ROUTE
# =========================

@app.post("/save-chat")
def save_chat_route(
    request: SaveChatRequest
):

    result = save_chat(

        request.user_id,

        request.title,

        request.messages
    )

    return {
        "success": True,
        "data": result
    }


# =========================
# ROOT
# =========================

@app.get("/")
def home():

    return {
        "message": "Emotional Companion Backend Running"
    }