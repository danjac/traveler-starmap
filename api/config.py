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

    def __init__(self):
        self.SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
        self.SERVER_NAME = '0.0.0.0:{}'.format(os.environ['PORT'])
        print(os.environ)


Production = _Production()
