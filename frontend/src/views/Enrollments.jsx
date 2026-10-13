import React, { useEffect, useState } from 'react';
import api from '../api';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [rollNo, setRollNo] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [grade, setGrade] = useState('A');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [enrollRes, studentRes, courseRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/students'),
        api.get('/courses'),
      ]);
      setEnrollments(enrollRes.data);
      setStudents(studentRes.data);
      setCourses(courseRes.data);
      
      if (studentRes.data.length > 0 && !rollNo) {
        setRollNo(studentRes.data[0].rollNo);
      }
      if (courseRes.data.length > 0 && !courseCode) {
        setCourseCode(courseRes.data[0].code);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Could not load enrollment records.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rollNo || !courseCode) {
      setError('Please select both a student roll number and a course code.');
      return;
    }

    try {
      await api.post('/enrollments', {
        rollNo: rollNo,
        courseCode: courseCode,
        grade: grade,
      });
      loadData();
    } catch (err) {
      const msg = err.response?.data || 'Failed to complete enrollment.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/enrollments/${id}`);
      loadData();
    } catch (err) {
      console.error('Failed to delete enrollment:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Course Enrollments</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Enroll Student by Roll No & Course Code</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Student (Roll No):</label>
              <select
                className="form-select"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              >
                <option value="">Select Student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.rollNo}>
                    {s.rollNo} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Course (Course Code):</label>
              <select
                className="form-select"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              >
                <option value="">Select Course...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Grade:</label>
              <select
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                Enroll
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Current Enrollments</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Student Roll No</th>
                <th>Student Name</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id}>
                    <td>{enr.id}</td>
                    <td><span className="badge bg-primary">{enr.student?.rollNo}</span></td>
                    <td>{enr.student?.name}</td>
                    <td><span className="badge bg-success">{enr.course?.code}</span></td>
                    <td>{enr.course?.name}</td>
                    <td><strong>{enr.grade}</strong></td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(enr.id)}
                      >
                        Delete
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
};

export default Enrollments;