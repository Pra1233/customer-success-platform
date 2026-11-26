import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.enums import InteractionType


class InteractionCreate(BaseModel):
    customer_id: uuid.UUID
    title: str | None = None
    type: InteractionType
    notes: str
    interaction_date: datetime


class InteractionUpdate(BaseModel):
    title: str | None = None
    type: InteractionType | None = None
    notes: str | None = None
    interaction_date: datetime | None = None


class InteractionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    customer_id: uuid.UUID
    created_by: uuid.UUID
    title: str | None
    type: InteractionType
    notes: str
    interaction_date: datetime
    created_at: datetime
    updated_at: datetime
