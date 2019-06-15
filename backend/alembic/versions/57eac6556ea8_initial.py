"""initial

Revision ID: 57eac6556ea8
Revises: 
Create Date: 2019-06-15 09:48:33.522962

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '57eac6556ea8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('sr', sa.Integer(), autoincrement=True, nullable=True),
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('email', sa.String(length=32), nullable=True),
    sa.Column('password', sa.String(length=32), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_index('user_email_idx', 'users', ['email'], unique=False)
    op.create_table('favorites',
    sa.Column('sr', sa.Integer(), autoincrement=True, nullable=True),
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('title', sa.String(length=32), nullable=False),
    sa.Column('description', sa.String(length=128), nullable=True),
    sa.Column('ranking', sa.Integer(), nullable=False),
    sa.Column('category', sa.String(length=32), nullable=False),
    sa.Column('created', sa.Date(), nullable=True),
    sa.Column('updated', sa.Date(), nullable=True),
    sa.Column('user_id', sa.String(length=32), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('category_ranking_idx', 'favorites', ['category', 'ranking'], unique=False)
    op.create_table('user_category',
    sa.Column('sr', sa.Integer(), autoincrement=True, nullable=True),
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('category', sa.String(length=32), nullable=False),
    sa.Column('user_id', sa.String(length=32), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('category', 'user_id')
    )
    op.create_index('user_category_idx', 'user_category', ['category', 'user_id'], unique=True)
    op.create_table('audit',
    sa.Column('sr', sa.Integer(), autoincrement=True, nullable=True),
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('user_id', sa.String(length=32), nullable=True),
    sa.Column('favorite_thing_id', sa.String(length=32), nullable=True),
    sa.Column('text', sa.String(length=32), nullable=False),
    sa.ForeignKeyConstraint(['favorite_thing_id'], ['favorites.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('audit')
    op.drop_index('user_category_idx', table_name='user_category')
    op.drop_table('user_category')
    op.drop_index('category_ranking_idx', table_name='favorites')
    op.drop_table('favorites')
    op.drop_index('user_email_idx', table_name='users')
    op.drop_table('users')
    # ### end Alembic commands ###
