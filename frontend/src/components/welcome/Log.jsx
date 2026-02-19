import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import apiClient from '../../apiClient.js';

/**
 * Log component for logging a single metric
 */
function Log({ metric, array, prompt, emoji, destination }) {
    const [submitted, setSubmitted] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(<p>{emoji}: {prompt}</p>);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(Math.floor((array.length - 1) / 2)); // default mid value
    const navigate = useNavigate();

    // reset states when props change
    useEffect(() => {
        setIsSubmitting(false);
        setSubmitted(false);
        setCurrentPrompt(<p>{emoji}: {prompt}</p>);
        setSelectedIndex(Math.floor((array.length - 1) / 2));
    }, [metric, array, prompt]);

    const handleIndexSelect = (index) => setSelectedIndex(index);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const selectedMetric = array[selectedIndex];
        const today = format(new Date(), 'yyyy-MM-dd');

        try {
            await apiClient.post('/log/logmetric', { name: metric, value: selectedMetric.idx, date: today });
            setSubmitted(true);
            setCurrentPrompt(<p>ദ്ദി(˵•̀ᴗ-˵)✧</p>); // approval emote

            setTimeout(() => navigate(destination), 1000); // redirect
        } catch (error) {
            console.error('Error logging metric:', error);
            setSubmitted(true);
        }
    };

    return (
        <div className='centered'>
            <div className='component-container' type='panels'>
                <div className='horizontal-flex'>
                    <div className='vertical-flex'>
                        <div>{currentPrompt}</div>
                        <div className='horizontal-flex'>
                            <div className='flex-container'>
                                {array.map((metricItem, index) => {
                                    const position = index - selectedIndex;
                                    const isSelected = position === 0;

                                    if (Math.abs(position) > 2) return null;

                                    return (
                                        <div
                                            key={metricItem.idx}
                                            className='carousel-panel'
                                            style={{
                                                transform: submitted
                                                    ? isSelected
                                                        ? 'scale(1.3)'
                                                        : `translateY(100px) translateX(${position * 200}px)`
                                                    : `translateX(${position * 200}px) scale(${isSelected ? 1.3 : 1})`,
                                                zIndex: isSelected ? 10 : 10 - Math.abs(position),
                                                opacity: submitted
                                                    ? isSelected ? 1 : 0
                                                    : 1,
                                            }}
                                            onClick={() => handleIndexSelect(index)}
                                        >
                                            <p className='centered'>{metricItem.emote}</p>
                                            <p
                                                className='centered-bottom'
                                                style={{ fontSize: '12px', opacity: isSelected ? 1 : 0 }}
                                            >
                                                {metricItem.idx}/{array.length}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} type='wide'>submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Log;
