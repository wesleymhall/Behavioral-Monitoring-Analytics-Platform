import pandas as pd
import numpy as np
from scipy.stats import entropy
from .utils import get_metric_dataframe, get_pivoted_metrics, safe_calc

def get_stats(user_id, metric):
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
    stat_map = {
        'middle': lambda s: s.median(),
        'spread': lambda s: (s - s.mean()).abs().mean(),
        'common': lambda s: s.mode().iloc[0],
        'mix': lambda s: entropy(s.value_counts()/len(s)) if len(s) > 0 else None,
        #'trend': lambda s: np.polyfit(s.index.map(pd.Timestamp.toordinal), s, 1)[0]
    }
    # package stats
    stats = {}   
    for span, series in series_spans.items():
        stats[span] = {}
        for label, func in stat_map.items():
            curr_stat = safe_calc(lambda: func(series['curr']))
            prev_stat = safe_calc(lambda: func(series['prev']))
            stats[span][label] = {
                'value': curr_stat,
                'prev': prev_stat,
                'change': ((curr_stat - prev_stat) / prev_stat) if prev_stat else None,
            }
    # return dict
    return stats