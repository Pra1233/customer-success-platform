import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.enums import InsightStatus, Sentiment


class ActionItem(BaseModel):
    title: str
    description: str | None = None
    status: str = "pending"
    due_date: str | None = None


class Risk(BaseModel):
    title: str
    severity: str = "medium"
    description: str | None = None


class GeneratedInsight(BaseModel):
    summary: str
    sentiment: Sentiment
    action_items: list[ActionItem]
    risks: list[Risk]


class InsightOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: uuid.UUID
    interaction_id: uuid.UUID
    summary: str | None
    sentiment: Sentiment | None
    action_items: list[ActionItem] | None
    risks: list[Risk] | None
    status: InsightStatus
    error_message: str | None
    model_name: str | None
    created_at: datetime
