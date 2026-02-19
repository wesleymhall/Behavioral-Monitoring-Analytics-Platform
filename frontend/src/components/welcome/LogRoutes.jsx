import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { metricConfig } from '../../Metrics.js';
import apiClient from '../../apiClient.js';
import Log from './Log.jsx';

/**
 * LogRoutes dynamically generates routes for logging each metric
 */
function LogRoutes() {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [hasLogsToday, setHasLogsToday] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedMetrics.length > 0) return;
        const fetchMetrics = async () => {
            try {
                const response = await apiClient.get('/dash/getlogs');
                const logs = response.data.logs || [];
                const metrics = logs.map(m => m.metric);
                const today = format(new Date(), 'yyyy-MM-dd');

                setSelectedMetrics(metrics);
                if (metrics.length === 0) {
                    navigate('/selectmetrics');
                };

                const hasLogs = logs.some(metric =>
                    metric.logs.some(log => new Date(log.timestamp).toISOString().split('T')[0] === today)
                );

                setHasLogsToday(hasLogs);
            } catch (error) {
                console.error('error fetching metrics:', error);
                navigate('/selectmetrics');
            }
        };

        fetchMetrics();
    }, [navigate, selectedMetrics]);

    // redirect if user has already logged today
    useEffect(() => {
        if (hasLogsToday) navigate('/dash');
    }, [hasLogsToday, navigate]);

    return (
        <Routes>
            {selectedMetrics.map((name, index) => {
                const config = metricConfig[name];
                if (!config) return null;

                const nextPath = index + 1 < selectedMetrics.length
                    ? `/log/${selectedMetrics[index + 1]}`
                    : '/dash';

                return (
                    <Route
                        key={name}
                        path={name}
                        element={
                            <Log
                                metric={name}
                                array={config.array}
                                prompt={config.prompt}
                                emoji={config.emoji}
                                destination={nextPath}
                            />
                        }
                    />
                );
            })}
        </Routes>
    );
}

export default LogRoutes;
