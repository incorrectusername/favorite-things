from sqlalchemy import Column, Integer, ForeignKey, String, Index, types, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.utils import constants
from . import Base


class FavoriteThings(Base):
    __tablename__ = constants.FAVORITE_THINGS_TABLE
    id = Column(String(128), primary_key=True)
    title = Column(String(125), nullable=False)
    description = Column(String(128), nullable=True)
    ranking = Column(Integer, nullable=False)
    category = Column(String(128), nullable=False)
    created = Column(DateTime(timezone=True), server_default=func.now())
    updated = Column(DateTime(timezone=True), default=func.now(),
                     onupdate=func.now())
    meta_data = Column(types.PickleType)
    user_id = Column(String(128), ForeignKey(f"{constants.USERS_TABLE}.id"))
    user = relationship("User", back_populates="favorite_things")

    def __init__(self, user_id: str, title, ranking: int, category: str, description: str = None):
        self.user_id = user_id
        self.title = title
        self.description = description
        self.ranking = ranking
        self.category = category

    __table_args__ = (Index("category_ranking_idx", category, ranking),)
