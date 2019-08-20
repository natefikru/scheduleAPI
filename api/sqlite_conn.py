from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class Sqlite:
    engine = None
    session_maker = None

    @staticmethod
    def get_session(url):
        if not Sqlite.engine:
            Sqlite.engine = create_engine(url)
            Sqlite.session_maker = sessionmaker(bind=Sqlite.engine)
        return Sqlite.session_maker()

