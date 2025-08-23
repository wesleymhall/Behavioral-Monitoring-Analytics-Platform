import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';


function Stats({ analytics }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currStats, setCurrStats] = useState({});
    const [mode, setMode] = useState('value');
    const [span, setSpan] = useState('week');

    const currentMetric = Object.keys(metricConfig)[currentIndex];

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < Object.keys(metricConfig).length - 1;

    const goToPrevMetric = () => {
        if (hasPrev) {
            setCurrentIndex((prev) => prev - 1);
        };
    };
    const goToNextMetric = () => {
        if (hasNext){
            setCurrentIndex((prev) => prev + 1);
        };
    };

    useEffect(() => {
        const getCurrStats = () => {
            const stats = analytics?.['stats'][`${metricConfig[currentMetric].name}`][span];
            setCurrStats(stats);
        }
        getCurrStats();
    }, [currentIndex, analytics, span]);

    return (
        <div className='vertical-flex'>
            <div className='horizontal-space-between'>
                <p>stats</p>
                <div>
                    <select
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                    >
                        <option value='value'>this</option>
                        <option value='prev'>last</option>
                        <option value='change'>change</option>
                    </select>
                    <select
                    value={span}
                    onChange={e => setSpan(e.target.value)}
                    >
                        <option value='week'>week</option>
                        <option value='month'>month</option>
                        <option value='year'>year</option>
                    </select>
                </div>
            </div>
            {/* navigation */}
            <div className='horizontal-space-between'>
                <button onClick={goToPrevMetric} disabled={!hasPrev}>&lt;</button>
                <p>{metricConfig[currentMetric].emoji}: {metricConfig[currentMetric].name}</p>
                <button onClick={goToNextMetric} disabled={!hasNext}>&gt;</button>
            </div>
            {/* stats */}
            <div className='vertical-flex'>
                {currStats && Object.entries(currStats).map(([stat, values]) =>
                    <div className='horizontal-left' key={stat}>
                        <div className='table-label'>{stat}</div>
                        <div className='table-value'>
                            {
                                mode === 'change'
                                    ? (typeof values[mode] === 'number'
                                        ? Math.round(values[mode] * 100) + '%' 
                                        : '-')
                                    : (typeof values[mode] === 'number'
                                        ? Math.round(values[mode] * 10) / 10
                                        : '-')
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Stats;