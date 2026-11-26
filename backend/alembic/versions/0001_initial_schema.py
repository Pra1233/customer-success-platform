"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-11-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql as pg

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column(
            "role",
            sa.Enum("admin", "user", name="user_role"),
            nullable=False,
            server_default="user",
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "customers",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("company", sa.String(200), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(30), nullable=True),
        sa.Column(
            "status",
            sa.Enum("active", "churned", "prospect", name="customer_status"),
            nullable=False,
            server_default="prospect",
        ),
        sa.Column(
            "owner_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_customers_owner_id", "customers", ["owner_id"])
    op.create_index("ix_customers_status", "customers", ["status"])

    op.create_table(
        "interactions",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "customer_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("customers.id"),
            nullable=False,
        ),
        sa.Column(
            "created_by",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("title", sa.String(200), nullable=True),
        sa.Column(
            "type",
            sa.Enum("call", "email", "meeting", name="interaction_type"),
            nullable=False,
        ),
        sa.Column("notes", sa.Text(), nullable=False),
        sa.Column("interaction_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_interactions_customer_id", "interactions", ["customer_id"])
    op.create_index("ix_interactions_created_by", "interactions", ["created_by"])
    op.create_index("ix_interactions_interaction_date", "interactions", ["interaction_date"])

    op.create_table(
        "insights",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "interaction_id",
            pg.UUID(as_uuid=True),
            sa.ForeignKey("interactions.id"),
            nullable=False,
        ),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column(
            "sentiment",
            sa.Enum("positive", "neutral", "negative", name="sentiment"),
            nullable=True,
        ),
        sa.Column("action_items", pg.JSONB(), nullable=True),
        sa.Column("risks", pg.JSONB(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("processing", "success", "failed", name="insight_status"),
            nullable=False,
            server_default="processing",
        ),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("model_name", sa.String(100), nullable=True),
        sa.Column("prompt_version", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_insights_interaction_id", "insights", ["interaction_id"])
    op.create_index("ix_insights_sentiment", "insights", ["sentiment"])


def downgrade() -> None:
    op.drop_table("insights")
    op.drop_table("interactions")
    op.drop_table("customers")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS insight_status")
    op.execute("DROP TYPE IF EXISTS sentiment")
    op.execute("DROP TYPE IF EXISTS interaction_type")
    op.execute("DROP TYPE IF EXISTS customer_status")
    op.execute("DROP TYPE IF EXISTS user_role")
