import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import apiClient from '../../apiClient.js';


function Log({metric, array, prompt, emoji, destination }) {
    const [submitted, setSubmitted] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(<p>{emoji}: {prompt}</p>)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(5); // default index = 5/10
    const navigate = useNavigate();
    
    useEffect(() => {
        // reset states when props change
        setIsSubmitting(false);
        setSubmitted(false);
        setCurrentPrompt(<p>{emoji}: {prompt}</p>);
        setSelectedIndex(5);
    }, [metric, array, prompt]);

    // set selected metric to selected index
    const handleIndexSelect = (index) => {
        setSelectedIndex(index);
    };

    const handleSubmit = async (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        const selectedMetric = array[selectedIndex];
        const today = format(new Date(), 'yyyy-MM-dd');
        try {
            await apiClient.post('/log/logmetric', { name: metric, value: selectedMetric.idx, date: today });
            setSubmitted(true);
            // set prompt to approval emote
            setCurrentPrompt(<p>ദ്ദി(˵•̀ᴗ-˵)✧</p>)
            // redirect to destination after a short delay
            setTimeout(() => {
                navigate(destination);
            }, 1000);
        } catch (error) {
            console.error('error logging metric:', error);
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
                    const position = index - selectedIndex;
                    const isSelected = position === 0;
                    
                    // do not display farther than 2 indices from selected
                    if (Math.abs(position) > 2) {
                        return null;
                    }

                    return (
                        <div
                            key={metric.idx}
                            className={`card`}
                            // handle carousel animations
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
                            onClick={() => handleIndexSelect(index)}
                        >
                            {/* emote centered, index centered bottom */}
                            <p className='centered'>{metric.emote}</p>
                            <p 
                                className='centered-bottom' 
                                style={{ fontSize: '12px', opacity: isSelected ? 1 : 0}}
                            >
                                {metric.idx}/{array.length}
                            </p>
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