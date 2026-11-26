import logging

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.enums import UserRole
from app.core.logging_config import configure_logging
from app.core.security import hash_password
from app.models.user import User
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)


def seed_admin() -> None:
    if not settings.seed_admin_email or not settings.seed_admin_password:
        return

    db = SessionLocal()
    try:
        users = UserRepository(db)
        if users.get_by_email(settings.seed_admin_email):
            return

        admin = User(
            name=settings.seed_admin_name,
            email=settings.seed_admin_email,
            password_hash=hash_password(settings.seed_admin_password),
            role=UserRole.admin,
        )
        users.add(admin)
        logger.info("Seeded default admin account email=%s", settings.seed_admin_email)
    finally:
        db.close()


if __name__ == "__main__":
    configure_logging()
    seed_admin()
