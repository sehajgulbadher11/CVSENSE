const axios = require('axios');

async function testAuth() {
  try {
    const health = await axios.get('http://localhost:5001/health');
    console.log('Health check:', health.data);

    // Attempt a dummy registration
    try {
      const resp = await axios.post('http://localhost:5001/auth/register', { 
        name: 'testuser', 
        email: 'tester' + Math.floor(Math.random() * 10000) + '@test.com', 
        password: '123' 
      });
      console.log('Register attempt success:', resp.status, resp.data);
    } catch (err) {
      console.log('Register attempt failure:', err.response?.status, err.response?.data);
    }
  } catch (error) {
    console.error('Network error - Is the server running?', error.message);
  }
}

testAuth();
