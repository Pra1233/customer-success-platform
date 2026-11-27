import logging
import uuid
from datetime import datetime

from app.core.enums import InteractionType, Sentiment
from app.core.exceptions import NotFoundError
from app.core.rbac import owner_scope
from app.models.interaction import Interaction
from app.models.user import User
from app.repositories.interaction_repository import InteractionRepository
from app.schemas.interaction import InteractionCreate, InteractionUpdate
from app.services.cache_service import CacheService
from app.services.customer_service import CustomerService

logger = logging.getLogger(__name__)


class InteractionService:
    def __init__(
        self,
        interaction_repository: InteractionRepository,
        customer_service: CustomerService,
        cache_service: CacheService,
    ) -> None:
        self._interactions = interaction_repository
        self._customers = customer_service
        self._cache = cache_service

    def create(self, current_user: User, payload: InteractionCreate) -> Interaction:
        customer = self._customers.get(current_user, payload.customer_id)

        interaction = Interaction(
            customer_id=payload.customer_id,
            created_by=current_user.id,
            title=payload.title,
            type=payload.type,
            notes=payload.notes,
            interaction_date=payload.interaction_date,
        )
        interaction = self._interactions.add(interaction)
        self._cache.invalidate_dashboard(str(customer.owner_id))
        logger.info(
            "Interaction created id=%s customer_id=%s by user_id=%s",
            interaction.id,
            interaction.customer_id,
            current_user.id,
        )
        return interaction

    def list(
        self,
        current_user: User,
        *,
        customer_id: uuid.UUID | None = None,
        type_: InteractionType | None = None,
        sentiment: Sentiment | None = None,
        search: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[list[Interaction], int]:
        scope = owner_scope(current_user)
        items = self._interactions.list(
            owner_id=scope,
            customer_id=customer_id,
            type_=type_,
            sentiment=sentiment,
            search=search,
            date_from=date_from,
            date_to=date_to,
            offset=offset,
            limit=limit,
        )
        total = self._interactions.count(
            owner_id=scope,
            customer_id=customer_id,
            type_=type_,
            sentiment=sentiment,
            search=search,
            date_from=date_from,
            date_to=date_to,
        )
        return items, total

    def get(self, current_user: User, interaction_id: uuid.UUID) -> Interaction:
        scope = owner_scope(current_user)
        interaction = self._interactions.get_active(interaction_id, owner_id=scope)
        if interaction is None:
            raise NotFoundError(f"Interaction '{interaction_id}' not found")
        return interaction

    def update(
        self, current_user: User, interaction_id: uuid.UUID, payload: InteractionUpdate
    ) -> Interaction:
        interaction = self.get(current_user, interaction_id)
        changes = payload.model_dump(exclude_unset=True)
        interaction = self._interactions.update(interaction, changes)
        customer = self._customers.get(current_user, interaction.customer_id)
        self._cache.invalidate_dashboard(str(customer.owner_id))
        logger.info("Interaction updated id=%s by user_id=%s", interaction.id, current_user.id)
        return interaction
