from app import db
from app.models import User, Metric, Log
from flask import Blueprint, request, jsonify, session
from datetime import datetime

log_bp = Blueprint('log', __name__)

@log_bp.route('/logmetric', methods=['POST'])
def log_metric():
    # check if user is logged in
    if 'username' not in session:
        return jsonify({'error': 'user not logged in'}), 401
    # get metric name, value, and date from request
    name = request.get_json().get('name')
    value = request.get_json().get('value')
    date_str = request.get_json().get('date')
    # convert date to python date object
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    if not name:
        return jsonify({'error': 'name not provided'}), 400
    if not value:
        return jsonify({'error': 'value not provided'}), 400
    if not date:
        return jsonify({'error': 'date not provided'}), 400
    # get username from session
    username = session['username']
    # query user from database
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404
    # find or create metric for the user
    metric = Metric.query.filter_by(name=name, user_id=user.id).first()
    if not metric:
        metric = Metric(name=name, user_id=user.id)
        db.session.add(metric)
        db.session.commit()
    # query for old log of metric on the date
    oldlog = Log.query.filter_by(timestamp=date, metric_id=metric.id).first()
    if oldlog:
        # return if log exists
        if oldlog.value == value:
            return jsonify({'message': 'redundant metric ignored'}), 200
        # else delete old log
        db.session.delete(oldlog)
    # create a new log object
    newlog = Log(value=value, timestamp=date, metric_id=metric.id)
    db.session.add(newlog)
    # commit the changes to the database
    db.session.commit()

    return jsonify({'message': 'metric logged successfully'}), 200

@log_bp.route('/createmetric', methods=['POST'])
def create_metric():
    # check if user is logged in
    if 'username' not in session:
        return jsonify({'error': 'user not logged in'}), 401
    # get metric name from request
    name = request.get_json().get('name')
    if not name:
        return jsonify({'error': 'name not provided'}), 400
    # get username from session
    username = session['username']
    # query user from database
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404
    # check if metric already exists for user
    existing_metric = Metric.query.filter_by(name=name, user_id=user.id).first()
    if existing_metric:
        return jsonify({'error': 'metric already exists'}), 400
    # create a new metric object
    new_metric = Metric(name=name, user_id=user.id)
    db.session.add(new_metric)
    # commit the changes to the database
    db.session.commit()

    return jsonify({'message': 'metric created successfully'}), 200


@log_bp.route('/deletelog', methods=['DELETE'])
def delete_log():
    # check if user is logged in
    if 'username' not in session:
        return jsonify({'error': 'user not logged in'}), 401
    # get date from request
    date_str = request.get_json().get('date')
    # convert date to python date object
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    if not date:
        return jsonify({'error': 'date not provided'}), 400
    # get username from session
    username = session['username']
    # query user from database
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404
    # get all metrics for user
    metrics = Metric.query.filter_by(user_id=user.id).all()
    # delete logs for metric on date
    for metric in metrics:
        date_logs = Log.query.filter_by(metric_id=metric.id, timestamp=date).all()
        for log in date_logs:
            db.session.delete(log)
    # commit the changes to the database
    db.session.commit()

    return jsonify({'message': f'logs deleted for {date_str}'}), 200