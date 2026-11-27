import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"


class CustomerStatus(str, enum.Enum):
    active = "active"
    churned = "churned"
    prospect = "prospect"


class InteractionType(str, enum.Enum):
    call = "call"
    email = "email"
    meeting = "meeting"


class Sentiment(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"


class InsightStatus(str, enum.Enum):
    processing = "processing"
    success = "success"
    failed = "failed"


class CustomerSortField(str, enum.Enum):
    last_interaction = "last_interaction"
    name = "name"
    company = "company"
