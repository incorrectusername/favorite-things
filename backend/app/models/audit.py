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

    def __init__(self, text):
        self.text = text
