const { generateRandomIP } = require('./src/utils/generateIP');
const ip = generateRandomIP();
const rateLimiter = require('./src/services/rateLimiter');

for(let i=0; i<25; i++) {
  if(!rateLimiter.isAllowed(ip)) {
    console.log(`Request ${i+1}: Blocked (HTTP 429)`);
  } else {
    console.log(`Request ${i+1}: Allowed`);
  }
}
