import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_user, get_interaction_service
from app.core.enums import InteractionType, Sentiment
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.interaction import InteractionCreate, InteractionOut, InteractionUpdate
from app.services.interaction_service import InteractionService

router = APIRouter(prefix="/api/interactions", tags=["interactions"])


@router.post("", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def create_interaction(
    payload: InteractionCreate,
    current_user: User = Depends(get_current_user),
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionOut:
    """Log a new interaction against a customer."""
    interaction = service.create(current_user, payload)
    return InteractionOut.model_validate(interaction)


@router.get("", response_model=PaginatedResponse[InteractionOut])
def list_interactions(
    customer_id: uuid.UUID | None = Query(default=None),
    type_filter: InteractionType | None = Query(default=None, alias="type"),
    sentiment: Sentiment | None = Query(default=None),
    search: str | None = Query(default=None, max_length=200),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    service: InteractionService = Depends(get_interaction_service),
) -> PaginatedResponse[InteractionOut]:
    """List interactions visible to the current user, with optional customer/type/sentiment/search/date filters and pagination."""
    items, total = service.list(
        current_user,
        customer_id=customer_id,
        type_=type_filter,
        sentiment=sentiment,
        search=search,
        date_from=date_from,
        date_to=date_to,
        offset=offset,
        limit=limit,
    )
    return PaginatedResponse(
        items=[InteractionOut.model_validate(i) for i in items],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.get("/{interaction_id}", response_model=InteractionOut)
def get_interaction(
    interaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionOut:
    """Fetch a single interaction by id."""
    interaction = service.get(current_user, interaction_id)
    return InteractionOut.model_validate(interaction)


@router.put("/{interaction_id}", response_model=InteractionOut)
def update_interaction(
    interaction_id: uuid.UUID,
    payload: InteractionUpdate,
    current_user: User = Depends(get_current_user),
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionOut:
    """Update an existing interaction's fields."""
    interaction = service.update(current_user, interaction_id, payload)
    return InteractionOut.model_validate(interaction)
