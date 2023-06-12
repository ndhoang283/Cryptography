var jwt = require('jsonwebtoken')
var fs = require('fs')
var cert = fs.readFileSync('./key/domain.csr')
var privateKey = fs.readFileSync('./key/domain.key');
//var token = jwt.sign({ foo: 'bar' }, privateKey,  {algorithm: 'RS256' });

//console.log(token);

token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2ODY1MzEyMzB9.bM8xV-xBEqY8Ofw91GRJxdSHVvIXtkE_vpKKit2lg1ucIu8a_4c5vFscDxBU2dYoZakznJtbM-qc_i_wWcB_oWwlMWUbKmW8f4qrILgt-FgDMnuAHbbM4Het_0uQEJDf8ch2xc-DGVw0qIpj1dQbwxfJM1IOCVhI59RaCulC129xf4MiH3wk15Ds1RVPPpEPSng2yITKgrj51O1TAWcEZ32JZOM64aAsMfHxUAQApBUdAqM-kTZYO4FWw8e34iqYzDFh-rxyisvDunsVBAquyX_ddNTu-tu99dWuAMB1B8BMGvwuGpbfKfbtAaxSJW-2Hcs26voj5_LBhIc9SrrgTQ'
jwt.verify(token, cert, {algorithm: 'RS256' }, function(err, data, ){
    console.log(err)
    console.log(data)
})