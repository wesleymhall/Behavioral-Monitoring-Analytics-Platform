import { metricConfig } from '../../../Metrics.js';
import { useState, useEffect } from 'react';
import InfoDisplay from './info/InfoDisplay.jsx';
import { infoContent } from './info/infoContent.js';

/**
 * Connects component displays metric correlations with selectable lag
 */
function Connects({ analytics }) {
    const [lag, setLag] = useState('0');
    const [connectsData, setConnectsData] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    // update connects data from analytics
    useEffect(() => {
        setConnectsData(analytics?.connects || {});
    }, [analytics]);

    return (
        <div className='vertical-flex'>
            {/* Toggle button */}
            <button onClick={() => setIsExpanded(!isExpanded)} type='plaintext' className='horizontal-full'>
                <div>connects</div>
                <div>{isExpanded ? '▲' : '▼'}</div>
            </button>

            {isExpanded && (
                <>
                    {/* lag selector and info element */}          
                    <div className='horizontal-space-between'>
                        <InfoDisplay content={infoContent.connects}/>
                        <div className='horizontal-right'>
                            <div>
                                <label>lag: </label>
                                <select value={lag} onChange={e => setLag(e.target.value)}>
                                    {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* correlation matrix table */}
                    {Object.keys(connectsData).length > 0 &&
                        Object.values(connectsData)[0] &&
                        Object.values(Object.values(connectsData)[0]).length > 0 && (
                            <div className='table'>
                                <div className='horizontal-flex'>
                                    <div className='table-label'></div>
                                    {Object.values(metricConfig).map(metric => (
                                        <div className='table-value' key={metric.name}>{metric.emoji}</div>
                                    ))}
                                </div>
                                {Object.values(metricConfig).map(metric => (
                                    <div className='horizontal-left' key={metric.name}>
                                        <div className='table-label'>{metric.emoji}: {metric.name}</div>
                                        {Object.values(metricConfig).map(corrMetric => {
                                            const corr = connectsData?.[metric.name]?.[Number(lag)]?.[corrMetric.name];
                                            return (
                                                <div className='table-value' key={corrMetric.name}>
                                                    {corr != null ? Math.round(corr * 10) / 10 : '-'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                </>
            )}
        </div>
    );
}

export default Connects;
