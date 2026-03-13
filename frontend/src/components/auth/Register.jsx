import { useState } from 'react';
import apiClient from '../../apiClient.js';

function Register({ toggleRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/auth/register', { username, password });
            toggleRegister();
        } catch (error) {
            console.error('register error:', error);
            alert(error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='vertical-flex'>
            <div className='horizontal-flex'>
                <input type='text' placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
                <input type='password' placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <p className='horizontal-full'>
                <button type='submit'>register</button>
            </p>
        </form>
    );
}

export default Register;
