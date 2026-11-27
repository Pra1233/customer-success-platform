from sqlalchemy.orm import Session

from app.core.enums import InsightStatus
from app.models.insight import Insight


def latest_insight_subquery(db: Session):
    return (
        db.query(Insight.id.label("latest_id"))
        .filter(Insight.status == InsightStatus.success)
        .order_by(Insight.interaction_id, Insight.created_at.desc())
        .distinct(Insight.interaction_id)
    ).subquery()
