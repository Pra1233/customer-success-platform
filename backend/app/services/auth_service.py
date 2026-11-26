import logging

from app.core.exceptions import ConflictError, ForbiddenError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserLogin, UserRegister

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, user_repository: UserRepository) -> None:
        self._users = user_repository

    def register(self, payload: UserRegister) -> tuple[User, str]:
        if self._users.get_by_email(payload.email):
            raise ConflictError(f"Email '{payload.email}' is already registered")

        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
        )
        user = self._users.add(user)
        logger.info("Registered new user id=%s email=%s", user.id, user.email)

        token = create_access_token(subject=str(user.id), role=user.role.value)
        return user, token

    def login(self, payload: UserLogin) -> tuple[User, str]:
        user = self._users.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.password_hash):
            logger.warning("Failed login attempt for email=%s", payload.email)
            raise UnauthorizedError("Invalid email or password")

        if not user.is_active:
            raise ForbiddenError("This account has been deactivated")

        token = create_access_token(subject=str(user.id), role=user.role.value)
        logger.info("User logged in id=%s email=%s", user.id, user.email)
        return user, token
