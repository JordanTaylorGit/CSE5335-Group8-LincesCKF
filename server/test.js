const http = require('http');

async function runTests() {
  console.log('--- Starting API Tests ---');
  let token = '';

  // 1. Test Register
  const registerRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890'
    })
  });
  const registerText = await registerRes.text();
  console.log('Register:', registerRes.status, registerText);
  const registerData = registerText ? JSON.parse(registerText) : {};
  if (registerData.token) token = registerData.token;

  // 2. Test Get Profile (Requires Auth)
  if (token) {
    const profileRes = await fetch('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    console.log('Profile:', profileRes.status, profileData);
  } else {
    console.log('Skipping profile test due to missing token');
  }

  // 3. Test Products
  const productsRes = await fetch('http://localhost:5000/api/products');
  const productsData = await productsRes.json();
  console.log('Products:', productsRes.status, productsData);

  console.log('--- Tests Completed ---');
}

runTests();