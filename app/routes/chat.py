from fastapi import APIRouter

from fastapi.responses import (
    StreamingResponse
)

from app.models.chat_models import (
    ChatRequest
)

from app.services.llm_service import (
    generate_response_stream
)

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    response_stream = (
        generate_response_stream(

            request.message,

            request.user_id
        )
    )

    return StreamingResponse(

        response_stream,

        media_type="text/plain"
    )