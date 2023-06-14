var jwt = require('jsonwebtoken');
var fs = require('fs');

var public1 = fs.readFileSync('./key/public.crt');

var token = ''

// Server authentication
var decoded = jwt.verify(token, public1, { algorithm: 'RS256' });
console.log('Decoded:', decoded);
