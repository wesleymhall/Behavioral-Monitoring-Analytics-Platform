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


function Calendar({ calendarLogs, triggerDaySelect, selectedDay }) {
    const [logs, setLogs] = useState(calendarLogs);
    const [showMetric, setShowMetric] = useState(Object.entries(metricConfig)[0][1]);
    // set default month to current date
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // set month bounds
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // navigate between months
    const goToNextMonth = () => {
        // pass prev month, add 1
        setCurrentMonth((prev) => addMonths(prev, 1));
    };
    const goToPreviousMonth = () => {
        // pass prev month, subtract 1
        setCurrentMonth((prev) => subMonths(prev, 1));
    };

    // array of date objects within bounds
    const days = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
    }).map(day => format(day, 'yyyy-MM-dd'));

    // updated logs upon prop change
    useEffect(() => {
        setLogs(calendarLogs);
    }, [calendarLogs]);

    return (
        <div className='vertical-flex'>
            <div className='horizontal-space-between'>
                <p>calendar</p>
                <select
                    onChange={e => setShowMetric(metricConfig[e.target.value])}
                >
                    {Object.values(metricConfig).map((metric) => (
                        <option key={metric.name} value={metric.name}>
                            {metric.emoji}
                        </option>
                    ))}
                </select>
            </div>
            {/* month navigation */}
            <div className='horizontal-space-between'>
                <button onClick={goToPreviousMonth}>&lt;</button>
                <p>{format(currentMonth, 'MMMM yyyy').toLowerCase()}</p>
                <button onClick={goToNextMonth}>&gt;</button>
            </div>
            {/* days grid */}
            <div className='calendar-grid'>
                {/* render each day */}
                {days.map((day) => {
                    const isSelected = day === selectedDay;
                    const dayLogs = logs[day];
                    const metricObj = dayLogs?.find(metricObj => metricObj?.metric === showMetric.name);
                    const metricValue = metricObj?.value;
                    const emoteObj = showMetric.array.find(index => index.id === metricValue)
                    const emote = emoteObj?.emote
                    return (
                        <div 
                            key={day} 
                            className={`calendar-day ${isSelected ? 'selected' : ''}`}
                            onClick={() => triggerDaySelect(day)}
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
