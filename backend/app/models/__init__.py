from contextlib import contextmanager

import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app import log

engine = db.create_engine('mysql+pymysql://admin:admin123@favorite.c1jc0lqfk06m.ap-south-1.rds.amazonaws.com/favorite')

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
