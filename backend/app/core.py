import datetime
from uuid import uuid1

from app import log
from app.models import session_scope
from app.models.audit import Audit
from app.models.favorites import FavoriteThings
from app.models.users import User, FavoriteCategory
from sqlalchemy import and_
from sqlalchemy.orm import class_mapper
from sqlalchemy.sql import exists


def serialize(model):
    """Transforms a model into a dictionary which can be dumped to JSON."""
    # first we get the names of all the columns on your model
    columns = [c.key for c in class_mapper(model.__class__).columns]
    # then we return their values in a dict
    return dict((c, getattr(model, c)) for c in columns)


def make_user_from_object(user):
    return {
        "email": user.email,
        "id": user.id
    }


def email_exists_in_user_table(email: str):
    log.info(f"Checking if email {email} exists")
    with session_scope() as db_session:
        return db_session.query(exists().where(User.email == email)).scalar()


def save_new_user(email: str, password: str):
    new_user = User(email=email, password=password)
    user_id = str(uuid1())
    new_user.id = user_id
    categories = ["person", "place", "food"]
    with session_scope() as db_session:
        db_session.add(new_user)

        # initialize user categories
        for category in categories:
            fav_cat = FavoriteCategory(category, new_user.id)
            fav_cat.id = str(uuid1())
            db_session.add(fav_cat)

        return {
            "id": user_id,
            "email": email
        }


def validate_user_credentials(email: str, password: str):
    with session_scope() as db_session:
        return make_user_from_object(
            db_session.query(User).filter(User.email == email, User.password == password).first())


def get_user_by_id(user_id: str):
    with session_scope() as db_session:
        return make_user_from_object(
            db_session.query(User).filter(User.id == user_id).first())


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

            old_fav_things = db_session.query(FavoriteThings).filter(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking >= ranking))
            if old_fav_things:
                old_fav_things.update({"ranking": FavoriteThings.ranking + 1})
        if ranking is None:
            _ranking = db_session.query(FavoriteThings).filter(FavoriteThings.user_id == user_id,
                                                               FavoriteThings.category == category).count() + 1
        favorite_thing = FavoriteThings(user_id=user_id, title=title, ranking=_ranking, category=category,
                                        description=description)
        favorite_thing.id = favorite_thing_id
        if category not in get_categories_of_a_user(user_id):
            log.debug(f"creating new category:{category} for user:{user_id}")
            create_a_new_category_for_a_user(user_id, category)
        db_session.add(favorite_thing)

    create_new_audit_log(user_id=user_id, favorite_thing_id=favorite_thing_id, msg=f"Created new entry: {title}")

    # get by id did not work
    return {
        "id": favorite_thing_id,
        "title": title,
        "description": description,
        "ranking": ranking,
        "category": category,
        "created": datetime.datetime.now(),
        "updated": datetime.datetime.now(),
        "user_id": user_id
    }


def update_favorite_thing(user_id: str, favorite_id: str, favorite_thing: dict):  # noqa: C901
    with session_scope() as db_session:
        valid_user = db_session.query(exists().where(and_(User.id == user_id))).scalar()

        if not valid_user:
            raise Exception(f"No user with id:{user_id}")

        old_favorite_thing = db_session.query(FavoriteThings).get(favorite_id)

        audit_log_msgs = []

        updates = {}
        category_updated = False
        if favorite_thing.get("title") and favorite_thing.get("title") != old_favorite_thing.title:
            audit_log_msgs.append(f"Updated title from {old_favorite_thing.title} to {favorite_thing.get('title')}")
            updates["title"] = favorite_thing.get("title")

        if favorite_thing.get("description") and favorite_thing.get("description") != old_favorite_thing.description:
            audit_log_msgs.append(f"Updated description to {favorite_thing.get('description')}")
            updates["description"] = favorite_thing.get("description")

        if favorite_thing.get("category") and favorite_thing.get("category") != old_favorite_thing.ranking:
            category_updated = old_favorite_thing.category != favorite_thing.get("category")
            if category_updated:
                audit_log_msgs.append(
                    f"updated category to {favorite_thing.get('category')}")

        if favorite_thing.get("ranking"):
            audit_log_msgs.append(
                f"Updated ranking from {old_favorite_thing.ranking} to {favorite_thing.get('ranking')}")
            if category_updated:
                _rank = int(favorite_thing.get("ranking"))
                new_category_count = db_session.query(FavoriteThings).filter(FavoriteThings.user_id == user_id,
                                                                             FavoriteThings.category == favorite_thing.get(
                                                                                 'category')).count()
                if new_category_count < _rank:
                    _rank = new_category_count + 1
                update_rank_when_category_is_changed(user_id, favorite_id, _rank, favorite_thing.get('category'))

            elif favorite_thing.get("ranking") != old_favorite_thing.ranking:
                update_rank_of_fav_thing_for_a_given_category(user_id, favorite_id, int(favorite_thing['ranking']),
                                                              old_favorite_thing.category)

        if favorite_thing.get("meta_data"):
            audit_log_msgs.append(f"updated metadata:{favorite_thing.get('metadata')}")
            updates["meta_data"] = favorite_thing.get("meta_data")

        db_session.query(FavoriteThings).filter(FavoriteThings.id == favorite_id).update(updates)

    for msg in audit_log_msgs:
        create_new_audit_log(user_id, favorite_id, msg)
    with session_scope() as db_session:
        return serialize(db_session.query(FavoriteThings).get(favorite_id))


