from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

from app.utils import constants
from . import Base


class FavoriteThings(Base):
    __tablename__ = constants.FAVORITE_THINGS_TABLE

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(f"{constants.USERS_TABLE}.id"))
    user = relationship("User", back_populates="favorite_things")

    title = Column(String(32))

    def __init__(self, title):
        self.title = title
