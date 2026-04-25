const axios = require('axios');

async function test() {
  try {
    const regRes = await axios.post('http://localhost:5050/api/auth/register', {
      name: 'Test Setup',
      email: 'testsetup2@example.com',
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log('Registered successfully');

    const setupRes = await axios.post('http://localhost:5050/api/auth/setup-company', {
      mode: 'join',
      companyName: 'paradigmshift',
      joinCode: ''
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Setup successful:', setupRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status:', err.response.status);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Error:', err.message);
    }
  }
}
test();
