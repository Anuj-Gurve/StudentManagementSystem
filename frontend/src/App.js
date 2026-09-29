import React, { useState, useEffect } from 'react';
import Login from './views/Login.jsx';
import Dashboard from './views/Dashboard.jsx';
import Students from './views/Students.jsx';
import Courses from './views/Courses.jsx';
import Enrollments from './views/Enrollments.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('username'));
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem('token'));
      setUser(localStorage.getItem('username'));
    };
    window.addEventListener('authChange', syncAuth);
    return () => window.removeEventListener('authChange', syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLoginSuccess={() => window.dispatchEvent(new Event('authChange'))} />;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
        <span className="navbar-brand fw-bold">
          <i className="bi bi-mortarboard-fill me-2 text-warning"></i>Student Portal
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${currentView === 'dashboard' ? 'active fw-bold text-white' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${currentView === 'students' ? 'active fw-bold text-white' : ''}`}
                onClick={() => setCurrentView('students')}
              >
                <i className="bi bi-people me-1"></i>Students
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${currentView === 'courses' ? 'active fw-bold text-white' : ''}`}
                onClick={() => setCurrentView('courses')}
              >
                <i className="bi bi-journal-bookmark me-1"></i>Courses
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${currentView === 'enrollments' ? 'active fw-bold text-white' : ''}`}
                onClick={() => setCurrentView('enrollments')}
              >
                <i className="bi bi-card-checklist me-1"></i>Enrollments
              </button>
            </li>
          </ul>
          <div className="d-flex align-items-center text-light">
            <span className="badge bg-secondary me-3">
              <i className="bi bi-person-circle me-1"></i>{user || 'User'}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container my-4">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'students' && <Students />}
        {currentView === 'courses' && <Courses />}
        {currentView === 'enrollments' && <Enrollments />}
      </main>
    </div>
  );
}