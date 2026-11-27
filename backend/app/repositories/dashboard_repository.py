import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import Sentiment
from app.models.customer import Customer
from app.models.insight import Insight
from app.models.interaction import Interaction
from app.repositories.insight_queries import latest_insight_subquery


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

    def sentiment_breakdown(self, owner_id: uuid.UUID | None) -> dict[str, int]:
        latest_ids = latest_insight_subquery(self.db)
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

    def weekly_sentiment_trend(self, owner_id: uuid.UUID | None, *, weeks: int = 6) -> list[dict]:
        latest_ids = latest_insight_subquery(self.db)
        since = datetime.now(timezone.utc) - timedelta(weeks=weeks)
        week_bucket = func.date_trunc("week", Interaction.interaction_date).label("week")

        query = (
            self.db.query(week_bucket, Insight.sentiment, func.count(Insight.id))
            .join(latest_ids, Insight.id == latest_ids.c.latest_id)
            .join(Interaction, Interaction.id == Insight.interaction_id)
            .filter(Interaction.deleted_at.is_(None))
            .filter(Interaction.interaction_date >= since)
        )
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        rows = query.group_by(week_bucket, Insight.sentiment).order_by(week_bucket).all()

        buckets: dict[str, dict[str, int]] = {}
        for week, sentiment, count in rows:
            key = week.date().isoformat()
            buckets.setdefault(key, {"positive": 0, "neutral": 0, "negative": 0})
            buckets[key][sentiment.value] = count

        return [{"week": week, **counts} for week, counts in sorted(buckets.items())]

    def customer_count_change_pct(self, owner_id: uuid.UUID | None) -> float | None:
        now = datetime.now(timezone.utc)
        window = timedelta(days=7)
        current = self._customers_created_between(owner_id, now - window, now)
        previous = self._customers_created_between(owner_id, now - 2 * window, now - window)
        return self._pct_change(current, previous)

    def interaction_count_change_pct(self, owner_id: uuid.UUID | None) -> float | None:
        now = datetime.now(timezone.utc)
        window = timedelta(days=7)
        current = self._interactions_between(owner_id, now - window, now)
        previous = self._interactions_between(owner_id, now - 2 * window, now - window)
        return self._pct_change(current, previous)

    def _customers_created_between(
        self, owner_id: uuid.UUID | None, start: datetime, end: datetime
    ) -> int:
        query = self.db.query(Customer).filter(
            Customer.deleted_at.is_(None),
            Customer.created_at >= start,
            Customer.created_at < end,
        )
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        return query.count()

    def _interactions_between(self, owner_id: uuid.UUID | None, start: datetime, end: datetime) -> int:
        query = self.db.query(Interaction).filter(
            Interaction.deleted_at.is_(None),
            Interaction.interaction_date >= start,
            Interaction.interaction_date < end,
        )
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        return query.count()

    @staticmethod
    def _pct_change(current: int, previous: int) -> float | None:
        if previous == 0:
            return None
        return round(((current - previous) / previous) * 100, 1)

    def negative_sentiment_alerts(self, owner_id: uuid.UUID | None, *, limit: int = 5) -> list[dict]:
        latest_ids = latest_insight_subquery(self.db)
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
