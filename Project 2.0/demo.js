var jwt = require('jsonwebtoken');
var fs = require('fs');

var private1 = fs.readFileSync('./key/private.pem');
var public1 = fs.readFileSync('./key/public.crt');
var private2 = fs.readFileSync('./key/private2.pem');
var public2 = fs.readFileSync('./key/public2.pem');

var payload = { message: 'hello' };

//var token ='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDg2ODY4OWE4MmExZGI3MTI4ZTY2Y2QiLCJpYXQiOjE2ODY2NTM4OTJ9.h8dlhxMFgV8tugFkcWBQrkKUlXaVUHDukRh18bGqrBMJo05BshGAix1Igwa7C6bZEukqXjQJvmit6ejALEMZnMa_uwIbddyTDokmE56sc-RmwQgFL3CEge91cNsiw4sYxUbba-r-dLr6NzNqGfV1o9HQ2HYxjF8DsNvjMtdPy3Ee2L4a75QzqC7Cxvq0eyfJupQQ_Da14iva_J5qaypr3jqWG1W4hK6WpfRhbhY32oldB1hM-TeEA1V_8ssv9pZErEYXm8qpH4wMbvOtSsdJPslyXJTo5y-Lw4cJGRG3wCGV5oNrNE3vUv_b0jGYNGlHZDBtoi_ahvKlx_scprThaQ'

// Viết JWT bằng khóa riêng tư
var token = jwt.sign(payload, private2, { algorithm: 'RS256' });
console.log('Token:', token);

// Xác minh JWT bằng khóa công khai
var decoded = jwt.verify(token, public1, { algorithm: 'RS256' });
console.log('Decoded:', decoded);
