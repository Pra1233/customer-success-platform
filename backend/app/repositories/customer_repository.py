import uuid
from datetime import datetime, timezone

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.enums import CustomerSortField, CustomerStatus
from app.models.customer import Customer
from app.models.interaction import Interaction
from app.repositories.base import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    model = Customer

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def _base_query(self):
        return self.db.query(Customer).filter(Customer.deleted_at.is_(None))

    def get_active(self, customer_id: uuid.UUID) -> Customer | None:
        customer = self._base_query().filter(Customer.id == customer_id).first()
        if customer is not None:
            customer.last_interaction_at = self._last_interaction_for(customer.id)
        return customer

    def _last_interaction_subquery(self):
        return (
            self.db.query(
                Interaction.customer_id.label("customer_id"),
                func.max(Interaction.interaction_date).label("last_interaction_at"),
            )
            .filter(Interaction.deleted_at.is_(None))
            .group_by(Interaction.customer_id)
        ).subquery()

    def _last_interaction_for(self, customer_id: uuid.UUID) -> datetime | None:
        return (
            self.db.query(func.max(Interaction.interaction_date))
            .filter(Interaction.customer_id == customer_id, Interaction.deleted_at.is_(None))
            .scalar()
        )

    def list(
        self,
        *,
        owner_id: uuid.UUID | None = None,
        status: CustomerStatus | None = None,
        search: str | None = None,
        sort: CustomerSortField | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> list[Customer]:
        last_interaction = self._last_interaction_subquery()
        query = self._base_query().outerjoin(
            last_interaction, last_interaction.c.customer_id == Customer.id
        )

        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        if status is not None:
            query = query.filter(Customer.status == status)
        if search:
            like = f"%{search}%"
            query = query.filter(or_(Customer.name.ilike(like), Customer.company.ilike(like)))

        if sort == CustomerSortField.name:
            query = query.order_by(Customer.name.asc())
        elif sort == CustomerSortField.company:
            query = query.order_by(Customer.company.asc())
        elif sort == CustomerSortField.last_interaction:
            query = query.order_by(last_interaction.c.last_interaction_at.desc().nullslast())
        else:
            query = query.order_by(Customer.created_at.desc())

        rows = (
            query.add_columns(last_interaction.c.last_interaction_at)
            .offset(offset)
            .limit(limit)
            .all()
        )
        customers = []
        for customer, last_interaction_at in rows:
            customer.last_interaction_at = last_interaction_at
            customers.append(customer)
        return customers

    def count(
        self,
        *,
        owner_id: uuid.UUID | None = None,
        status: CustomerStatus | None = None,
        search: str | None = None,
    ) -> int:
        query = self._base_query()
        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        if status is not None:
            query = query.filter(Customer.status == status)
        if search:
            like = f"%{search}%"
            query = query.filter(or_(Customer.name.ilike(like), Customer.company.ilike(like)))
        return query.count()

    def update(self, customer: Customer, changes: dict) -> Customer:
        for field, value in changes.items():
            setattr(customer, field, value)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def soft_delete(self, customer: Customer) -> None:
        customer.deleted_at = datetime.now(timezone.utc)
        self.db.commit()
