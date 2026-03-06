import { metricConfig } from '../../../Metrics.js';
import { useState, useEffect } from 'react';
import InfoDisplay from './info/InfoDisplay.jsx';
import { infoContent } from './info/infoContent.js';

/**
 * Stats component displays analytics statistics for metrics
 */
function Stats({ analytics, metrics }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currStats, setCurrStats] = useState({});
    const [mode, setMode] = useState('value');
    const [span, setSpan] = useState('week');

    const currentMetric = metrics?.[currentIndex] ?? null;
    const metricInfo = metricConfig[currentMetric];

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < metrics.length - 1;

    const goPrev = () => hasPrev && setCurrentIndex(prev => prev - 1);
    const goNext = () => hasNext && setCurrentIndex(prev => prev + 1);

    // update stats when metric, analytics, or span changes
    useEffect(() => {
        if (!metricInfo) return;
        const stats = analytics?.stats?.[metricInfo.name]?.[span] ?? {};
        setCurrStats(stats);
    }, [currentIndex, analytics, span, metricInfo]);

    return (
        <div className='vertical-flex'>
            <button onClick={() => setIsExpanded(!isExpanded)} type='plaintext' className='horizontal-full'>
                <div>stats</div>
                <div>{isExpanded ? '▲' : '▼'}</div>
            </button>

            {isExpanded && (
                <>
                    {/* mode / span selector and info element */}
                    <div className='horizontal-space-between'>
                        <InfoDisplay content={infoContent.stats}/>
                        <div className='horizontal-right'>
                            <div>
                                <select value={mode} onChange={e => setMode(e.target.value)}>
                                    <option value='value'>this</option>
                                    <option value='prev'>last</option>
                                    <option value='change'>change</option>
                                </select>
                                <select value={span} onChange={e => setSpan(e.target.value)}>
                                    <option value='week'>week</option>
                                    <option value='month'>month</option>
                                    <option value='year'>year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* navigation */}
                    <div className='horizontal-space-between'>
                        <button onClick={goPrev} disabled={!hasPrev}>&lt;</button>
                        <p>{metricInfo ? `${metricInfo.emoji}: ${metricInfo.name}` : 'no metric'}</p>
                        <button onClick={goNext} disabled={!hasNext}>&gt;</button>
                    </div>

                    {/* stats display */}
                    <div className='table'>
                        {currStats && Object.entries(currStats).map(([stat, values]) => (
                            <div className='horizontal-left' key={stat}>
                                <div className='table-label'>{stat}</div>
                                <div className='table-value'>
                                    {mode === 'change'
                                        ? typeof values[mode] === 'number' ? Math.round(values[mode] * 100) + '%' : '-'
                                        : typeof values[mode] === 'number' ? Math.round(values[mode] * 10) / 10 : '-'}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Stats;
