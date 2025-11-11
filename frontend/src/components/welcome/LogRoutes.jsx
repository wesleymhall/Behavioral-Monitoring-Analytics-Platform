import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { metricConfig } from '../../Metrics.js';
import apiClient from '../../apiClient.js';
import Log from './Log.jsx';


function LogRoutes() {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [hasLogsToday, setHasLogsToday] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      // do not fetch metrics after selected metrics are defined
      // this prevents premature navigate to dash
      if (selectedMetrics.length > 0) return;
      try {
        const response = await apiClient.get('/dash/getlogs');
        const metricsLogs = response.data.metrics_logs || [];
        const metrics = metricsLogs.map(m => m.metric);
        const today = format(new Date(), 'yyyy-MM-dd'); 
        setSelectedMetrics(metrics);

        if (metrics.length === 0) {
          navigate('/selectmetrics');
        }

        const hasLogs = metricsLogs.some((metric) =>
            metric.logs.some((log) => {
              // convert log timestamp to date string without time
              const logDate = new Date(log.timestamp).toISOString().split('T')[0];
              return logDate === today;
            })
        );
        setHasLogsToday(hasLogs);
      } catch (error) {
        console.error('error fetching metrics:', error);
        navigate('/selectmetrics');
      }
    };

    fetchMetrics();
  }, [navigate]);

  useEffect(() => {
    // if user has logged today, redirect to dash
    if (hasLogsToday) {
        navigate('/dash');
    }
  }, [navigate, hasLogsToday])

  return (
    <Routes>
      {/* map all log routes */}
      {selectedMetrics.map((name, index) => {
        const config = metricConfig[name];
        if (!config) return null;

        // define destinations for log components
        // final destination is dash
        const nextPath =
          index + 1 < selectedMetrics.length
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
