import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.core.enums import CustomerStatus


class CustomerCreate(BaseModel):
    name: str
    company: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    status: CustomerStatus = CustomerStatus.prospect


class CustomerUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    status: CustomerStatus | None = None


class CustomerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    company: str | None
    email: str | None
    phone: str | None
    status: CustomerStatus
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
