
import logging
import uuid

from app.core.config import settings
from app.core.enums import InsightStatus
from app.core.exceptions import ExternalServiceError
from app.models.insight import Insight
from app.models.user import User
from app.repositories.insight_repository import InsightRepository
from app.services.ai.prompts import PROMPT_VERSION
from app.services.ai.provider import AIProvider
from app.services.interaction_service import InteractionService

logger = logging.getLogger(__name__)


class InsightService:
    def __init__(
        self,
        insight_repository: InsightRepository,
        interaction_service: InteractionService,
        ai_provider: AIProvider,
    ) -> None:
        self._insights = insight_repository
        self._interactions = interaction_service
        self._ai_provider = ai_provider

    def generate(self, current_user: User, interaction_id: uuid.UUID) -> Insight:
        interaction = self._interactions.get(current_user, interaction_id)

        try:
            result = self._ai_provider.generate(interaction.notes)
            insight = Insight(
                interaction_id=interaction.id,
                summary=result.summary,
                sentiment=result.sentiment,
                action_items=[item.model_dump() for item in result.action_items],
                risks=[risk.model_dump() for risk in result.risks],
                status=InsightStatus.success,
                model_name=self._model_name(),
                prompt_version=PROMPT_VERSION,
            )
            logger.info("Insight generated successfully for interaction_id=%s", interaction.id)
        except ExternalServiceError as exc:
            insight = Insight(
                interaction_id=interaction.id,
                status=InsightStatus.failed,
                error_message=str(exc),
                model_name=self._model_name(),
                prompt_version=PROMPT_VERSION,
            )
            logger.warning(
                "Insight generation failed for interaction_id=%s: %s", interaction.id, exc
            )

        return self._insights.add(insight)

    def list_for_interaction(self, current_user: User, interaction_id: uuid.UUID) -> list[Insight]:
        self._interactions.get(current_user, interaction_id)
        return self._insights.list_for_interaction(interaction_id)

    @staticmethod
    def _model_name() -> str:
        return settings.ai_model_name
