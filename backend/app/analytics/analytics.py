import pandas as pd
import numpy as np
from app import db
from app.models import Log, Metric
from sqlalchemy import select
from sklearn.cluster import KMeans
from scipy.stats import entropy


def get_metric_dataframe(user_id):
    query = (
        select(Log.timestamp, Log.value, Metric.name)
        .join(Metric, Log.metric_id == Metric.id)
        .where(Metric.user_id == user_id)
    )
    # open db connection with sqlalchemy
    with db.engine.connect() as conn:
        # read query into dataframe
        # stmt is select object, unexecuted query
        # use sqlalchemy engine to run query
        df = pd.read_sql(query, conn)
    return df


def get_pivoted_metrics(df):
    # return empty dataframe if empty
    if df.empty:
        return pd.DataFrame()
    pivoted = df.pivot_table(
        index='timestamp',
        columns='name',
        values='value',
    )
    # reset index to make timestamp a normal column for data manipulation
    return pivoted


def safe_calc(func):
    try:
        val = func()
        is_invalid = val.empty or val.isna().all() if isinstance(val, pd.Series) else pd.isna(val)
        return None if is_invalid else val
    except Exception:
        return None


def get_distributions(user_id, metric):
    df = get_metric_dataframe(user_id)
    pivoted = get_pivoted_metrics(df)
    # if table is empty return empty dict
    if pivoted.empty:
        return {}
    # convert to datetime obj
    pivoted.index = pd.to_datetime(pivoted.index)
    # define spans
    spans = {'week': 7, 'month': 30, 'year': 365}
    # get series spans
    series_spans = {}
    for key, value in spans.items():
        curr = pivoted.loc[
            pivoted.index.max() - pd.Timedelta(days=value):, 
            metric,
        ]
        prev = pivoted.loc[
            pivoted.index.max() - pd.Timedelta(days=value * 2):pivoted.index.max() - pd.Timedelta(days=value), 
            metric,
        ]
        series_spans[key] = {'curr': curr, 'prev': prev}
    # stats lambdas
    stats = {
        'middle': lambda s: s.median(),
        'spread': lambda s: (s - s.mean()).abs().mean(),
        'most common': lambda s: s.mode().iloc[0],
        'variety': lambda s: entropy(s.value_counts()/len(s)) if len(s) > 0 else None,
        'trend': lambda s: np.polyfit(s.index.map(pd.Timestamp.toordinal), s, 1)[0]
    }
    # package distribution
    distributions = {}   
    for span, series in series_spans.items():
        distributions[span] = {}
        for label, func in stats.items():
            curr_stat = safe_calc(lambda: func(series['curr']))
            prev_stat = safe_calc(lambda: func(series['prev']))
            distributions[span][label] = {
                'value': curr_stat,
                'prev': prev_stat,
                'change': ((curr_stat - prev_stat) / prev_stat) if prev_stat else None,
            }
    # return dict
    return distributions










def get_clusters(user_id):
    df = get_metric_dataframe(user_id)
    pivoted = get_pivoted_metrics(df)
    # if table is empty or has less than 10 rows return empty dict
    if pivoted.empty or pivoted.shape[0] < 10:
        return {}

    kmeans = KMeans(n_clusters=10, random_state=0)
    kmeans.fit(pivoted)
    # labels = kmeans.labels_
    # get averaged cluster values
    center = kmeans.cluster_centers_
    # convert to df then dict
    # use columns from pivoted to get metrics
    center_df = pd.DataFrame(center, columns=pivoted.columns)
    # orient records so each row is dict, not column
    return center_df.to_dict(orient='records')

def get_correlations(user_id, metric):
    df = get_metric_dataframe(user_id)
    pivoted = get_pivoted_metrics(df)
    # if table is empty return empty dict
    if pivoted.empty:
        return {}
    # if table has <= 1 column or row replace NaN values
    # 1 for self comparison, 0 for diagonal comparison
    # shape[1] columns, shape[0] rows
    if pivoted.shape[1] == 1 or pivoted.shape[0] == 1:
        default = pivoted.corr()
        for row in default.index:
            for col in default.columns:
                default.at[row, col] = 1 if row == col else 0
        metric_default = default[metric]
        correlations = {'week' : metric_default.to_dict(), 
                        'month': metric_default.to_dict(), 
                        'year': metric_default.to_dict(),
        }
        return correlations
    # get corrs in spans
    week = pivoted.tail(7).corr()[metric].to_dict()
    month = pivoted.tail(30).corr()[metric].to_dict()
    year = pivoted.tail(365).corr()[metric].to_dict()
    correlations = {'week' : week, 
                    'month': month, 
                    'year': year,
    }
    return correlations