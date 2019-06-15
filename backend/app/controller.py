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


@favorite_things.route("/favorite", methods=['POST'])
def create_new_favorite_thing():
    try:
        user_id = request.json["user_id"]
        title = request.json["title"]
        description = request.json.get("description")
        ranking = request.json.get("ranking")
        category = request.json.get("category")

        log.info(f"creating new favorite thing for user:{user_id}")

        core.save_new_favorite_thing(user_id, title, ranking, category, description)

        resp = Response(json.dumps({"success": True}), status=200, mimetype='application/json')
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
        favorite = core.update_favorite_thing(user_id, favorite_id, updates)

        resp = Response(json.dumps({"favorite": favorite}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp


@favorite_things.route("/favorites/user/<user_id>", methods=['GET'])
def get_favorite_things(user_id):
    try:

        log.info(f"Get all favorite items for user:{user_id}")
        favorites = core.get_all_favorite_items(user_id)

        resp = Response(json.dumps({"favorites": favorites}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp
