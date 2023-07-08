from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
import redis
import requests
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

r = redis.Redis(host='redis', port=6379, db=0)

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class Conversation(BaseModel):
    conversation: List[Message]

@app.post("/service2/{conversation_id}")
async def service2(conversation_id: str, conversation: Conversation):
    logger.info("Service 2 is running...")
    r.set(conversation_id, conversation.json())
    response = requests.post(f"http://service3:80/service3/{conversation_id}", json=conversation.dict())
    response.raise_for_status()
    return response.json()
