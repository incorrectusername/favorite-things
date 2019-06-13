import logging

import configuration

formatter = logging.Formatter(configuration.LOGGING_FORMAT, configuration.LOGGING_DATE_FORMAT)


def setup_logger(name, log_file, level=logging.DEBUG):
    """Function setup as many loggers as you want"""

    handler = logging.FileHandler(log_file)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger


log = setup_logger(__name__, "favorite_things.log")
