import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import InsightStatus, Sentiment
from app.models.customer import Customer
from app.models.insight import Insight
from app.models.interaction import Interaction


class DashboardRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def total_customers(self, owner_id: uuid.UUID | None) -> int:
        query = self.db.query(Customer).filter(Customer.deleted_at.is_(None))
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        return query.count()

    def customers_by_status(self, owner_id: uuid.UUID | None) -> dict[str, int]:
        query = self.db.query(Customer.status, func.count(Customer.id)).filter(
            Customer.deleted_at.is_(None)
        )
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        rows = query.group_by(Customer.status).all()
        return {status.value: count for status, count in rows}

    def total_interactions(self, owner_id: uuid.UUID | None) -> int:
        query = self.db.query(Interaction).filter(Interaction.deleted_at.is_(None))
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        return query.count()

    def interactions_by_type(self, owner_id: uuid.UUID | None) -> dict[str, int]:
        query = self.db.query(Interaction.type, func.count(Interaction.id)).filter(
            Interaction.deleted_at.is_(None)
        )
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        rows = query.group_by(Interaction.type).all()
        return {type_.value: count for type_, count in rows}

    def _latest_insight_per_interaction(self):
        return (
            self.db.query(Insight.id.label("latest_id"))
            .filter(Insight.status == InsightStatus.success)
            .order_by(Insight.interaction_id, Insight.created_at.desc())
            .distinct(Insight.interaction_id)
        ).subquery()

    def sentiment_breakdown(self, owner_id: uuid.UUID | None) -> dict[str, int]:
        latest_ids = self._latest_insight_per_interaction()
        query = (
            self.db.query(Insight.sentiment, func.count(Insight.id))
            .join(latest_ids, Insight.id == latest_ids.c.latest_id)
            .join(Interaction, Interaction.id == Insight.interaction_id)
            .filter(Interaction.deleted_at.is_(None))
        )
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        rows = query.group_by(Insight.sentiment).all()
        return {sentiment.value: count for sentiment, count in rows}

    def recent_interactions(self, owner_id: uuid.UUID | None, *, limit: int = 5) -> list[dict]:
        query = (
            self.db.query(Interaction, Customer.name)
            .join(Customer, Customer.id == Interaction.customer_id)
            .filter(Interaction.deleted_at.is_(None))
        )
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)

        rows = query.order_by(Interaction.interaction_date.desc()).limit(limit).all()
        return [
            {
                "id": str(interaction.id),
                "customer_id": str(interaction.customer_id),
                "customer_name": customer_name,
                "title": interaction.title,
                "type": interaction.type.value,
                "interaction_date": interaction.interaction_date.isoformat(),
            }
            for interaction, customer_name in rows
        ]

    def negative_sentiment_alerts(self, owner_id: uuid.UUID | None, *, limit: int = 5) -> list[dict]:
        latest_ids = self._latest_insight_per_interaction()
        query = (
            self.db.query(Insight, Interaction, Customer.name)
            .join(latest_ids, Insight.id == latest_ids.c.latest_id)
            .join(Interaction, Interaction.id == Insight.interaction_id)
            .join(Customer, Customer.id == Interaction.customer_id)
            .filter(Insight.sentiment == Sentiment.negative)
            .filter(Interaction.deleted_at.is_(None))
        )
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)

        rows = query.order_by(Insight.created_at.desc()).limit(limit).all()
        return [
            {
                "interaction_id": str(interaction.id),
                "customer_id": str(interaction.customer_id),
                "customer_name": customer_name,
                "summary": insight.summary,
            }
            for insight, interaction, customer_name in rows
        ]
