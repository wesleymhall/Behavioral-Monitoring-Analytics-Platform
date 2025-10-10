import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient.js';
import { metricConfig } from '../../Metrics.js';
import Logout from '../auth/Logout.jsx';

function ChooseMetrics() {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const navigate = useNavigate();

  // toggle metric selection
  const toggleMetric = (name) => {
    setSelectedMetrics(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  // submit selected metrics to backend
  const handleSubmit = async () => {
    if (selectedMetrics.length === 0) return alert('Select at least one metric.');
    try {
      for (const metric of selectedMetrics) {
        await apiClient.post('/log/createmetric', { name: metric });
      }
      // navigate to /log/ using the first selected metric
      navigate(`/log/${selectedMetrics[0]}`);
    } catch (error) {
      console.error('Error creating metrics:', error);
    }
  };


  return (
    <div className="choose-metrics-container">
      <Logout />
      <h2>Choose Metrics to Track</h2>
      <p>Select the metrics you want to log:</p>

      <div className="metrics-grid">
        {Object.entries(metricConfig).map(([name, config]) => (
          <button
            key={name}
            onClick={() => toggleMetric(name)}
            style={{
              backgroundColor: selectedMetrics.includes(name) ? 'lightgreen' : 'white',
              border: '1px solid black',
              padding: '10px',
              margin: '5px',
              cursor: 'pointer'
            }}
          >
            {config.emoji} {name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        Start Logging
      </button>
    </div>
  );
}

export default ChooseMetrics;
