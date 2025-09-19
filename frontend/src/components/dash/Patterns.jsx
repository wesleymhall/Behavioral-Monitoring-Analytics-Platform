import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';


function Patterns({ analytics, logsLength }) {
    const [clusters, setCurrClusters] = useState([]);
    const [showPatterns, setShowPatterns] = useState(false);

    useEffect(() => {
        const getCurrPatterns = () => {
            const clusters = analytics?.['patterns']['clusters'] || [];
            setCurrClusters(clusters);
        }
        getCurrPatterns();
    }, [analytics]);

    return (    
        <div className='vertical-flex'>
            {logsLength < 10 ? (
                <div className='horizontal-full'>
                    <div>🔒</div>
                    <div>{logsLength}/10</div>
                    <div>🔒</div>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => setShowPatterns(!showPatterns)}
                        type='plaintext'
                        className='horizontal-full'
                    >
                        <div>patterns</div>
                        <div>{showPatterns ? '▲' : '▼'}</div>
                    </button>
                    {!showPatterns ? (
                        <div></div>
                    ) : (
                        <>
                            {clusters.length > 0 && (
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
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Patterns;
