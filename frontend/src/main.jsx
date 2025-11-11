import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

// create root container for react app
// mount App component to root element in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* StrictMode for react error handling */}
    <BrowserRouter> {/* BrowserRouter for routing */}
      <App /> {/* render App component */}
    </BrowserRouter>
  </StrictMode>
)
