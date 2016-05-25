import os


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PORT = 5000
    HOST = '127.0.0.1'


class Development(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:////tmp/starmap.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class _Production(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    HOST = '0.0.0.0'

    def __init__(self):
        self.SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
        self.PORT = os.environ['PORT']


Production = _Production()
