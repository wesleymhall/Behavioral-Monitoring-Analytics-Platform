import { useState, useEffect } from 'react';

function Patterns({ analytics }) {
    const [patterns, setCurrPatterns] = useState({});
    
    useEffect(() => {
        const getCurrPatterns = () => {
            const patterns = analytics?.['patterns'];
            setCurrPatterns(patterns);
        }
        getCurrPatterns();
    }, [ analytics ]);

    return (
        <div className='vertical-flex'>
            <p className='horizontal-left'>patterns</p>
            <div>{JSON.stringify(patterns)}</div>
        </div>
    )
}

export default Patterns;