from pydantic import BaseModel, Field
from typing import Dict, Any

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    user_profile: Dict[str, Any] = Field(default_factory=dict)

class ContextData(BaseModel):
    mode: str = Field(default="navigation")
    model_config = {"extra": "allow"}

class DecisionRequest(BaseModel):
    context_data: ContextData
