import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';


function Stats({ analytics }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currDistributions, setCurrDistributions] = useState({});
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
        const getCurrDistribution = () => {
            const distributions = analytics?.['distributions'][`${metricConfig[currentMetric].name}`][span];
            setCurrDistributions(distributions);
        }
        getCurrDistribution();
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
            {/* metric navigation */}
            <div className='horizontal-space-between'>
                <button onClick={goToPrevMetric} disabled={!hasPrev}>&lt;</button>
                <p>{metricConfig[currentMetric].emoji}: {metricConfig[currentMetric].name}</p>
                <button onClick={goToNextMetric} disabled={!hasNext}>&gt;</button>
            </div>
            {/* distribution */}
            <div className='vertical-flex'>
                {currDistributions && Object.entries(currDistributions).map(([stat, values]) =>
                    <div className='horizontal-left' key={stat}>
                        <div className='statlabel'>{stat}</div>
                        <div className='statvalue'>
                            {
                                mode === 'change'
                                    ? (typeof values[mode] === 'number'
                                        ? Math.round(values[mode] * 100) + '%' 
                                        : 'N/A')
                                    : (typeof values[mode] === 'number'
                                        ? Math.round(values[mode] * 10) / 10
                                        : 'N/A')
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Stats;






                {/* <div>
                    <p>correlations: </p>
                    <div className='horizontal-left'>
                        <ul>
                        {Object.entries(currCorrelations).map(([key, value]) =>
                            <li key={key}>
                                <div className='horizontal-space-between'>
                                    <div>{metricConfig[key].emoji}:</div>
                                    <div>{Math.round(value*100)/100}</div>
                                </div>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
                */}

                        {/* const getCurrCorrelations = () => {
            const correlations = analytics?.['correlations'][`${metricConfig[currentMetric].name}`][span];
            const tempObject = {};
            for (const key in correlations) {
                if (key != metricConfig[currentMetric].name) {
                    tempObject[key] = correlations[key]
                };
            };
            setCurrCorrelations(tempObject)
        };
        getCurrCorrelations();
        */}