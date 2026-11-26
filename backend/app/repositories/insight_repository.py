import uuid

from app.models.insight import Insight
from app.repositories.base import BaseRepository


class InsightRepository(BaseRepository[Insight]):
    model = Insight

    def list_for_interaction(self, interaction_id: uuid.UUID) -> list[Insight]:
        return (
            self.db.query(Insight)
            .filter(Insight.interaction_id == interaction_id)
            .order_by(Insight.created_at.desc())
            .all()
        )

    def get_latest_for_interaction(self, interaction_id: uuid.UUID) -> Insight | None:
        return (
            self.db.query(Insight)
            .filter(Insight.interaction_id == interaction_id)
            .order_by(Insight.created_at.desc())
            .first()
        )
