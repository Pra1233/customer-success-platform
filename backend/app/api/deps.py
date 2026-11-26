import uuid

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.enums import UserRole
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.redis_client import redis_client
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.customer_repository import CustomerRepository
from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.insight_repository import InsightRepository
from app.repositories.interaction_repository import InteractionRepository
from app.repositories.user_repository import UserRepository
from app.services.ai.provider import AIProvider, OpenAIProvider
from app.services.auth_service import AuthService
from app.services.cache_service import CacheService
from app.services.customer_service import CustomerService
from app.services.dashboard_service import DashboardService
from app.services.insight_service import InsightService
from app.services.interaction_service import InteractionService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


def get_customer_repository(db: Session = Depends(get_db)) -> CustomerRepository:
    return CustomerRepository(db)


def get_interaction_repository(db: Session = Depends(get_db)) -> InteractionRepository:
    return InteractionRepository(db)


def get_insight_repository(db: Session = Depends(get_db)) -> InsightRepository:
    return InsightRepository(db)


def get_dashboard_repository(db: Session = Depends(get_db)) -> DashboardRepository:
    return DashboardRepository(db)


def get_ai_provider() -> AIProvider:
    return OpenAIProvider()


def get_cache_service() -> CacheService:
    return CacheService(redis_client)


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(user_repository)


def get_customer_service(
    customer_repository: CustomerRepository = Depends(get_customer_repository),
    cache_service: CacheService = Depends(get_cache_service),
) -> CustomerService:
    return CustomerService(customer_repository, cache_service)


def get_interaction_service(
    interaction_repository: InteractionRepository = Depends(get_interaction_repository),
    customer_service: CustomerService = Depends(get_customer_service),
    cache_service: CacheService = Depends(get_cache_service),
) -> InteractionService:
    return InteractionService(interaction_repository, customer_service, cache_service)


def get_insight_service(
    insight_repository: InsightRepository = Depends(get_insight_repository),
    interaction_service: InteractionService = Depends(get_interaction_service),
    ai_provider: AIProvider = Depends(get_ai_provider),
) -> InsightService:
    return InsightService(insight_repository, interaction_service, ai_provider)


def get_dashboard_service(
    dashboard_repository: DashboardRepository = Depends(get_dashboard_repository),
    cache_service: CacheService = Depends(get_cache_service),
) -> DashboardService:
    return DashboardService(dashboard_repository, cache_service)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    payload = decode_access_token(token)
    if payload is None or "sub" not in payload:
        raise UnauthorizedError("Could not validate credentials")

    user = db.get(User, uuid.UUID(payload["sub"]))
    if user is None or not user.is_active:
        raise UnauthorizedError("Could not validate credentials")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.admin:
        raise ForbiddenError("Admin privileges required")
    return current_user
