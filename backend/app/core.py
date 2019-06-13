from sqlalchemy import and_
from sqlalchemy.sql import exists

from app import log
from app.models import session_scope
from app.models.users import User, FavoriteCategory


def email_exists_in_user_table(email: str):
    log.info(f"Checking if email {email} exists")
    with session_scope() as db_session:
        return db_session.query(exists().where(User.email == email)).scalar()


def save_new_user(email: str, password: str):
    new_user = User(email=email, password=password)
    categories = ["person", "place", "food"]
    with session_scope() as db_session:
        db_session.add(new_user)

        # initialize user categories
        for category in categories:
            db_session.add(FavoriteCategory(category, new_user))


def validate_user_credentials(email: str, password: str):
    with session_scope() as db_session:
        return db_session.query(exists().where(and_(User.email == email, User.password == password))).scalar()
