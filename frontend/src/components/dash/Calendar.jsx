import { metricConfig } from '../../Metrics.js';
import { 
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
} from 'date-fns';
import { useState, useEffect } from 'react';

/**
 * Calendar component renders a monthly view of metrics logs
 */
function Calendar({ calendarLogs, triggerDaySelect, selectedDay, metrics }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [activeMetricName, setActiveMetricName] = useState(metrics?.[0] || null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
        .map(day => format(day, 'yyyy-MM-dd'));

    // Update activeMetricName if metrics change
    useEffect(() => {
        if (!activeMetricName && metrics?.length > 0) {
            setActiveMetricName(metrics[0]);
        }
    }, [metrics, activeMetricName]);

    const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

    return (
        <div className='vertical-flex'>
            {/* Metric selector */}
            <div className='horizontal-space-between'>
                <p>calendar</p>
                <select
                    value={activeMetricName || ''}
                    onChange={e => setActiveMetricName(e.target.value)}
                >
                    {metrics?.map(name => {
                        const config = metricConfig[name];
                        return (
                            <option key={name} value={name}>
                                {config.emoji}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Month navigation */}
            <div className='horizontal-space-between'>
                <button onClick={goToPreviousMonth}>&lt;</button>
                <p>{format(currentMonth, 'MMMM yyyy').toLowerCase()}</p>
                <button onClick={goToNextMonth}>&gt;</button>
            </div>

            {/* Days grid */}
            <div className='calendar-grid'>
                {days.map(day => {
                    const isSelected = day === selectedDay;
                    const dayLogs = calendarLogs[day] || [];
                    const activeMetric = metricConfig[activeMetricName];
                    
                    // Only show emote if a log exists for this day for the active metric
                    const metricObj = dayLogs.find(log => log.metric === activeMetricName);
                    const emote = metricObj
                        ? activeMetric.array.find(item => item.idx === metricObj.value)?.emote
                        : null;

                    const isFuture = new Date(day) > new Date();

                    return (
                        <div
                            key={day}
                            className={`calendar-day ${isSelected ? 'selected' : ''} ${isFuture ? 'future' : ''}`}
                            onClick={() => { if (!isFuture) triggerDaySelect(day); }}
                        >
                            {emote}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
