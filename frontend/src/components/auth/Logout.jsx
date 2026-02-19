import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient.js';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await apiClient.post('/auth/logout');
        navigate('/');
    };

    return <button type='plaintext' onClick={handleLogout}>logout</button>;
}

export default Logout;
