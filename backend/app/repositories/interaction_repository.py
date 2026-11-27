from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.enums import InteractionType, Sentiment
from app.models.customer import Customer
from app.models.insight import Insight
from app.models.interaction import Interaction
from app.repositories.base import BaseRepository
from app.repositories.insight_queries import latest_insight_subquery


class InteractionRepository(BaseRepository[Interaction]):
    model = Interaction

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def _base_query(self, *, owner_id: uuid.UUID | None):
        query = (
            self.db.query(Interaction, Customer.name, Customer.company)
            .join(Customer, Customer.id == Interaction.customer_id)
            .filter(Interaction.deleted_at.is_(None))
        )
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        return query

    def get_active(self, interaction_id: uuid.UUID, *, owner_id: uuid.UUID | None) -> Interaction | None:
        row = self._base_query(owner_id=owner_id).filter(Interaction.id == interaction_id).first()
        if row is None:
            return None
        interaction = self._merge_row(row)
        self._attach_sentiment([interaction])
        return interaction

    def list(
        self,
        *,
        owner_id: uuid.UUID | None,
        customer_id: uuid.UUID | None = None,
        type_: InteractionType | None = None,
        sentiment: Sentiment | None = None,
        search: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> list[Interaction]:
        query = self._base_query(owner_id=owner_id)
        query = self._apply_filters(query, customer_id, type_, date_from, date_to, search)
        if sentiment is not None:
            query = self._filter_by_sentiment(query, sentiment)
        rows = query.order_by(Interaction.interaction_date.desc()).offset(offset).limit(limit).all()
        interactions = [self._merge_row(row) for row in rows]
        self._attach_sentiment(interactions)
        return interactions

    def count(
        self,
        *,
        owner_id: uuid.UUID | None,
        customer_id: uuid.UUID | None = None,
        type_: InteractionType | None = None,
        sentiment: Sentiment | None = None,
        search: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> int:
        query = self._base_query(owner_id=owner_id)
        query = self._apply_filters(query, customer_id, type_, date_from, date_to, search)
        if sentiment is not None:
            query = self._filter_by_sentiment(query, sentiment)
        return query.count()

    def _filter_by_sentiment(self, query, sentiment: Sentiment):
        latest_ids = latest_insight_subquery(self.db)
        return (
            query.join(Insight, Insight.interaction_id == Interaction.id)
            .join(latest_ids, latest_ids.c.latest_id == Insight.id)
            .filter(Insight.sentiment == sentiment)
        )

    @staticmethod
    def _apply_filters(query, customer_id, type_, date_from, date_to, search):
        if customer_id is not None:
            query = query.filter(Interaction.customer_id == customer_id)
        if type_ is not None:
            query = query.filter(Interaction.type == type_)
        if date_from is not None:
            query = query.filter(Interaction.interaction_date >= date_from)
        if date_to is not None:
            query = query.filter(Interaction.interaction_date <= date_to)
        if search:
            like = f"%{search}%"
            query = query.filter(or_(Interaction.title.ilike(like), Customer.name.ilike(like)))
        return query

    @staticmethod
    def _merge_row(row) -> Interaction:
        interaction, customer_name, customer_company = row
        interaction.customer_name = customer_name
        interaction.customer_company = customer_company
        return interaction

    def _attach_sentiment(self, interactions: list[Interaction]) -> None:
        if not interactions:
            return
        interaction_ids = [i.id for i in interactions]
        latest_ids = latest_insight_subquery(self.db)
        sentiment_rows = (
            self.db.query(Insight.interaction_id, Insight.sentiment)
            .join(latest_ids, latest_ids.c.latest_id == Insight.id)
            .filter(Insight.interaction_id.in_(interaction_ids))
            .all()
        )
        sentiment_by_interaction = {row.interaction_id: row.sentiment for row in sentiment_rows}
        for interaction in interactions:
            interaction.sentiment = sentiment_by_interaction.get(interaction.id)

    def update(self, interaction: Interaction, changes: dict) -> Interaction:
        for field, value in changes.items():
            setattr(interaction, field, value)
        self.db.commit()
        self.db.refresh(interaction)
        return interaction
