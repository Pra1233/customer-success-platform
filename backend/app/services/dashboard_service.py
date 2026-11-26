import logging

from app.core.config import settings
from app.core.rbac import owner_scope
from app.models.user import User
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardOut
from app.services.cache_service import CacheService

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(
        self,
        dashboard_repository: DashboardRepository,
        cache_service: CacheService,
    ) -> None:
        self._repo = dashboard_repository
        self._cache = cache_service

    def get_dashboard(self, current_user: User) -> DashboardOut:
        owner_id = owner_scope(current_user)
        cache_key = self._cache.dashboard_key(str(owner_id) if owner_id else None)

        cached = self._cache.get_json(cache_key)
        if cached is not None:
            logger.debug("Dashboard cache hit for key=%s", cache_key)
            return DashboardOut.model_validate(cached)

        logger.debug("Dashboard cache miss for key=%s, computing", cache_key)
        payload = {
            "total_customers": self._repo.total_customers(owner_id),
            "total_interactions": self._repo.total_interactions(owner_id),
            "customers_by_status": self._repo.customers_by_status(owner_id),
            "interactions_by_type": self._repo.interactions_by_type(owner_id),
            "sentiment_breakdown": self._repo.sentiment_breakdown(owner_id),
            "recent_interactions": self._repo.recent_interactions(owner_id),
            "negative_sentiment_alerts": self._repo.negative_sentiment_alerts(owner_id),
        }

        self._cache.set_json(cache_key, payload, ttl_seconds=settings.dashboard_cache_ttl_seconds)
        return DashboardOut.model_validate(payload)
