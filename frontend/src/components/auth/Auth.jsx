import apiClient from '../../apiClient.js';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const toggleRegister = () => setIsRegistering(!isRegistering);

  const handleLogin = async () => {
    try {
      const response = await apiClient.get('/auth/session');
      if (!response.data.isLoggedIn) return;
      navigate('/log');
    } catch (error) {
      console.error('login failed:', error);
    }
  };

  return (
    <div className="centered">
      <div className="horizontal-flex">
        <div className="vertical-flex">
          <div className="component-container">
            {isRegistering ? (
              <>
                <Register toggleRegister={toggleRegister} />
                <button type="plaintext" onClick={toggleRegister}>
                  Already have an account
                </button>
              </>
            ) : (
              <>
                <Login onLogin={handleLogin} />
                <button type="plaintext" onClick={toggleRegister}>
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;