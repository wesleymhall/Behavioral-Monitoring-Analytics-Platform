import apiClient from '../../apiClient.js';
import DayLogs from './DayLogs.jsx';
import Calendar from './Calendar.jsx';
import Logout from '../auth/Logout.jsx';
import Stats from './Stats.jsx';
import Patterns from './Patterns.jsx';
import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';


function Dash () {
    const [logs, setLogs] = useState({});
    const [analytics, setAnalytics] = useState(null);
    const [username, setUserName] = useState(null);
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [dayLogs, setDayLogs] = useState([]);

    // get data on component render
    useEffect(() => {
        getLogs();
    }, []);  

    const getLogs = async () => {
        try {
            const response = await apiClient.get('/dash/getlogs');
            const metricsLogs = response.data.metrics_logs;
            // get analytics
            setAnalytics(response.data.analytics);
            // get username
            setUserName(response.data.username);
            // map logs to dates
            const logsByDate = {};
            metricsLogs.forEach((metric) => {
                metric.logs.forEach((log) => {
                    // convert timestamp to date object without time
                    const date = new Date(log.timestamp).toISOString().split('T')[0];
                    // create empty dataset if date has no entries
                    if (!logsByDate[date]) {
                        logsByDate[date] = [];
                    }
                    // store log values
                    logsByDate[date].push({
                        value: log.value,
                        metric: metric.metric
                    });
                });
            });
            setLogs(logsByDate);
        } catch (error) {
            console.error('error getting logs:', error);
        }
    };

    useEffect(() => {
        // generate default logs for empty day
        if (!logs[selectedDay]) {
            const defaultDay = Object.keys(metricConfig).map(metricName => ({
                metric: metricName,
                value: 1,
            }));
            setDayLogs(defaultDay);
        }
        // else assign logs to day
        else {
            setDayLogs(logs[selectedDay]);
        }
    }, [selectedDay, logs]);

    const handleChange = async (updatedDayLog, day) => {
        // shallow clone logs
        const logsCopy = { ...logs};
        try {
            if (updatedDayLog) {
                // update local copy
                logsCopy[day] = updatedDayLog;
                // log metrics
                for (const metric of updatedDayLog) {
                    await apiClient.post('/log/logmetric', {value: metric.value, name: metric.metric, date: day});
                };
            } else {
                // update local copy
                delete logsCopy[day];
                // delete logs
                await apiClient.delete('/log/deletelog', {data: {date: day}});
            }
        } catch (error) {
            console.error('error saving changes:', error);
        }
        // pessimistic update
        setLogs(logsCopy);
        // refresh logss
        getLogs();
    };

    return (
        <div className='vertical-flex'>
            <div className='component-container' type='profile'>
                    <div className='vertical-flex'>
                        <div className='horizontal-space-between'>
                            {/* logout component */}
                            <div>welcome {username}</div>
                            <Logout/>
                        </div>
                    </div>
            </div>
            {/* main dash components */}
            <div className='horizontal-flex'>
                <div className='component-container' type='dash'>
                    <div className='vertical-flex'>
                        {/* child components */}
                        {/* row A */}
                        <div className='horizontal-flex stretch-row'>
                            <div className='component-container stretch-container'>
                                <Calendar 
                                    calendarLogs={logs} 
                                    triggerDaySelect={(day) => {
                                        setSelectedDay(day);
                                    }}
                                    selectedDay={selectedDay}
                                />
                            </div>
                            <div className='component-container stretch-container'>
                                <DayLogs 
                                    selectedDay={selectedDay}
                                    onChange={handleChange}
                                    dayLogs={dayLogs}
                                />
                            </div>
                        </div>
                        {/* row B */}
                        <div className='horizontal-flex stretch-row'>
                            <div className='component-container stretch-container'>
                                <Stats
                                    analytics={analytics}
                                />
                            </div>
                            <div className='component-container stretch-container'>
                                <Patterns/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dash;