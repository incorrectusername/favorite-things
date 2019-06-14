from uuid import uuid1

from sqlalchemy import and_
from sqlalchemy.sql import exists

from app import log
from app.models import session_scope
from app.models.audit import Audit
from app.models.favorites import FavoriteThings
from app.models.users import User, FavoriteCategory


def email_exists_in_user_table(email: str):
    log.info(f"Checking if email {email} exists")
    with session_scope() as db_session:
        return db_session.query(exists().where(User.email == email)).scalar()


def save_new_user(email: str, password: str):
    new_user = User(email=email, password=password)
    new_user.id = str(uuid1())
    categories = ["person", "place", "food"]
    with session_scope() as db_session:
        db_session.add(new_user)

        # initialize user categories
        for category in categories:
            fav_cat = FavoriteCategory(category, new_user.id)
            fav_cat.id = str(uuid1())
            db_session.add(fav_cat)


def validate_user_credentials(email: str, password: str):
    with session_scope() as db_session:
        return db_session.query(User).filter(User.email == email, User.password == password).first().id


def create_new_audit_log(user_id: str, favorite_thing_id: str, msg: str):
    audit_log_record = Audit(user_id=user_id, favorite_thing_id=favorite_thing_id, text=msg)
    audit_log_record.id = str(uuid1())
    with session_scope() as db_session:
        db_session.add(audit_log_record)


def save_new_favorite_thing(user_id, title: str, ranking: int, category: str, description: str = None):
    log.debug(f"Check if rank:{ranking} is present for category:{category}")
    _ranking = ranking

    favorite_thing_id = str(uuid1())
    with session_scope() as db_session:
        # if rank assigned to new favorite thing is already in db
        if ranking is not None and rank_present_for_category(ranking, category):
            db_session.query(FavoriteThings).filter(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking >= ranking)).update({"ranking": FavoriteThings.ranking + 1})
        if ranking is None:
            _ranking = db_session.query(FavoriteThings).filter(FavoriteThings.user_id == user_id,
                                                               FavoriteThings.category == category).count() + 1
        favorite_thing = FavoriteThings(user_id=user_id, title=title, ranking=_ranking, category=category,
                                        description=description)
        favorite_thing.id = favorite_thing_id
        if (category,) not in get_categories_of_a_user(user_id):
            log.debug(f"creating new category:{category} for user:{user_id}")
            create_a_new_category_for_a_user(user_id, category)
        db_session.add(favorite_thing)

    create_new_audit_log(user_id=user_id, favorite_thing_id=favorite_thing_id, msg=f"Created new entry: {title}")


def get_favorite_thing_by_id(fav_id):
    with session_scope() as db_session:
        return db_session.query(FavoriteThings).filter(FavoriteThings.id == fav_id).first()


def create_a_new_category_for_a_user(user_id, category):
    with session_scope() as db_session:
        fav_cat = FavoriteCategory(category, user_id)
        fav_cat.id = str(uuid1())
        db_session.add(fav_cat)


def get_categories_of_a_user(user_id):
    with session_scope() as db_session:
        return db_session.query(FavoriteCategory.category).filter(
            FavoriteCategory.user_id == user_id).all()


def rank_present_for_category(rank: int, category: str):
    with session_scope() as db_session:
        return db_session.query(
            exists().where(and_(FavoriteThings.ranking == rank, FavoriteThings.category == category))).scalar()


def update_rank_of_fav_thing_for_a_given_category(user_id: str, favorite_thing_id: str, new_rank: str, category: str):
    with session_scope() as db_session:
        old_fav_thing = db_session.query(FavoriteThings).query(FavoriteThings.id == favorite_thing_id).first()

        old_rank = old_fav_thing.ranking
        _left = min(old_rank, new_rank)
        _right = max(new_rank, old_rank)

        if old_rank < new_rank:
            db_session.query(FavoriteThings).query(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking > _left, FavoriteThings.ranking <= _right)).update(
                {"ranking": FavoriteThings.ranking - 1})
        elif new_rank < old_rank:
            db_session.query(FavoriteThings).query(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking >= _left, FavoriteThings.ranking < _right)).update(
                {"ranking": FavoriteThings.ranking + 1})

        old_fav_thing.update({"ranking": new_rank})

    create_new_audit_log(user_id, favorite_thing_id,
                         msg=f"modified rank of title:{old_fav_thing.title} from {old_rank} to {new_rank}")
