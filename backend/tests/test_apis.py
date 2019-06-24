import json
import os

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy_utils.functions.database import drop_database

from wsgi import __initialize_app

os.environ["DB_URI"] = "mysql+pymysql://root:root@localhost/favorite"


@pytest.fixture(scope="module")
def client():
    root_directory = os.path.join(os.path.dirname(os.getcwd()), "alembic")
    alembic_cfg = Config(root_directory + ".ini")
    alembic_cfg.set_main_option('script_location', root_directory)
    alembic_cfg.set_main_option('sqlalchemy.url', os.environ["DB_URI"])
    command.upgrade(alembic_cfg, 'head')

    client = __initialize_app()
    from app.models import engine, metadata
    metadata.create_all(engine)

    client.config.update({"TESTING": True, "DB_URI": "mysql+pymysql://root:root@localhost/favorite", "ENV": "TESTING"})

    _client = client.test_client()
    yield _client

    drop_database(os.environ["DB_URI"])


def test_create_user(client):
    response = client.post('/api/v1/signup',
                           json={"email": "yogesh@gupta.com", "password": "pass"})
    data = json.loads(response.data.decode('utf-8'))
    assert data["user"]["email"] == "yogesh@gupta.com"


def test_user_can_login(client):
    response = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert response.status_code == 200


def test_get_user_by_id(client):
    response = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert response.status_code == 200
    assert response.json["user"]["email"] == "yogesh@gupta.com"

    user_id = response.json["user"]["id"]

    user_resp = client.get(f"/api/v1/user/{user_id}")
    assert user_resp.status_code == 200
    assert user_resp.json["user"] == {"id": user_id, "email": "yogesh@gupta.com"}


def test_create_new_favorite_thing(client):
    user_resp = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert user_resp.status_code == 200
    assert user_resp.json["user"]["email"] == "yogesh@gupta.com"

    user_id = user_resp.json["user"]["id"]

    favorite_thing = {
        "user_id": user_id,
        "title": "some title",
        "ranking": 1,
        "category": "food"
    }
    resp = client.post("/api/v1/favorite", json=favorite_thing)

    assert resp.status_code == 200
    assert {
               "user_id": resp.json["user_id"],
               "title": resp.json["title"],
               "ranking": resp.json["ranking"],
               "category": resp.json["category"]
           } == favorite_thing

    fav_resp = client.get(f"/api/v1/favorites/user/{user_id}")
    assert fav_resp.status_code == 200
    assert len(fav_resp.json["favorites"]) == 1


def test_edit_new_favorite_thing(client):
    user_resp = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert user_resp.status_code == 200
    assert user_resp.json["user"]["email"] == "yogesh@gupta.com"

    user_id = user_resp.json["user"]["id"]

    fav_resp = client.get(f"/api/v1/favorites/user/{user_id}")
    assert fav_resp.status_code == 200
    assert len(fav_resp.json["favorites"]) == 1

    edits = {"description": "new description", "title": "edited title", "category": "person", "ranking": 1}
    edit_resp = client.put(f"/api/v1/user/{user_id}/favorite/{fav_resp.json['favorites'][0]['id']}", json=edits)
    assert edit_resp.status_code == 200
    assert edit_resp.json["favorite"]["title"] == edits["title"]
    assert edit_resp.json["favorite"]["description"] == edits["description"]
    assert edit_resp.json["favorite"]["category"] == edits["category"]


def test_get_categories_of_user(client):
    response = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert response.status_code == 200
    assert response.json["user"]["email"] == "yogesh@gupta.com"

    user_id = response.json["user"]["id"]

    user_categories_resp = client.get(f"/api/v1/favorites/category/user/{user_id}")
    assert user_categories_resp.status_code == 200
    assert len(user_categories_resp.json["categories"]) == 3


def test_save_new_category_for_user(client):
    response = client.post('/api/v1/login', json={"email": "yogesh@gupta.com", "password": "pass"})
    assert response.status_code == 200
    assert response.json["user"]["email"] == "yogesh@gupta.com"

    user_id = response.json["user"]["id"]

    user_categories_resp = client.get(f"/api/v1/favorites/category/user/{user_id}")
    assert user_categories_resp.status_code == 200
    assert len(user_categories_resp.json["categories"]) == 3

    user_add_categories_resp = client.post(f"/api/v1/favorites/category/user/{user_id}",
                                           json={"category": "new category"})
    assert user_add_categories_resp.status_code == 200

    user_categories_resp = client.get(f"/api/v1/favorites/category/user/{user_id}")
    assert user_categories_resp.status_code == 200
    assert len(user_categories_resp.json["categories"]) == 4
    assert "new category" in user_categories_resp.json["categories"]
