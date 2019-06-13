from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

from app.utils import constants
from . import Base


class Audit(Base):
    __tablename__ = constants.AUDIT_TABLE

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(f"{constants.USERS_TABLE}.id"))
    user = relationship("User")
    favorite_thing_id = Column(Integer, ForeignKey(f"{constants.FAVORITE_THINGS_TABLE}.id"))
    favorite_thing = relationship("FavoriteThings")
    text = Column(String(32))

    def __init__(self, user_id: int, favorite_thing_id: int, text: str):
        self.text = text
        self.favorite_thing_id = favorite_thing_id
        self.user_id = user_id
