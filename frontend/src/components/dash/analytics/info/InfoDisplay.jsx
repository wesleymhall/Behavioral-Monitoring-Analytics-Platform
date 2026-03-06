import { useState } from 'react';

function InfoDisplay({ content }) {
    const [display, setDisplay] = useState(false);

    return (
        <>
            <button onClick={() => setDisplay(true)} type='plaintext'>
                ?
            </button>
            {display && (
                <div className='modal-backdrop'>
                    <div className='modal-window'>
                        <div className='vertical-flex'>
                            <div className='horizontal-space-between'>
                                {content.name}
                                <button onClick={() => setDisplay(false)} type='plaintext'>
                                x
                                </button>
                            </div>
                            <div className='horizontal-left'>
                                {content.text}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default InfoDisplay;