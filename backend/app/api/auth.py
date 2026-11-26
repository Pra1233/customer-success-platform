from fastapi import APIRouter, Depends, status

from app.api.deps import get_auth_service, get_current_user
from app.models.user import User
from app.schemas.user import TokenResponse, UserLogin, UserOut, UserRegister
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegister, auth_service: AuthService = Depends(get_auth_service)
) -> TokenResponse:
    """Create a new user account and return an access token for it."""
    user, token = auth_service.register(payload)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLogin, auth_service: AuthService = Depends(get_auth_service)
) -> TokenResponse:
    """Authenticate with email/password and return an access token."""
    user, token = auth_service.login(payload)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def read_profile(current_user: User = Depends(get_current_user)) -> UserOut:
    """Return the profile of the currently authenticated user."""
    return UserOut.model_validate(current_user)
