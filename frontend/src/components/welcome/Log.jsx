import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient.js';
import { format } from 'date-fns';


function Log({metric, array, prompt, emoji, destination}) {
    const [selectedMetricIndex, setSelectedMetricIndex] = useState(Math.floor(array.length / 2) - 1);
    const [submitted, setSubmitted] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(<p>{emoji}: {prompt}</p>)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasLogsToday, setHasLogsToday] = useState(false);
    const navigate = useNavigate();

    console.log(metric, array, prompt, emoji, destination);
    // check for logs today on component mount
    useEffect(() => {
        checkLogsToday();
    }, []);

    // check if logs exist for the current day
    const checkLogsToday = async () => {
        try {
            const today = format(new Date(), 'yyyy-MM-dd'); 
            const response = await apiClient.get('/dash/getlogs'); 
            const metricLogs = response.data.metrics_logs;

            // check if any logs exist for today
            const hasLogs = metricLogs.some((metric) =>
                metric.logs.some((log) => {
                    // convert log timestamp to date string without time
                    const logDate = new Date(log.timestamp).toISOString().split('T')[0];
                    return logDate === today;
                })
            );
            setHasLogsToday(hasLogs);
        } catch (error) {
            console.error('error checking logs:', error);
    }};

    // if user has logged today, redirect to dash
    if (hasLogsToday) {
        navigate('/dash');
    }

    useEffect(() => {
        // reset states when props change
        setIsSubmitting(false);
        setSubmitted(false);
        setCurrentPrompt(<p>{emoji}: {prompt}</p>);
        setSelectedMetricIndex(Math.floor(array.length / 2) - 1);
    }, [metric, array, prompt]);

    // set selected mood to the index clicked
    const handleMetricSelect = (index) => {
        setSelectedMetricIndex(index);
    };

    const handleSubmit = async (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        const selectedMetric = array[selectedMetricIndex];
        const today = format(new Date(), 'yyyy-MM-dd');
        try {
            // send selected metric id to backend API
            await apiClient.post('/log/logmetric', { name: metric, value: selectedMetric.id, date: today });
            // set submission status to true
            setSubmitted(true);
            // set prompt to approval emote
            setCurrentPrompt(<p>ദ്ദി(˵•̀ᴗ-˵)✧</p>)
            // redirect to destination after a short delay
            setTimeout(() => {
                // navigate to next destination
                navigate(destination);
            }, 1000);
        } catch (error) {
            console.error('error logging metric:', error);
            // set submission status to true
            setSubmitted(true);
        }
    };

    return (
        <div className='centered'>
        <div className='component-container' type='cards'>
        <div className='horizontal-flex'>
        <div className='vertical-flex'>
            <div>{currentPrompt}</div>
            <div className='horizontal-flex'>
                <div className='flex-container'>
                {array.map((metric, index) => {
                    const position = index - selectedMetricIndex;
                    const isSelected = position === 0;

                    if (Math.abs(position) > 2) {
                        return null;
                    }

                    return (
                        <div
                            key={metric.id}
                            className={`card`}
                            style={{
                                transform: submitted
                                    ? isSelected
                                        ? `scale(1.3)`
                                        : `translateY(100px) translateX(${position * 200}px)`
                                    : `translateX(${position * 200}px) scale(${isSelected ? 1.3 : 1})`,
                                zIndex: isSelected ? 10 : 10 - Math.abs(position),
                                opacity: submitted
                                    ? isSelected
                                        ? 1 
                                        : 0
                                    : Math.abs(position) > 2
                                    ? 0
                                    : 1,
                            }}
                            onClick={() => handleMetricSelect(index)}
                        >
                            {/* metric centered, id centered bottom */}
                            <p className='centered'>{metric.emote}</p>
                            <p className='centered-bottom' style={{ fontSize: '12px', opacity: isSelected ? 1 : 0}}>{metric.id}/{array.length}</p>
                        </div>
                    );
                })}
                </div>
            </div>
            {/* disable button if submitting, prevents mutliple submission */}
            <button onClick={handleSubmit} disabled={isSubmitting} type='cards'>submit</button>
        </div>
        </div>
        </div>
        </div>
    );
}

export default Log;