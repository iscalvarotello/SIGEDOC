import http from 'http';

const loginData = JSON.stringify({
  email: 'admin@sigedoc.com',
  password: 'admin'
});

const loginReq = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
}, (loginRes) => {
  let loginResp = '';
  loginRes.on('data', d => loginResp += d);
  loginRes.on('end', () => {
    const token = JSON.parse(loginResp).token;
    
    http.get({
      hostname: 'localhost',
      port: 3000,
      path: '/api/organization/fuel-stations?plain=true',
      headers: { 'Authorization': 'Bearer ' + token }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Fuel Station Response:', JSON.parse(data));
      });
    });
  });
});

loginReq.write(loginData);
loginReq.end();
