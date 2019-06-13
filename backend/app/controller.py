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
        service.create_new_user(email=email, password=password)
        resp = Response(json.dumps({"success": True}), status=200, mimetype='application/json')
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
        exists = core.validate_user_credentials(email=email, password=password)
        resp = Response(json.dumps({"success": exists}), status=200, mimetype='application/json')
    except Exception as ex:
        log.exception(ex)
        resp = Response(json.dumps(getattr(ex, "args", ex)), status=400, mimetype='application/json')
    return resp
