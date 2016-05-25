import os


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class Development(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/starmap.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class _Production(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SERVER_NAME = '0.0.0.0:80'

    def __init__(self):
        self.SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')


Production = _Production()
