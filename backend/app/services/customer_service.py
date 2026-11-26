import logging
import uuid

from app.core.enums import CustomerStatus, UserRole
from app.core.exceptions import ForbiddenError, NotFoundError
from app.core.rbac import owner_scope
from app.models.customer import Customer
from app.models.user import User
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.services.cache_service import CacheService

logger = logging.getLogger(__name__)


class CustomerService:
    def __init__(self, customer_repository: CustomerRepository, cache_service: CacheService) -> None:
        self._customers = customer_repository
        self._cache = cache_service

    def create(self, current_user: User, payload: CustomerCreate) -> Customer:
        customer = Customer(
            name=payload.name,
            company=payload.company,
            email=payload.email,
            phone=payload.phone,
            status=payload.status,
            owner_id=current_user.id,
        )
        customer = self._customers.add(customer)
        self._cache.invalidate_dashboard(str(customer.owner_id))
        logger.info("Customer created id=%s owner_id=%s", customer.id, current_user.id)
        return customer

    def list(
        self,
        current_user: User,
        *,
        status: CustomerStatus | None = None,
        search: str | None = None,
        offset: int = 0,
        limit: int = 50,
    ) -> tuple[list[Customer], int]:
        scope = owner_scope(current_user)
        items = self._customers.list(
            owner_id=scope, status=status, search=search, offset=offset, limit=limit
        )
        total = self._customers.count(owner_id=scope, status=status, search=search)
        return items, total

    def get(self, current_user: User, customer_id: uuid.UUID) -> Customer:
        customer = self._customers.get_active(customer_id)
        if customer is None:
            raise NotFoundError(f"Customer '{customer_id}' not found")
        self._assert_access(current_user, customer)
        return customer

    def update(self, current_user: User, customer_id: uuid.UUID, payload: CustomerUpdate) -> Customer:
        customer = self.get(current_user, customer_id)
        changes = payload.model_dump(exclude_unset=True)
        customer = self._customers.update(customer, changes)
        self._cache.invalidate_dashboard(str(customer.owner_id))
        logger.info("Customer updated id=%s by user_id=%s", customer.id, current_user.id)
        return customer

    def delete(self, current_user: User, customer_id: uuid.UUID) -> None:
        customer = self.get(current_user, customer_id)
        owner_id = customer.owner_id
        self._customers.soft_delete(customer)
        self._cache.invalidate_dashboard(str(owner_id))
        logger.info("Customer soft-deleted id=%s by user_id=%s", customer.id, current_user.id)

    @staticmethod
    def _assert_access(current_user: User, customer: Customer) -> None:
        if current_user.role != UserRole.admin and customer.owner_id != current_user.id:
            raise ForbiddenError("You do not have access to this customer")
