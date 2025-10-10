import './App.css';
import Auth from './components/auth/Auth.jsx';
import Dash from './components/dash/Dash.jsx';
import ChooseMetrics from './components/welcome/ChooseMetrics.jsx';
import LogRoutes from './components/welcome/LogRoutes.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/welcome" />} />
        <Route path='/welcome' element={<Auth />} />
        <Route path='/dash' element={<Dash />} />
        <Route path='/choosemetrics' element={<ChooseMetrics />} />

        {/* delegate /log/* routes to LogRoutes */}
        <Route path='/log/*' element={<LogRoutes />} />
      </Routes>
    </>
  );
}

export default App;
