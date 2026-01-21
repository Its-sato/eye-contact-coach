import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import LandingPage from './pages/LandingPage.jsx';
import InstallationGuide from './pages/InstallationGuide.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const params = new URLSearchParams(window.location.search);

// If opened in auto mode (Extension Popup), skip router and render App directly
if (params.get('auto') === 'true') {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<App />} />
          <Route path="/install" element={<InstallationGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
