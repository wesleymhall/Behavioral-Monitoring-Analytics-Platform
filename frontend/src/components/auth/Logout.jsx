import apiClient from '../../apiClient.js';
import { useNavigate } from 'react-router-dom';


function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await apiClient.post('/auth/logout');
        navigate('/');
    };

    return (
        <button type='plaintext' onClick={handleLogout}>logout</button>
    );
};

export default Logout;