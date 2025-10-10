import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient.js';
import { metricConfig } from '../../Metrics.js';
import Log from './Log.jsx';

function LogRoutes() {
  const [chosenMetrics, setChosenMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get('/dash/getlogs');
        const metricsLogs = response.data.metrics_logs || [];
        const metrics = metricsLogs.map(m => m.metric);

        setChosenMetrics(metrics);

        if (metrics.length === 0) {
          navigate('/choosemetrics');
        } else {
          navigate(`/log/${metrics[0]}`);
        }
      } catch (err) {
        console.error(err);
        navigate('/choosemetrics');
      }
    };

    fetchMetrics();
  }, [navigate]);

  if (chosenMetrics === null) return <div>Loading...</div>;

  return (
    <Routes>
      {chosenMetrics.map((name, index) => {
        const config = metricConfig[name];
        console.log(config);
        if (!config) return null;

        const nextPath =
          index + 1 < chosenMetrics.length
            ? `/log/${chosenMetrics[index + 1]}`
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
