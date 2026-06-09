"""initial schema

Revision ID: 20260609_211500
Revises:
Create Date: 2026-06-09 21:15:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260609_211500"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)

    op.create_table(
        "ipc_bns_maps",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ipc_section", sa.String(length=50), nullable=False),
        sa.Column("ipc_title", sa.String(length=255), nullable=False),
        sa.Column("bns_section", sa.String(length=50), nullable=False),
        sa.Column("bns_title", sa.String(length=255), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_ipc_bns_maps_bns_section"),
        "ipc_bns_maps",
        ["bns_section"],
        unique=False,
    )
    op.create_index(
        op.f("ix_ipc_bns_maps_ipc_section"),
        "ipc_bns_maps",
        ["ipc_section"],
        unique=False,
    )

    op.create_table(
        "query_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("query_text", sa.String(length=255), nullable=False),
        sa.Column("query_type", sa.String(length=50), nullable=False),
        sa.Column("result_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_query_history_user_id"),
        "query_history",
        ["user_id"],
        unique=False,
    )


def downgrade():
    op.drop_index(op.f("ix_query_history_user_id"), table_name="query_history")
    op.drop_table("query_history")
    op.drop_index(op.f("ix_ipc_bns_maps_ipc_section"), table_name="ipc_bns_maps")
    op.drop_index(op.f("ix_ipc_bns_maps_bns_section"), table_name="ipc_bns_maps")
    op.drop_table("ipc_bns_maps")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
