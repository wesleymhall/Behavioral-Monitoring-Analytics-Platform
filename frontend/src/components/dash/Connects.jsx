import { metricConfig } from '../../Metrics.js';
import { useState, useEffect } from 'react';


function Connects({ analytics }) {
    const [lag, setLag] = useState('0');
    const [connects, setCurrConnects] = useState({});
    const [showConnects, setShowConnects] = useState(false);

    useEffect(() => {
        const getCurrConnects = () => {
            const connects = analytics?.['connects'];
            setCurrConnects(connects);
        }
        getCurrConnects();
    }, [ analytics ]);

    return (
        <div className='vertical-flex'>
            <button
                onClick={() => setShowConnects(!showConnects)}
                type='plaintext'
                className='horizontal-full'
            >
                <div>connects</div>
                <div>{showConnects ? '▲' : '▼'}</div>
            </button>
            {!showConnects ? (
                <div></div>
            ) : (
                <>
                    <div className='horizontal-right'>
                        <div>
                            <label>lag: </label>
                            <select
                                value={lag}
                                onChange={e => setLag(e.target.value)}
                            >
                                <option value='0'>0</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                            </select>
                        </div>
                    </div>
                    {/* render if connects, children of connect, and children of connect children has rendered */}
                    {connects && 
                        Object.values(connects).length > 0 && 
                        Object.values(Object.values(connects)[0]).length > 0 ? 
                        (
                            <div className='connects-table'>
                                {/* header row with metric emojis */}
                                <div className='horizontal-flex'>
                                    <div className='table-label'></div>
                                    {Object.values(metricConfig).map(val => 
                                        <div className='table-value' key={val.name}>{val.emoji}</div>
                                    )}
                                </div>
                                {/* correlation rows */}
                                {Object.values(metricConfig).map(val => 
                                    <div className='horizontal-left' key={val.name}>
                                        <div className='table-label'>{val.emoji}: {val.name}</div>
                                        {connects && Object.values(metricConfig).map(corrVal => {
                                            const corr = connects?.[val.name]?.[Number(lag)]?.[corrVal.name];
                                            return (
                                                <div className='table-value' key={corrVal.name}>
                                                    {corr != null ? (Math.round(corr * 10) / 10) : '-'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : null
                    }
                </>
            )}
        </div>
    );
}

export default Connects;