import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.enums import InteractionType
from app.models.customer import Customer
from app.models.interaction import Interaction
from app.repositories.base import BaseRepository


class InteractionRepository(BaseRepository[Interaction]):
    model = Interaction

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def _base_query(self, *, owner_id: uuid.UUID | None):
        query = self.db.query(Interaction).filter(Interaction.deleted_at.is_(None))
        if owner_id is not None:
            query = query.join(Customer, Customer.id == Interaction.customer_id).filter(
                Customer.owner_id == owner_id
            )
        return query

    def get_active(self, interaction_id: uuid.UUID, *, owner_id: uuid.UUID | None) -> Interaction | None:
        return self._base_query(owner_id=owner_id).filter(Interaction.id == interaction_id).first()

    def list(
        self,
        *,
        owner_id: uuid.UUID | None,
        customer_id: uuid.UUID | None = None,
        type_: InteractionType | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> list[Interaction]:
        query = self._base_query(owner_id=owner_id)
        query = self._apply_filters(query, customer_id, type_, date_from, date_to)
        return query.order_by(Interaction.interaction_date.desc()).offset(offset).limit(limit).all()

    def count(
        self,
        *,
        owner_id: uuid.UUID | None,
        customer_id: uuid.UUID | None = None,
        type_: InteractionType | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> int:
        query = self._base_query(owner_id=owner_id)
        query = self._apply_filters(query, customer_id, type_, date_from, date_to)
        return query.count()

    @staticmethod
    def _apply_filters(query, customer_id, type_, date_from, date_to):
        if customer_id is not None:
            query = query.filter(Interaction.customer_id == customer_id)
        if type_ is not None:
            query = query.filter(Interaction.type == type_)
        if date_from is not None:
            query = query.filter(Interaction.interaction_date >= date_from)
        if date_to is not None:
            query = query.filter(Interaction.interaction_date <= date_to)
        return query

    def update(self, interaction: Interaction, changes: dict) -> Interaction:
        for field, value in changes.items():
            setattr(interaction, field, value)
        self.db.commit()
        self.db.refresh(interaction)
        return interaction
