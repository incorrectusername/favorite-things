import os
from contextlib import contextmanager

import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils.functions.database import create_database, database_exists

from app import log

if os.environ.get("DB_URI"):
    engine = db.create_engine(os.environ["DB_URI"])
else:
    engine = db.create_engine(
        'mysql+pymysql://admin:admin123@favorite.c1jc0lqfk06m.ap-south-1.rds.amazonaws.com/favorite')

if not database_exists(engine.url):
    create_database(engine.url)

Session = sessionmaker(bind=engine)

Base = declarative_base()

metadata = db.MetaData()
metadata.create_all(engine)


@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    session = Session()
    try:
        yield session
        session.commit()
    except Exception as e:
        log.exception(e)
        session.rollback()
        raise
    finally:
        session.close()
