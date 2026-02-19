import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';

/**
 * DayLogs component allows viewing and editing of metrics for a selected day
 */
function DayLogs({ selectedDay, onChange, dayLogs }) {
    const [logs, setLogs] = useState(dayLogs);
    const [isExpanded, setIsExpanded] = useState(false);

    // update local logs when props change
    useEffect(() => setLogs(dayLogs), [dayLogs]);

    return (
        <div className='vertical-flex'>
            {/* toggle day logs visibility */}
            <button onClick={() => setIsExpanded(!isExpanded)} className='horizontal-full' type='plaintext'>
                <div>{isExpanded ? '▲' : '▼'}</div>
                <div>{selectedDay}</div>
                <div>{isExpanded ? '▲' : '▼'}</div>
            </button>

            {isExpanded && (
                <>
                    <div className='vertical-flex'>
                        {logs?.map((log, index) => {
                            const config = metricConfig[log.metric];
                            const maxVal = config.array.length;

                            return (
                                <div key={index} className='vertical-flex horizontal-full'>
                                    <p>{config.emoji}</p>
                                    <input
                                        className='slider'
                                        type='range'
                                        min='1'
                                        max={maxVal}
                                        step='1'
                                        value={log.value}
                                        onChange={e => {
                                            const updatedLogs = [...logs];
                                            updatedLogs[index] = { ...updatedLogs[index], value: Number(e.target.value) };
                                            setLogs(updatedLogs);
                                        }}
                                    />
                                    <p>{log.value}/{maxVal}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* action buttons */}
                    <div className='horizontal-full'>
                        <button type='left' onClick={() => onChange(null, selectedDay)}>delete</button>
                        <button type='right' onClick={() => onChange(logs, selectedDay)}>save</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default DayLogs;
