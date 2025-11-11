import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metricConfig } from '../../Metrics.js';
import apiClient from '../../apiClient.js';


function SelectMetrics() {
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      if (selectedMetrics.length >= 5) {
        handleSubmit();
      };
  }, [selectedMetrics]);

  const toggleMetric = (name) => {
    // prev is the arr prev state
    // if name exists in prev 
    // allow m !== name to pass filter to new arr
    // else append name to end
    setSelectedMetrics(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleSubmit = async () => {
    // submit all selected metrics
    try {
      for (const metric of selectedMetrics) {
        await apiClient.post('/log/createmetric', { name: metric });
      }
      navigate(`/log/${selectedMetrics[0]}`);
    } catch (error) {
      console.error('selection error:', error);
    }
  };

  return (
    <div className='centered'>
    <div className='component-container' type='cards'>
    <div className='horizontal-flex'>
    <div className='vertical-flex'>
      <div>select metrics: </div>
      <div className='horizontal-flex'>
      {/* map all metrics in config */}
      {Object.entries(metricConfig).map(([name, config]) => (
          <button
          key={name}
          onClick={() => toggleMetric(name)}
          >
            <div className='centered'>{name}</div>
            <div className='centered-bottom'>{config.emoji}</div>
          </button>
      ))}
      </div>
      <button onClick={() => toggleMetric(name)}>select</button>
    </div>
    </div>
    </div>
    </div>
  );
}

export default SelectMetrics;
