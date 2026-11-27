import uuid

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_user, get_customer_service
from app.core.enums import CustomerSortField, CustomerStatus
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.customer import CustomerCreate, CustomerOut, CustomerUpdate
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: CustomerCreate,
    current_user: User = Depends(get_current_user),
    service: CustomerService = Depends(get_customer_service),
) -> CustomerOut:
    """Create a new customer owned by the current user."""
    customer = service.create(current_user, payload)
    return CustomerOut.model_validate(customer)


@router.get("", response_model=PaginatedResponse[CustomerOut])
def list_customers(
    status_filter: CustomerStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None, max_length=200),
    sort: CustomerSortField | None = Query(default=None),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    service: CustomerService = Depends(get_customer_service),
) -> PaginatedResponse[CustomerOut]:
    """List customers visible to the current user, with optional status/search filters, sorting, and pagination."""
    items, total = service.list(
        current_user, status=status_filter, search=search, sort=sort, offset=offset, limit=limit
    )
    return PaginatedResponse(
        items=[CustomerOut.model_validate(c) for c in items],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CustomerService = Depends(get_customer_service),
) -> CustomerOut:
    """Fetch a single customer by id."""
    customer = service.get(current_user, customer_id)
    return CustomerOut.model_validate(customer)


@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: uuid.UUID,
    payload: CustomerUpdate,
    current_user: User = Depends(get_current_user),
    service: CustomerService = Depends(get_customer_service),
) -> CustomerOut:
    """Update an existing customer's fields."""
    customer = service.update(current_user, customer_id, payload)
    return CustomerOut.model_validate(customer)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CustomerService = Depends(get_customer_service),
) -> None:
    """Soft-delete a customer."""
    service.delete(current_user, customer_id)
