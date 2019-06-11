from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.utils import constants
from . import Base


class User(Base):
    __tablename__ = constants.USERS_TABLE

    id = Column(Integer, primary_key=True)
    email = Column(String(32), unique=True)
    password = Column(String(32))
    favorite_things = relationship("FavoriteThings", back_populates="user")

    def __init__(self, email, password):
        self.email = email
        self.password = password
