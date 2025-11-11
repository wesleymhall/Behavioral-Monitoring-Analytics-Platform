import { useState } from 'react';
import apiClient from '../../apiClient.js';


function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/login', {
                username,
                password,
            });
            onLogin();
        } catch (error) {
            console.error('login error:', error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className='vertical-flex'>
            <div className='horizontal-flex'>
                <input
                type='text'
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <p className='horizontal-full'>
                <button type='submit'>login</button>
            </p>
        </form>
    );
};

export default Login;