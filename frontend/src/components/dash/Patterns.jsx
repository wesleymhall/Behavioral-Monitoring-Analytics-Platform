import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';

function Patterns({ analytics }) {
    const [clusters, setCurrClusters] = useState([]);
    const [prediction, setCurrPrediction] = useState({});

    useEffect(() => {
        const getCurrPatterns = () => {
            const clusters = analytics?.['patterns']['clusters'] || [];
            console.log(clusters);
            const prediction = analytics?.['patterns']['prediction'] || {};
            setCurrClusters(clusters);
            setCurrPrediction(prediction);
        }
        getCurrPatterns();
    }, [analytics]);

    return (
        <div className='vertical-flex'>
            <p className='horizontal-left'>patterns</p>
            {clusters.length > 0 && prediction && (
                <div className='vertical-flex'>
                    {clusters.map((cluster, idx) => (
                        <div className='horizontal-flex' key={idx}>
                            <div className='table-value'>{idx + 1}</div>
                            {Object.values(metricConfig).map(metric => {
                                const val = cluster[metric.name];
                                return (
                                    <div className='table-label' key={metric.name}>{metric.emoji}: {val != null ? val : '-'}</div>
                                )
                            })}
                            <div className='table-label'>%: {cluster['%']}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Patterns;