def get_favorite_thing_by_id(fav_id):
    with session_scope() as db_session:
        return serialize(db_session.query(FavoriteThings).filter(FavoriteThings.id == fav_id).first())


def create_a_new_category_for_a_user(user_id, category):
    with session_scope() as db_session:
        fav_cat = FavoriteCategory(category, user_id)
        fav_cat.id = str(uuid1())
        db_session.add(fav_cat)


def get_categories_of_a_user(user_id):
    with session_scope() as db_session:
        return [category[0] for category in db_session.query(FavoriteCategory.category).filter(
            FavoriteCategory.user_id == user_id).all()]


def rank_present_for_category(rank: int, category: str):
    with session_scope() as db_session:
        return db_session.query(
            exists().where(and_(FavoriteThings.ranking == rank, FavoriteThings.category == category))).scalar()


def update_rank_when_category_is_changed(user_id: str, favorite_thing_id: str, new_rank: int, new_category: str):
    with session_scope() as db_session:
        old_fav_thing = db_session.query(FavoriteThings).filter(FavoriteThings.id == favorite_thing_id).first()

        # decrease ranking of other fav items of old category
        db_session.query(FavoriteThings).filter(and_(
            FavoriteThings.category == old_fav_thing.category,
            FavoriteThings.user_id == user_id,
            FavoriteThings.ranking > old_fav_thing.ranking
        )).update({"ranking": FavoriteThings.ranking - 1})

        # increase ranking of other fav items of new category
        db_session.query(FavoriteThings).filter(and_(
            FavoriteThings.category == new_category,
            FavoriteThings.user_id == user_id,
            FavoriteThings.ranking >= new_rank
        )).update({"ranking": FavoriteThings.ranking + 1})

        old_fav_thing.ranking = new_rank
        old_fav_thing.category = new_category


def update_rank_of_fav_thing_for_a_given_category(user_id: str, favorite_thing_id: str, new_rank: int, category: str):
    with session_scope() as db_session:
        old_fav_thing = db_session.query(FavoriteThings).filter(FavoriteThings.id == favorite_thing_id).first()
        old_title = old_fav_thing.title
        old_rank = old_fav_thing.ranking
        _left = min(old_rank, new_rank)
        _right = max(new_rank, old_rank)

        if old_rank < new_rank:
            db_session.query(FavoriteThings).filter(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking > _left, FavoriteThings.ranking <= _right)).update(
                {"ranking": FavoriteThings.ranking - 1})
        elif new_rank < old_rank:
            db_session.query(FavoriteThings).filter(
                and_(FavoriteThings.user_id == user_id, FavoriteThings.category == category,
                     FavoriteThings.ranking >= _left, FavoriteThings.ranking < _right)).update(
                {"ranking": FavoriteThings.ranking + 1})

        old_fav_thing.ranking = new_rank

    if old_rank != new_rank:
        create_new_audit_log(user_id, favorite_thing_id,
                             msg=f"modified rank of title:{old_title} from {old_rank} to {new_rank}")


def get_all_favorite_items(user_id: str):
    with session_scope() as db_session:
        return [
            serialize(item)
            for item in db_session.query(FavoriteThings).filter(FavoriteThings.user_id == user_id).all()]


def get_all_favorite_items_of_category(user_id: str, category: str):
    with session_scope() as db_session:
        return [
            serialize(item)
            for item in db_session.query(FavoriteThings).filter(FavoriteThings.user_id == user_id,
                                                                FavoriteThings.category == category).all()]


def get_all_categories_of_user(user_id):
    with session_scope() as db_session:
        return [
            serialize(item)
            for item in db_session.query(FavoriteCategory).filter(FavoriteCategory.user_id == user_id).all()]


def get_logs_of_favorite_thing(user_id: str, favorite_thing_id: str):
    with session_scope() as db_session:
        return [serialize(_log)
                for _log in db_session.query(Audit).filter(Audit.user_id == user_id,
                                                           Audit.favorite_thing_id == favorite_thing_id).all()
                ]
