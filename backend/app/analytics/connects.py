from .utils import get_metric_dataframe, get_pivoted_metrics


def get_correlations(user_id, metric):
    df = get_metric_dataframe(user_id)
    pivoted = get_pivoted_metrics(df)
    # if table has less than 2 rows return default
    default = {col: None for col in pivoted.columns}
    if pivoted.shape[0] < 2:
        return default.copy()
    # apply lag for interday analysis
    # return default if not sufficient data
    lagged_corr = {}
    # handle constants without error
    lagged_corr[0] = {
        col: pivoted[col].corr(pivoted[metric]) if pivoted[metric].nunique() > 1 and pivoted[col].nunique() > 1 else 0.0
        for col in pivoted.columns
    }
    for lag in range(1,4):
        # shape 0 for rows
        if pivoted.shape[0] >= lag + 2 and pivoted[metric].nunique() > 1:
            shifted_pivot = pivoted.iloc[lag:].reset_index(drop=True)
            lagged_metric = pivoted[metric].iloc[:-lag].reset_index(drop=True)
            # handle contants without error
            lagged_corr[lag] = {
                col: shifted_pivot[col].corr(lagged_metric)
                if shifted_pivot[col].nunique() > 1 and lagged_metric.nunique() > 1
                else 0.0
                for col in shifted_pivot.columns
            }
        else:
            lagged_corr[lag] = default.copy()
    return lagged_corr