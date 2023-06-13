var jwt = require('jsonwebtoken');
var fs = require('fs');

var privateKey = fs.readFileSync('./key/private.pem');
var publicKey = fs.readFileSync('./key/public.crt');

var payload = { message: 'hello' };

// Viết JWT bằng khóa riêng tư
var token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
console.log('Token:', token);

// Xác minh JWT bằng khóa công khai
var decoded = jwt.verify(token, publicKey, { algorithm: 'RS256' });
console.log('Decoded:', decoded);
