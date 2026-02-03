// Simple API test script
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing SkillSync API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };
    const register = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✅ Registration:', register.data);
    const token = register.data.token;
    console.log('');

    // Test 3: Login
    console.log('3️⃣ Testing User Login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };
    const login = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login:', login.data);
    console.log('');

    // Test 4: Get Current User
    console.log('4️⃣ Testing Get Current User...');
    const me = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Current User:', me.data);
    console.log('');

    // Test 5: Create Project
    console.log('5️⃣ Testing Create Project...');
    const projectData = {
      title: 'Test Project',
      description: 'This is a test project',
      tech_stack: ['React', 'Node.js', 'PostgreSQL'],
      github_link: 'https://github.com/test/project',
      live_link: 'https://test-project.com',
      featured: true
    };
    const project = await axios.post(`${API_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Project Created:', project.data);
    console.log('');

    // Test 6: Get All Projects
    console.log('6️⃣ Testing Get All Projects...');
    const projects = await axios.get(`${API_URL}/projects`);
    console.log('✅ Projects:', projects.data);
    console.log('');

    // Test 7: Create Blog
    console.log('7️⃣ Testing Create Blog...');
    const blogData = {
      title: 'Test Blog Post',
      content: 'This is a test blog post content. It should be long enough to generate an excerpt.',
      tags: ['test', 'nodejs', 'api'],
      published: true
    };
    const blog = await axios.post(`${API_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Blog Created:', blog.data);
    console.log('');

    // Test 8: Get All Blogs
    console.log('8️⃣ Testing Get All Blogs...');
    const blogs = await axios.get(`${API_URL}/blogs`);
    console.log('✅ Blogs:', blogs.data);
    console.log('');

    // Test 9: Update Profile
    console.log('9️⃣ Testing Update Profile...');
    const profileData = {
      bio: 'Full-stack developer passionate about building great apps',
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      github: 'https://github.com/testuser',
      linkedin: 'https://linkedin.com/in/testuser'
    };
    const profile = await axios.put(`${API_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile Updated:', profile.data);
    console.log('');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPI();
