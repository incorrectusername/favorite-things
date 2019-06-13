from flask import Flask
from flask_cors import CORS

from app import setup_logger
from app.controller import favorite_things

log = setup_logger(__name__, __name__ + ".log")


def __initialize_app():
    CORS(favorite_things)

    #  Start the flask flask_server
    flask_server = Flask(__name__)

    flask_server.register_blueprint(favorite_things, url_prefix="/api/v1")

    return flask_server


server = __initialize_app()

if __name__ == "__main__":
    server.run(host="0.0.0.0", port=8080)
