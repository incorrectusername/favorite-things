import json

from flask import Blueprint, Response, request

from app import log
from . import service, core

favorite_things = Blueprint('favorite_things', __name__)


@favorite_things.route("/signup", methods=['POST'])
def save_new_user():
    try:
        log.info("signup new user")
        email = request.json["email"]
        password = request.json["password"]
        user = service.create_new_user(email=email, password=password)
        resp = Response(json.dumps({"user": user}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/login", methods=['POST'])
def login_user():
    try:
        log.info("login new user")
        email = request.json["email"]
        password = request.json["password"]
        user = core.validate_user_credentials(email=email, password=password)
        resp = Response(json.dumps({"user": user}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps({"message": "No such user. please check email or password."}), status=400,
                        mimetype='application/json')
    return resp


@favorite_things.route("/user/<user_id>", methods=['GET'])
def get_user_by_id(user_id):
    try:
        log.info("GET user by id")
        user = core.get_user_by_id(user_id)
        resp = Response(json.dumps({"user": user}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps({"message": "No such user. "}), status=400,
                        mimetype='application/json')
    return resp


@favorite_things.route("/favorite", methods=['POST'])
def create_new_favorite_thing():
    try:
        user_id = request.json["user_id"]
        title = request.json["title"]
        description = request.json.get("description")
        ranking = request.json.get("ranking")
        category = request.json.get("category")

        log.info(f"creating new favorite thing for user:{user_id}")

        item = core.save_new_favorite_thing(user_id, title, ranking, category.lower(), description)
        resp = Response(json.dumps(item, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/user/<user_id>/favorite/<favorite_id>", methods=['PUT'])
def edit_favorite_thing(user_id, favorite_id):
    try:

        title = request.json.get("title")
        description = request.json.get("description")
        ranking = request.json.get("ranking")
        meta_data = request.json.get("meta_data")
        category = request.json.get("category")

        log.info(f"Editing new favorite thing:{favorite_id} for user:{user_id}")
        updates = {
            "title": title,
            "description": description,
            "ranking": ranking,
            "category": category,
            "meta_data": meta_data
        }
        filtered = {k: v for k, v in updates.items() if v is not None}
        updates.clear()
        updates.update(filtered)

        log.debug("Got item to update:{}".format(updates))

        favorite = core.update_favorite_thing(user_id, favorite_id, updates)

        resp = Response(json.dumps({"favorite": favorite}, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/favorites/user/<user_id>", methods=['GET'])
def get_favorite_things(user_id):
    try:
        category = request.args.get("category")
        if category:
            log.info(f"Get favorite items of category:{category} for user:{user_id}")
            favorites = service.get_favorite_things_of_user_by_category(user_id, category)
        else:
            log.info(f"Get all favorite items for user:{user_id}")
            favorites = core.get_all_favorite_items(user_id)

        resp = Response(json.dumps({"favorites": favorites}, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/favorites/category/user/<user_id>", methods=['GET'])
def get_favorite_categories(user_id):
    try:
        log.info(f"get all favorite categories of user:{user_id}")
        categories = core.get_categories_of_a_user(user_id)
        resp = Response(json.dumps({"categories": categories}, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/favorites/category/user/<user_id>", methods=['POST'])
def save_new_favorite_categories(user_id):
    try:
        category = request.json["category"].lower()
        log.info(f"Save new favorite category:{category} of user:{user_id}")

        if category not in core.get_all_favorite_items(user_id):
            core.create_a_new_category_for_a_user(user_id, category)

        categories = core.get_categories_of_a_user(user_id)
        resp = Response(json.dumps({"categories": categories}, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/logs/user/<user_id>/favorite/<favorite_id>", methods=["GET"])
def get_audit_logs(user_id: str, favorite_id: str):
    try:
        log.info(f"Get all log related to favorite item:{favorite_id} for user:{user_id}")
        logs = core.get_logs_of_favorite_thing(user_id, favorite_id)
        resp = Response(json.dumps({"logs": logs}, default=str), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp
