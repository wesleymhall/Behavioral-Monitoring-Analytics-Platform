from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import os

# extensions
bcrypt = Bcrypt()
cors = CORS()
db = SQLAlchemy()
session = Session()

def create_app():
    app = Flask(__name__)

    # configure app with settings from config.py
    app.config.from_object('app.config.Config')

    # initialize extensions
    bcrypt.init_app(app)
    session.init_app(app)
    db.init_app(app)

    # CORS: restrict to frontend domain, support credentials (cookies/sessions)
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')  # default dev Vite URL
    cors.init_app(app, origins=[frontend_url], supports_credentials=True)

    # register blueprints from routes/__init__.py
    from .routes import auth_bp, dash_bp, log_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dash_bp, url_prefix='/dash')
    app.register_blueprint(log_bp, url_prefix='/log')

    # create tables
    from . import models
    with app.app_context():
        db.create_all()

    # return app instance
    return app