import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.utils import to_categorical
from .utils import get_metric_dataframe, get_pivoted_metrics

# FIX FOR DATA WITH NOT ENOUGH UNIQUE VALUES
def get_clusters(user_id):
    df = get_metric_dataframe(user_id)
    pivoted = get_pivoted_metrics(df)
    # if table is empty or has less than 2 rows return empty dict
    if pivoted.empty or pivoted.shape[0] < 2:
        return {}
    # elbow method
    inertias = []
    krange = range(2, pivoted.shape[0])
    for k in krange:
        kmeans = KMeans(n_clusters=k, random_state=0)
        kmeans.fit(pivoted)
        inertias.append(kmeans.inertia_)
    if len(inertias) > 1:
        drops = np.diff(inertias)
        n_clusters = list(krange)[np.argmin(drops) + 1]
    else:
        n_clusters = 2
    # get clusters
    kmeans = KMeans(n_clusters=n_clusters, random_state=0)
    kmeans.fit(pivoted)
    # get top 3 labels
    labels = kmeans.labels_
    counts = np.bincount(labels)
    # get centers
    centers = np.round(kmeans.cluster_centers_)
    # convert to df then dict
    # use columns from pivoted to get metrics
    centers_df = pd.DataFrame(centers, columns=pivoted.columns)
    centers_df['%'] = np.round(counts / len(pivoted) * 100)
    # get prediction
    prediction = predict_next_cluster(labels, centers_df, n_clusters)
    # orient records so each row is dict, not column
    return {
        "clusters": centers_df.to_dict(orient='records'),
        "prediction": prediction
    }


def predict_next_cluster(labels, centers_df, n_clusters, epochs=20, seqlen=30):
    # return empty dict for data <= seqlen
    if len(labels) <= seqlen:
        return {}
    # prepare seqs, X is seq, y is target
    X, y = [], []
    for i in range(len(labels)- seqlen):
        X.append(labels[i:i+seqlen])
        y.append(labels[i+seqlen])
    # convert to numpy arr
    X = np.array(X)
    y = np.array(y)
    # convert to one hot vector
    X_encoded = to_categorical(X, num_classes = n_clusters)
    y_encoded = to_categorical(y, num_classes = n_clusters)
    # build model
    model = Sequential()
    model.add(LSTM(32, input_shape=(seqlen, n_clusters)))
    model.add(Dense(n_clusters, activation='softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='adam')
    # train
    model.fit(X_encoded, y_encoded, epochs=epochs, batch_size=16, verbose=0)
    # predict
    last_seq = labels[-seqlen:]
    last_seq_encoded = to_categorical(last_seq, num_classes=n_clusters)
    last_seq_encoded = last_seq_encoded.reshape((1, seqlen, n_clusters))
    pred_probs = model.predict(last_seq_encoded, verbose=0)[0]
    pred_cluster = int(np.argmax(pred_probs))
    confidence = round(float(np.round(pred_probs[pred_cluster] * 100, 1)))
    pred_values = centers_df.iloc[pred_cluster].to_dict()
    return {
        'pred_cluster': pred_values, 
        'confidence': confidence,
    }