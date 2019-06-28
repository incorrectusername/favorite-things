from sqlalchemy import Column, ForeignKey, DateTime, String, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.utils import constants
from . import Base


class User(Base):
    id = Column(String(128), primary_key=True)
    email = Column(String(128), unique=True)
    password = Column(String(128))
    favorite_things = relationship("FavoriteThings", back_populates="user")
    created = Column(DateTime(timezone=True), default=func.now())

    def __init__(self, email, password):
        self.email = email
        self.password = password

    __tablename__ = constants.USERS_TABLE
    __table_args__ = (Index("user_email_idx", email),)


class FavoriteCategory(Base):
    id = Column(String(128), primary_key=True)
    category = Column(String(128), nullable=False)
    user_id = Column(String(128), ForeignKey(f"{constants.USERS_TABLE}.id"))
    user = relationship("User")

    UniqueConstraint(category, user_id)

    def __init__(self, category, user_id):
        self.user_id = user_id
        self.category = category

    __tablename__ = constants.USER_CATEGORY_MAPPER
    __table_args__ = (Index("user_category_idx", category, user_id, unique=True),)
