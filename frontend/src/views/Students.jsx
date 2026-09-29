import React, { useState, useEffect } from 'react';
import api from '../api';

const initialForm = { rollNo: '', name: '', email: '', phone: '', department: 'Information Technology', semester: 1 };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadStudents();
      return;
    }
    try {
      const res = await api.get(`/students?search=${encodeURIComponent(searchTerm)}`);
      setStudents(res.data);
    } catch {
      loadStudents();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
      } else {
        await api.post('/students', formData);
      }
      setFormData(initialForm);
      setEditingId(null);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving student. Verify Roll No / Email uniqueness.');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      department: student.department || '',
      semester: student.semester || 1,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch {
      setError('Cannot delete student with active enrollments.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Student Management</h3>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary btn-sm" type="submit">Search</button>
        </form>
      </div>

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      <div className="card shadow-sm p-3 mb-4 bg-white border-0">
        <h6 className="fw-bold text-primary mb-3">
          {editingId ? 'Edit Student Details' : 'Register New Student'}
        </h6>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Roll No (e.g. IT101)"
              className="form-control form-control-sm"
              required
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Full Name"
              className="form-control form-control-sm"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              placeholder="Email Address"
              className="form-control form-control-sm"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              placeholder="Phone"
              className="form-control form-control-sm"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              min="1"
              max="8"
              placeholder="Semester"
              className="form-control form-control-sm"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="col-md-8">
            <input
              type="text"
              placeholder="Department"
              className="form-control form-control-sm"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm w-100">
              {editingId ? 'Save Changes' : 'Add Student'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialForm);
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
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Sem</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">No students registered yet.</td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id}>
                    <td><span className="badge bg-light text-dark border">{s.rollNo}</span></td>
                    <td className="fw-semibold">{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.department || '-'}</td>
                    <td>{s.semester || '-'}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(s)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>
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