from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import os
import openai
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class Conversation(BaseModel):
    conversation: List[Message]

@app.post("/service3/{conversation_id}")
async def service3(conversation_id: str, conversation: Conversation):
    logger.info("Service 3 is running...")
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation.dict()["conversation"]
    )
    return {"id": conversation_id, "reply": completion.choices[0].message['content']}
