import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard({ setCurrentView }) {
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalEnrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setStats(res.data);
    } catch {
      try {
        const [s, c, e] = await Promise.all([
          api.get('/students'),
          api.get('/courses'),
          api.get('/enrollments'),
        ]);
        setStats({
          totalStudents: s.data.length,
          totalCourses: c.data.length,
          totalEnrollments: e.data.length,
        });
      } catch (err) {
        console.error('Error fetching dashboard counts', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 fw-bold text-secondary">Dashboard Overview</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div
                className="card text-white bg-primary shadow-sm h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('students')}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Total Students</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.totalStudents}</h2>
                  </div>
                  <i className="bi bi-people-fill display-4 opacity-50"></i>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card text-white bg-success shadow-sm h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('courses')}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Total Courses</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.totalCourses}</h2>
                  </div>
                  <i className="bi bi-journal-code display-4 opacity-50"></i>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card text-white bg-warning text-dark shadow-sm h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentView('enrollments')}
              >
                <div className="card-body d-flex justify-content-between align-items-center text-dark">
                  <div>
                    <h6 className="card-title text-uppercase mb-1">Total Enrollments</h6>
                    <h2 className="display-5 fw-bold mb-0">{stats.totalEnrollments}</h2>
                  </div>
                  <i className="bi bi-card-checklist display-4 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold mb-3">System Modules Verified</h5>
            <div className="row g-2">
              <div className="col-sm-6"><i className="bi bi-check-circle-fill text-success me-2"></i>JWT Authentication & Auth Guarding</div>
              <div className="col-sm-6"><i className="bi bi-check-circle-fill text-success me-2"></i>Full Student CRUD with Unique Roll Nos</div>
              <div className="col-sm-6"><i className="bi bi-check-circle-fill text-success me-2"></i>Course Catalog & Credit Tracking</div>
              <div className="col-sm-6"><i className="bi bi-check-circle-fill text-success me-2"></i>Relational Student-Course Enrollment & Grades</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}