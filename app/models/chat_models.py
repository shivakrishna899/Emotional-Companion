from pydantic import BaseModel
from typing import List


class ChatRequest(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    emotion: str
    



class Message(BaseModel):

    sender: str

    text: str


class SaveChatRequest(BaseModel):

    user_id: str

    messages: List[Message]