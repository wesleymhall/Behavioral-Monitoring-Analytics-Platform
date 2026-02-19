import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';

/**
 * Patterns component displays clusters of metric patterns from analytics
 */
function Patterns({ analytics, logsLength }) {
    const [clusters, setClusters] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    // update clusters when analytics changes
    useEffect(() => {
        setClusters(analytics?.patterns?.clusters || []);
    }, [analytics]);

    const message = analytics?.patterns?.message;

    if (logsLength < 10) {
        return (
            <div className='horizontal-full'>
                <div>🔒</div>
                <div>{logsLength}/10</div>
                <div>🔒</div>
            </div>
        );
    }

    return (
        <div className='vertical-flex'>
            <button onClick={() => setIsExpanded(!isExpanded)} type='plaintext' className='horizontal-full'>
                <div>patterns</div>
                <div>{isExpanded ? '▲' : '▼'}</div>
            </button>

            {isExpanded && (
                message ? (
                    <div className='vertical-flex'>
                        {message} {`(╥﹏╥)`}
                    </div>
                ) : clusters.length > 0 && (
                    <div className='vertical-flex'>
                        {clusters.map((cluster, idx) => (
                            <div className='horizontal-flex' key={idx}>
                                <div className='table-label'>{idx + 1}</div>
                                {Object.values(metricConfig).map(metric => (
                                    <div className='table-label' key={metric.name}>
                                        {metric.emoji}: {cluster[metric.name] ?? '-'}
                                    </div>
                                ))}
                                <div className='table-label'>%: {cluster['%']}</div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

export default Patterns;
