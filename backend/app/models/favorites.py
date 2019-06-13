from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, String, Date, Index
from sqlalchemy.orm import relationship, validates

from app.models.users import FavoriteCategory
from app.utils import constants
from . import Base, session_scope


def _get_date():
    return datetime.now()


class FavoriteThings(Base):
    __tablename__ = constants.FAVORITE_THINGS_TABLE

    id = Column(Integer, primary_key=True)
    title = Column(String(32), nullable=False)
    description = Column(String(128))
    ranking = Column(Integer, nullable=False)
    category = Column(String(32), nullable=False)
    created = Column(Date, default=_get_date())
    updated = Column(Date, default=_get_date(), onupdate=_get_date())
    # TODO: metadata field

    user_id = Column(Integer, ForeignKey(f"{constants.USERS_TABLE}.id"))
    user = relationship("User", back_populates="favorite_things")

    def __init__(self, title, ranking: int, category: str, description: str = None):
        self.title = title
        self.description = description
        self.ranking = ranking
        self.category = category

    @validates("category")
    def validate_user_has_a_given_category(self, key, category):
        with session_scope() as session:
            assert category in session.query(FavoriteCategory).filter(FavoriteCategory.user_id == self.user_id).all()

        return category

    __table_args__ = (Index("category_ranking_idx", category, ranking),)
