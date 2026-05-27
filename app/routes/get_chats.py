from fastapi import APIRouter

from app.services.database_service import (
    get_saved_chats
)

router = APIRouter()


@router.get("/saved-chats/{user_id}")
def fetch_saved_chats(
    user_id: str
):

    chats = get_saved_chats(
        user_id
    )

    return chats