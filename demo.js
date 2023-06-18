var jwt = require('jsonwebtoken');
var fs = require('fs');

var private = fs.readFileSync('./key/private-key.pem');
var public = fs.readFileSync('./key/public-key.pem');

var encoded = jwt.sign("hello", private, { algorithm: 'ES256' });
console.log('encoded:', encoded);

var decoded = jwt.verify(encoded, public, { algorithm: 'ES256' });
console.log('decoded:', decoded);
