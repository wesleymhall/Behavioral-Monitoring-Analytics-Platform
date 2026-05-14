import { metricConfig } from '../../../Metrics.js';
import { useState, useEffect } from 'react';

/**
 * Predict component shows prediction cluster and confidence for metrics
 */
function Predict({ analytics, logsLength, metrics }) {
    const [prediction, setPrediction] = useState({});
    const [confidence, setConfidence] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setPrediction(analytics?.patterns?.prediction?.pred_cluster ?? {});
        setConfidence(analytics?.patterns?.prediction?.confidence ?? 0);
    }, [analytics]);

    const message = analytics?.patterns?.message;

    if (logsLength < 30) {
        return (
            <div className='horizontal-full'>
                <div>🔒</div>
                <div>{logsLength}/30</div>
                <div>🔒</div>
            </div>
        );
    }

    return (
        <div className='vertical-flex'>
            <button onClick={() => setIsExpanded(!isExpanded)} type='plaintext' className='horizontal-full'>
                <div>predict</div>
                <div>{isExpanded ? '▲' : '▼'}</div>
            </button>

            {isExpanded && (
                message ? (
                    <div className='vertical-flex'>
                        {message} {`(╥﹏╥)`}
                    </div>
                ) : Object.keys(prediction).length > 0 && (
                    <div className='vertical-flex'>
                        <div className='horizontal-flex'>
                            {metrics.map(metricKey => (
                                <div className='table-label' key={metricKey}>
                                    {metricConfig[metricKey]?.emoji || metricKey}: {prediction[metricKey] ?? '-'}
                                </div>
                            ))}
                        </div>
                        <div className='table-value'>confidence: {confidence}%</div>
                    </div>
                )
            )}
        </div>
    );
}

export default Predict;
