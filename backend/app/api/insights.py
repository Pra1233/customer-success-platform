import uuid

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_insight_service
from app.models.user import User
from app.schemas.insight import InsightOut
from app.services.insight_service import InsightService

router = APIRouter(prefix="/api/interactions/{interaction_id}/insights", tags=["insights"])


@router.post("", response_model=InsightOut, status_code=status.HTTP_201_CREATED)
def generate_insight(
    interaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InsightService = Depends(get_insight_service),
) -> InsightOut:
    """Generates (or re-generates) an AI insight. Always returns 201 — check
    the `status` field to see whether generation actually succeeded; a
    `failed` result is still a valid, persisted record, not an HTTP error."""
    insight = service.generate(current_user, interaction_id)
    return InsightOut.model_validate(insight)


@router.get("", response_model=list[InsightOut])
def list_insights(
    interaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InsightService = Depends(get_insight_service),
) -> list[InsightOut]:
    """List all AI insights generated for an interaction, most recent first."""
    insights = service.list_for_interaction(current_user, interaction_id)
    return [InsightOut.model_validate(i) for i in insights]
