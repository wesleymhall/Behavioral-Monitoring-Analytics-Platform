import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metricConfig } from '../../Metrics.js';
import apiClient from '../../apiClient.js';

/**
 * SelectMetrics allows user to select metrics upon register
 */
function SelectMetrics() {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [unselectedMetrics, setUnselectedMetrics] = useState(Object.keys(metricConfig));
    const navigate = useNavigate();

    useEffect(() => {
        setUnselectedMetrics(Object.keys(metricConfig).filter(name => !selectedMetrics.includes(name)));
    }, [selectedMetrics]);

    const toggleMetric = (name) => {
      setSelectedMetrics(prev => {
        if (prev.includes(name)) return prev.filter(m => m !== name);
        if (prev.length >= 5) return prev;
        return [...prev, name];
      });
    };

    const handleSubmit = async () => {
        try {
            if (selectedMetrics.length === 0) {
                console.error('no metrics selected');
                return;
            }
            for (const metric of selectedMetrics) {
                await apiClient.post('/log/createmetric', { name: metric });
            }
            const firstMetric = selectedMetrics[0];
            console.log('navigating to:', `/log/${firstMetric}`);
            navigate(`/log/${firstMetric}`);
        } catch (error) {
            console.error('selection error:', error);
        }
    };

    return (
        <div className='centered'>
            <div className='component-container' type='panels'>
                <div className='horizontal-flex'>
                    <div className='vertical-flex'>
                        <p>select metrics:</p>
                        <div className='flex-container' type='vertical'>
                            {/* unselected metrics */}
                            <div className='component-container' type='selectbox'>
                                <div className='horizontal-left'>
                                    {unselectedMetrics.map(name => (
                                        <button key={name} onClick={() => toggleMetric(name)} type='plaintext'>
                                            <div>{name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ fontSize: '40px' }}>↓</div>

                            {/* selected metrics */}
                            <div className='component-container' type='selectedbox'>
                                <div className='vertical-flex' type='centered'>
                                    <div className='horizontal-flex'>
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <div key={i} className='component-container' type='selectedmetric'>
                                                {selectedMetrics[i] && (
                                                    <button onClick={() => toggleMetric(selectedMetrics[i])} type='plaintext'>
                                                        <div style={{ fontSize: '25px' }}>
                                                            {metricConfig[selectedMetrics[i]].emoji}
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleSubmit} type='wide'>submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectMetrics;
