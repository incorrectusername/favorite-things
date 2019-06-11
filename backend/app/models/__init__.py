import sqlalchemy as db

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = db.create_engine('mysql+pymysql://root:root@localhost/favorite')

Session = sessionmaker(bind=engine)

Base = declarative_base()
