from contextlib import contextmanager

import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = db.create_engine('mysql+pymysql://root:root@localhost/favorite')

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
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
