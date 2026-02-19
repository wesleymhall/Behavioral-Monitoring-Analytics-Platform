from dotenv import load_dotenv
import os

# load sensitive data from .env file
# this file should not be in version control
load_dotenv()

class Config:
    # session data is stored on the server side
    # client recieves a random session id in a signed cookie
    SESSION_TYPE = 'filesystem'
    # key is used to sign the session cookie
    # prevents clients from tampering with the cookie
    SECRET_KEY = os.getenv('SECRET_KEY')

    # get database URL
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    # do not track modifications to save performance
    SQLALCHEMY_TRACK_MODIFICATIONS = False