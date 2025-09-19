import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';

function DayLogs({ selectedDay, onChange, dayLogs }) {
    const [logs, setLogs] = useState(dayLogs);
    const [showLogs, setShowLogs] = useState(false);
    useEffect(() => {
        setLogs(dayLogs);
    }, [dayLogs])
    return (
        <div className='vertical-flex'>
            <button 
                onClick={() => setShowLogs(!showLogs)} 
                className='horizontal-full'
                type='plaintext'
            >
                <div>{showLogs ? '▲' : '▼'}</div>
                <div>{selectedDay}</div>
                <div>{showLogs ? '▲' : '▼'}</div>
            </button>

            {showLogs && (
                <>
                    <div className='daylog-list'>
                    {logs?.map((log, index) => {
                        const config = metricConfig[log.metric];
                        const metricArray = config.array;
                        return (
                            <div key={index} className='vertical-flex horizontal-full'>
                                <p>{config.emoji}</p>
                                <input
                                    className='slider'
                                    type='range'
                                    min='1'
                                    max={metricArray.length}
                                    step='1'
                                    value={log.value}
                                    onChange={(e) => {
                                        const dayLogsCopy = [...logs];
                                        dayLogsCopy[index] = {...dayLogsCopy[index], value:  Number(e.target.value)};
                                        setLogs(dayLogsCopy);
                                    }}
                                    />
                                    <p>{log.value}/{metricArray.length}</p>
                                    </div>
                                );
                            })}
                    </div>
                    <div className='horizontal-full'>
                        <button
                            onClick={() => {
                                // pass daylogs as null to delete
                                onChange(null, selectedDay);
                            }}
                        >
                            delete
                        </button>
                        <button
                            onClick={() => {
                                // save changes
                                onChange(logs, selectedDay);
                            }}
                        >
                            save
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default DayLogs;