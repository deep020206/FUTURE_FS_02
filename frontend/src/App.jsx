import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback component
const PageLoader = () => (
  <div className="page-loader">
    <div className="loading-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        <div className="skeleton-card large"></div>
        <div className="skeleton-row">
          <div className="skeleton-card small"></div>
          <div className="skeleton-card small"></div>
          <div className="skeleton-card small"></div>
        </div>
        <div className="skeleton-card medium"></div>
      </div>
    </div>
  </div>
);

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDarkMode);
  }, []);  useEffect(() => {
    // Apply dark mode class to body and html
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.add('dark-theme');
      document.body.classList.add('dark-mode');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <Router future={router.future}>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}
export default App;