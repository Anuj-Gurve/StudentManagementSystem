// LocalStorage-backed Mock Service (No backend required)
const STORAGE_KEYS = {
  STUDENTS: 'sms_mock_students',
  COURSES: 'sms_mock_courses',
  ENROLLMENTS: 'sms_mock_enrollments',
};

const defaultStudents = [
  { id: 1, rollNo: 'IT101', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9876543210', department: 'Information Technology', semester: 4 },
  { id: 2, rollNo: 'IT102', name: 'Priya Patil', email: 'priya@example.com', phone: '9822334455', department: 'Computer Science', semester: 6 },
  { id: 3, rollNo: 'IT103', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '9765432190', department: 'Information Technology', semester: 2 },
];

const defaultCourses = [
  { id: 1, code: 'CS101', name: 'Data Structures & Algorithms', credits: 4 },
  { id: 2, code: 'CS202', name: 'Full Stack Java & React', credits: 3 },
  { id: 3, code: 'CS303', name: 'Database Management Systems', credits: 3 },
];

const defaultEnrollments = [
  { id: 1, student: defaultStudents[0], course: defaultCourses[1], grade: 'A' },
  { id: 2, student: defaultStudents[1], course: defaultCourses[0], grade: 'B' },
];

const getStored = (key, fallback) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(item);
};

const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initialize default storage on first load
getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
getStored(STORAGE_KEYS.COURSES, defaultCourses);
getStored(STORAGE_KEYS.ENROLLMENTS, defaultEnrollments);

const api = {
  async post(url, data) {
    if (url === '/auth/login') {
      if (data.username === 'admin' && data.password === 'admin123') {
        return { data: { token: 'mock-jwt-token-xyz', username: 'admin', role: 'ADMIN' } };
      }
      const err = new Error('Invalid credentials');
      err.response = { data: { message: 'Invalid username or password' } };
      throw err;
    }

    if (url === '/students') {
      const list = getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
      const newStudent = { ...data, id: Date.now() };
      list.push(newStudent);
      setStored(STORAGE_KEYS.STUDENTS, list);
      return { data: newStudent };
    }

    if (url === '/courses') {
      const list = getStored(STORAGE_KEYS.COURSES, defaultCourses);
      const newCourse = { ...data, id: Date.now() };
      list.push(newCourse);
      setStored(STORAGE_KEYS.COURSES, list);
      return { data: newCourse };
    }

    if (url === '/enrollments') {
      const students = getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
      const courses = getStored(STORAGE_KEYS.COURSES, defaultCourses);
      const enrollments = getStored(STORAGE_KEYS.ENROLLMENTS, defaultEnrollments);

      const targetStudent = students.find((s) => s.id === data.student?.id);
      const targetCourse = courses.find((c) => c.id === data.course?.id);

      const newEnrollment = {
        id: Date.now(),
        student: targetStudent || { name: 'Unknown' },
        course: targetCourse || { name: 'Unknown' },
        grade: data.grade,
      };

      enrollments.push(newEnrollment);
      setStored(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return { data: newEnrollment };
    }

    return { data: {} };
  },

  async get(url) {
    if (url.startsWith('/students')) {
      const list = getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
      if (url.includes('?search=')) {
        const query = decodeURIComponent(url.split('?search=')[1]).toLowerCase();
        return { data: list.filter((s) => s.name.toLowerCase().includes(query)) };
      }
      return { data: list };
    }

    if (url === '/courses') {
      return { data: getStored(STORAGE_KEYS.COURSES, defaultCourses) };
    }

    if (url === '/enrollments') {
      return { data: getStored(STORAGE_KEYS.ENROLLMENTS, defaultEnrollments) };
    }

    if (url === '/dashboard/summary') {
      const s = getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
      const c = getStored(STORAGE_KEYS.COURSES, defaultCourses);
      const e = getStored(STORAGE_KEYS.ENROLLMENTS, defaultEnrollments);
      return {
        data: {
          totalStudents: s.length,
          totalCourses: c.length,
          totalEnrollments: e.length,
        },
      };
    }

    return { data: [] };
  },

  async put(url, data) {
    if (url.startsWith('/students/')) {
      const id = Number(url.replace('/students/', ''));
      const list = getStored(STORAGE_KEYS.STUDENTS, defaultStudents);
      const idx = list.findIndex((s) => s.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        setStored(STORAGE_KEYS.STUDENTS, list);
      }
      return { data: list[idx] };
    }

    if (url.startsWith('/courses/')) {
      const id = Number(url.replace('/courses/', ''));
      const list = getStored(STORAGE_KEYS.COURSES, defaultCourses);
      const idx = list.findIndex((c) => c.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        setStored(STORAGE_KEYS.COURSES, list);
      }
      return { data: list[idx] };
    }

    return { data: {} };
  },

  async delete(url) {
    if (url.startsWith('/students/')) {
      const id = Number(url.replace('/students/', ''));
      const list = getStored(STORAGE_KEYS.STUDENTS, defaultStudents).filter((s) => s.id !== id);
      setStored(STORAGE_KEYS.STUDENTS, list);
      return { data: true };
    }

    if (url.startsWith('/courses/')) {
      const id = Number(url.replace('/courses/', ''));
      const list = getStored(STORAGE_KEYS.COURSES, defaultCourses).filter((c) => c.id !== id);
      setStored(STORAGE_KEYS.COURSES, list);
      return { data: true };
    }

    if (url.startsWith('/enrollments/')) {
      const id = Number(url.replace('/enrollments/', ''));
      const list = getStored(STORAGE_KEYS.ENROLLMENTS, defaultEnrollments).filter((e) => e.id !== id);
      setStored(STORAGE_KEYS.ENROLLMENTS, list);
      return { data: true };
    }

    return { data: true };
  },
};

export default api;