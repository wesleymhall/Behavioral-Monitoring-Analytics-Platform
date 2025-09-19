import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';


function Predict({ analytics, logsLength }) {
    const [confidence, setCurrConfidence] = useState({});
    const [prediction, setCurrPrediction] = useState({});
    const [showPredict, setShowPredict] = useState(false);

    console.log(analytics);
        
    useEffect(() => {
        const getCurrPatterns = () => {
            const predictionData = analytics?.patterns?.prediction?.pred_cluster ?? {};
            const confidenceData = analytics?.patterns?.prediction?.confidence ?? 0; // default to 0
            setCurrPrediction(predictionData);
            setCurrConfidence(confidenceData);
        }
        getCurrPatterns();
    }, [analytics]);

    return (
        <div className='vertical-flex'>
            {logsLength < 30 ? (
                <div className='horizontal-full'>
                    <div>🔒</div>
                    <div>{logsLength}/30</div>
                    <div>🔒</div>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => setShowPredict(!showPredict)}
                        type='plaintext'
                        className='horizontal-full'
                    >
                        <div>predict</div>
                        <div>{showPredict ? '▲' : '▼'}</div>
                    </button>
                    {!showPredict ? (
                        <div></div>
                    ) : (
                        <>
                            {Object.keys(prediction).length > 0 && (
                                <div className='vertical-flex'>
                                    <div className='horizontal-flex'>
                                        {Object.values(metricConfig).map(metric => {
                                            const val = prediction[metric.name];
                                            return (
                                                <div className='table-label' key={metric.name}>{metric.emoji}: {val != null ? val : '-'}</div>
                                            )
                                        })}
                                        <div className='table-label'>confidence: {confidence}%</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Predict;