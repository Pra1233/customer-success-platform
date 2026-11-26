import uuid
from datetime import datetime, timezone

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.enums import CustomerStatus
from app.models.customer import Customer
from app.repositories.base import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    model = Customer

    def __init__(self, db: Session) -> None:
        super().__init__(db)

    def _base_query(self):
        return self.db.query(Customer).filter(Customer.deleted_at.is_(None))

    def get_active(self, customer_id: uuid.UUID) -> Customer | None:
        return self._base_query().filter(Customer.id == customer_id).first()

    def list(
        self,
        *,
        owner_id: uuid.UUID | None = None,
        status: CustomerStatus | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> list[Customer]:
        query = self._base_query()

        if owner_id is not None:
            query = query.filter(Customer.owner_id == owner_id)
        if status is not None:
            query = query.filter(Customer.status == status)
        if search:
            like = f"%{search}%"
            query = query.filter(or_(Customer.name.ilike(like), Customer.company.ilike(like)))

        return query.order_by(Customer.created_at.desc()).offset(offset).limit(limit).all()

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
