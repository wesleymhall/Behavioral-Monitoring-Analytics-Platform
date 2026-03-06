import { useState, useEffect } from 'react';
import apiClient from '../../apiClient.js';
import { format } from 'date-fns';
import Calendar from './Calendar.jsx';
import DayLogs from './DayLogs.jsx';
import Patterns from './analytics/Patterns.jsx';
import Predict from './analytics/Predict.jsx';
import Connects from './analytics/Connects.jsx';
import Stats from './analytics/Stats.jsx';
import Logout from '../auth/Logout.jsx';

/**
 * Dash component
 * renders calendar, day logs, and analytics controls
 */
function Dash() {
    const [logs, setLogs] = useState({});
    const [analytics, setAnalytics] = useState(null);
    const [username, setUsername] = useState(null);
    const [streak, setStreak] = useState(null);
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dayLogs, setDayLogs] = useState([]);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [metrics, setMetrics] = useState([]);
    const logsLength = Object.keys(logs).length;

    // fetch dashboard data
    useEffect(() => { fetchLogs(); }, []);

    // fetch analytics when showAnalytics changes to true
    useEffect(() => {
        if (showAnalytics) {
            fetchAnalytics();
        }
    }, [showAnalytics]);

    const fetchLogs = async () => {
        try {
            const { data } = await apiClient.get('/dash/getlogs');
            const rawLogs = data.logs;

            setUsername(data.username);
            setStreak(data.streak);

            const metricNames = rawLogs.map(m => m.metric);
            setMetrics(metricNames);

            // organize logs by date
            const logsByDate = {};
            rawLogs.forEach(metric => {
                metric.logs.forEach(log => {
                    const date = new Date(log.timestamp).toISOString().split('T')[0];
                    logsByDate[date] = logsByDate[date] || [];
                    logsByDate[date].push({ metric: metric.metric, value: log.value });
                });
            });

            setLogs(logsByDate);
        } catch (error) {
            console.error('error getting logs:', error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const { data } = await apiClient.get('/dash/getanalytics');
            setAnalytics(data);
        } catch (error) {
            console.error('error getting analytics:', error);
        }
    };

    // update day logs when selectedDay or logs change
    useEffect(() => {
        if (!logs[selectedDay] && metrics.length > 0) {
            setDayLogs(metrics.map(name => ({ metric: name, value: 1 })));
        } else {
            setDayLogs(logs[selectedDay] || []);
        }
    }, [selectedDay, logs, metrics]);

    // handle changes to day logs
    const handleDayLogsChange = async (updatedLogs, day) => {
        const logsCopy = { ...logs };
        try {
            if (updatedLogs) {
                logsCopy[day] = updatedLogs;
                for (const metric of updatedLogs) {
                    await apiClient.post('/log/logmetric', { value: metric.value, name: metric.metric, date: day });
                }
            } else {
                delete logsCopy[day];
                await apiClient.delete('/log/deletelog', { data: { date: day } });
            }
        } catch (error) {
            console.error('error saving changes:', error);
        }
        setLogs(logsCopy);
        fetchLogs();
    };

    return (
        <div className='vertical-flex'>
            {/* navbar */}
            <div className='component-container' type='profile'>
                <div className='vertical-flex'>
                    <div className='horizontal-space-between'>
                        <div className='horizontal-left' style={{ gap: '40px' }}>
                            <div>welcome {username}</div>
                            <div>🔥: {streak}</div>
                        </div>
                        <div className='horizontal-right' style={{ gap: '40px' }}>
                            <button onClick={() => setShowAnalytics(false)} type='plaintext'>calendar</button>
                            <button onClick={() => setShowAnalytics(true)} type='plaintext'>analytics</button>
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>

            {/* main dashboard */}
            <div className='component-container' type='dash'>
                {!showAnalytics ? (
                    <div className='vertical-flex stretch-row'>
                        <div className='component-container stretch-container'>
                            <Calendar
                                calendarLogs={logs}
                                triggerDaySelect={setSelectedDay}
                                selectedDay={selectedDay}
                                metrics={metrics}
                            />
                        </div>
                        <div className='component-container stretch-container'>
                            <DayLogs
                                selectedDay={selectedDay}
                                onChange={handleDayLogsChange}
                                dayLogs={dayLogs}
                                metrics={metrics}
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* TODO: add loading spinner */}
                        {analytics ? (
                            <div className='vertical-flex stretch-row'>
                                <div className='component-container stretch-container'>
                                    <Stats analytics={analytics} metrics={metrics}/>
                                </div>
                                <div className='component-container stretch-container'>
                                    <Connects analytics={analytics}/>
                                </div>
                                <div className='component-container stretch-container'>
                                    <Patterns analytics={analytics} logsLength={logsLength}/>
                                </div>
                                <div className='component-container stretch-container'>
                                    <Predict analytics={analytics} logsLength={logsLength}/>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dash;
