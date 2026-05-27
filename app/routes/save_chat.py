from fastapi import APIRouter

from app.models.chat_models import (
    SaveChatRequest
)

from app.services.database_service import (
    save_conversation
)

router = APIRouter()


@router.post("/save-chat")
def save_chat(request: SaveChatRequest):

    save_conversation(

        request.user_id,

        request.messages
    )

    return {

        "message":
        "Conversation saved successfully."
    }