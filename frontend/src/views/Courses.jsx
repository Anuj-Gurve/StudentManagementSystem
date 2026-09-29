import React, { useState, useEffect } from 'react';
import api from '../api';

const initialCourse = { code: '', name: '', credits: 3 };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(initialCourse);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch {
      setError('Failed to fetch courses.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      setFormData(initialCourse);
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course. Code must be unique.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      loadCourses();
    } catch {
      setError('Cannot delete course with active student enrollments.');
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-3">Course Catalog</h3>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card shadow-sm p-3 mb-4 bg-white border-0">
        <h6 className="fw-bold text-success mb-3">
          {editingId ? 'Edit Course' : 'Create Course'}
        </h6>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Course Code (e.g. CS101)"
              className="form-control form-control-sm"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              placeholder="Course Name"
              className="form-control form-control-sm"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Credits"
              className="form-control form-control-sm"
              required
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-success btn-sm w-100">
              {editingId ? 'Save' : 'Add Course'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialCourse);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">No courses found.</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id}>
                    <td><span className="badge bg-secondary">{c.code}</span></td>
                    <td className="fw-semibold">{c.name}</td>
                    <td>{c.credits}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => {
                          setEditingId(c.id);
                          setFormData({ code: c.code, name: c.name, credits: c.credits });
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
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