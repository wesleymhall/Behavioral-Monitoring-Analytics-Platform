from app import db
from app.models import User, Metric, Log
from app.analytics import get_stats, get_correlations, get_clusters
from flask import Blueprint, jsonify, session 

dash_bp = Blueprint('dash', __name__)


@dash_bp.route('/getlogs', methods=['GET'])
def get_logs():
    # check if user is logged in
    if 'username' not in session:
        return jsonify({'error': 'user not logged in'}), 401
    # get username from session
    username = session['username']
    # query user from database
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'user not found'}), 404
    # get metrics for the user
    metrics = Metric.query.filter_by(user_id=user.id).all()
    # create a list of metrics logs
    metrics_logs = []
    for metric in metrics:
        logs = Log.query.filter_by(metric_id=metric.id).all()
        logs_data = [{'id': log.id, 'value': log.value, 'timestamp': log.timestamp} for log in logs]
        metrics_logs.append({'metric': metric.name, 'logs': logs_data})
    # get analytics
    #analytics = get_analytics(user, metrics)
    return jsonify({
        'metrics_logs': metrics_logs,
        'username': username,
        #'analytics' : analytics,
        'streak' : user.streak or 0,
    }), 200


def get_analytics(user, metrics):
    stats = {}
    connects = {}
    patterns = get_clusters(user.id)
    for metric in metrics:
        stats[metric.name] = get_stats(user.id, metric.name)
        connects[metric.name] = get_correlations(user.id, metric.name)
    return {
        'stats': stats,
        'connects': connects,
        'patterns': patterns,
    }
    