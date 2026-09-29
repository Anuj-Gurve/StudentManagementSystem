import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', courseId: '', grade: 'A' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eRes, sRes, cRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/students'),
        api.get('/courses'),
      ]);
      setEnrollments(eRes.data);
      setStudents(sRes.data);
      setCourses(cRes.data);
    } catch {
      setError('Failed to fetch enrollment data.');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.studentId || !formData.courseId) {
      setError('Please select both a student and a course.');
      return;
    }

    try {
      await api.post('/enrollments', {
        student: { id: parseInt(formData.studentId) },
        course: { id: parseInt(formData.courseId) },
        grade: formData.grade,
      });
      setFormData({ studentId: '', courseId: '', grade: 'A' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating enrollment.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enrollment record?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      loadData();
    } catch {
      setError('Failed to delete enrollment.');
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-3">Enrollment & Grades</h3>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card shadow-sm p-3 mb-4 bg-white border-0">
        <h6 className="fw-bold text-warning text-dark mb-3">Enroll Student into Course</h6>
        <form onSubmit={handleEnroll} className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rollNo} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              required
            >
              <option value="">-- Choose Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select form-select-sm"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
              <option value="F">Grade F</option>
            </select>
          </div>

          <div className="col-md-2">
            <button type="submit" className="btn btn-warning btn-sm w-100 fw-semibold text-dark">
              Enroll
            </button>
          </div>
        </form>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Grade</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No active enrollments found.</td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id}>
                    <td>#{enr.id}</td>
                    <td className="fw-semibold">{enr.student?.name || `Student ID: ${enr.student?.id || '-'}`}</td>
                    <td>{enr.course?.name || `Course ID: ${enr.course?.id || '-'}`}</td>
                    <td>
                      <span className={`badge ${enr.grade === 'F' ? 'bg-danger' : 'bg-primary'}`}>
                        {enr.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(enr.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}