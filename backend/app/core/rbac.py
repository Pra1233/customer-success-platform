import uuid

from app.core.enums import UserRole
from app.models.user import User


def owner_scope(current_user: User) -> uuid.UUID | None:
    return None if current_user.role == UserRole.admin else current_user.id
