from app import log
from . import core


def create_new_user(email: str, password: str):
    """
    Create and save new user
    :param email:
    :param password:
    :return:
    """
    if core.email_exists_in_user_table(email=email):
        raise Exception(f"Email f{email} already in use")
    log.info(f"creating new user with email:{email}")
    return core.save_new_user(email=email, password=password)
