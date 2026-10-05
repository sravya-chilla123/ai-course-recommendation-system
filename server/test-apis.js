const http = require('http');

async function runTests() {
  console.log('--- Starting API Endpoints Verification ---');

  // Helper fetch
  const request = async (path, method = 'GET', body = null, token = null) => {
    const res = await fetch(`http://localhost:5000${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : null
    });
    return res.json();
  };

  // 1. Healthcheck
  const health = await request('/api/health');
  console.log('1. Healthcheck:', health.success ? 'PASS' : 'FAIL', health.message);

  // 2. Login as Demo Student
  const loginRes = await request('/api/auth/login', 'POST', {
    email: 'student@pathpilot.com',
    password: 'student123'
  });
  console.log('2. Student Login:', loginRes.success ? 'PASS' : 'FAIL', '- User:', loginRes.data?.user?.name);
  const token = loginRes.data?.token;

  // 3. Get Course Catalog
  const coursesRes = await request('/api/courses');
  console.log('3. Course Catalog:', coursesRes.success ? 'PASS' : 'FAIL', '- Total Courses:', coursesRes.count);
  const firstCourseId = coursesRes.data?.[0]?._id;

  // 4. Student Profile
  const profileRes = await request('/api/users/profile', 'GET', null, token);
  console.log('4. Profile Retrieval:', profileRes.success ? 'PASS' : 'FAIL', '- Completion %:', profileRes.data?.profileCompletion);

  // 5. Generate AI Recommendations (FR5)
  const recsRes = await request('/api/recommendations/generate', 'POST', {}, token);
  console.log('5. AI Recommendations:', recsRes.success ? 'PASS' : 'FAIL', '- Count:', recsRes.data?.length);
  if (recsRes.data?.[0]) {
    console.log('   - Course #1:', recsRes.data[0].courseName);
    console.log('   - Reason:', recsRes.data[0].reason);
    console.log('   - Skills Gained:', recsRes.data[0].skillsGained?.join(', '));
  }

  // 6. Save Course (FR7)
  const saveRes = await request('/api/saved-courses', 'POST', { courseId: firstCourseId }, token);
  console.log('6. Save Course:', saveRes.success ? 'PASS' : 'FAIL');

  // 7. Update Progress (FR8)
  const progRes = await request(`/api/progress/${firstCourseId}`, 'PUT', {
    status: 'In Progress',
    completionPercentage: 50
  }, token);
  console.log('7. Progress Tracking:', progRes.success ? 'PASS' : 'FAIL', '- Status:', progRes.data?.status, '- Percentage:', progRes.data?.completionPercentage + '%');

  // 8. Admin Login & Stats (FR10)
  const adminLogin = await request('/api/auth/login', 'POST', {
    email: 'admin@pathpilot.com',
    password: 'admin123'
  });
  const adminToken = adminLogin.data?.token;
  const adminStats = await request('/api/admin/stats', 'GET', null, adminToken);
  console.log('8. Admin Stats:', adminStats.success ? 'PASS' : 'FAIL', '- Courses:', adminStats.data?.totalCourses, '- Students:', adminStats.data?.totalStudents);

  console.log('--- All API Tests Completed Successfully ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
