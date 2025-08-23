import pandas as pd
from app import db
from app.models import Log, Metric
from sqlalchemy import select


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