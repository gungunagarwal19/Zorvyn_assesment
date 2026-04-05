const http = require('http');

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing all routes...\n');

  try {
    // 1. Health check
    console.log('1️⃣  Testing /health');
    let res = await makeRequest('GET', '/health');
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, res.body);
    console.log();

    // 2. Register user
    console.log('2️⃣  Testing POST /api/users/register');
    res = await makeRequest('POST', '/api/users/register', {
      email: 'testuser1@example.com',
      password: 'password123',
      name: 'Test User'
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, res.body);
    const userId = res.body.user?.id;
    console.log();

    // 3. Login user
    console.log('3️⃣  Testing POST /api/users/login');
    res = await makeRequest('POST', '/api/users/login', {
      email: 'testuser1@example.com',
      password: 'password123'
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   Response:`, res.body);
    const token = res.body.token;
    console.log();

    // 4. Get current user (requires token)
    if (token) {
      console.log('4️⃣  Testing GET /api/users/me (with token)');
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/users/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, JSON.parse(data));
            resolve();
          });
        });
        req.end();
      });
      console.log();
    }

    // 5. Create financial record (Analyst/Admin only)
    if (token) {
      console.log('5️⃣  Testing POST /api/records (create financial record)');
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/records',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, JSON.parse(data));
            resolve();
          });
        });
        req.write(JSON.stringify({
          type: 'EXPENSE',
          category: 'GROCERY',
          amount: 50.00,
          date: new Date().toISOString().split('T')[0],
          notes: 'Weekly groceries'
        }));
        req.end();
      });
      console.log();
    }

    // 6. Get user's records
    if (token) {
      console.log('6️⃣  Testing GET /api/records (get user records)');
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/records',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, JSON.parse(data));
            resolve();
          });
        });
        req.end();
      });
      console.log();
    }

    // 7. Dashboard summary
    if (token) {
      console.log('7️⃣  Testing GET /api/dashboard/summary');
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/dashboard/summary',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, JSON.parse(data));
            resolve();
          });
        });
        req.end();
      });
      console.log();
    }

    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

runTests();
