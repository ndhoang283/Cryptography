const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AccountModel = require('./models/account');
const GoodsModel = require('./models/product')
const Invoice = require('./models/invoice')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
var fs = require('fs')
var privateKey = fs.readFileSync('./key/keyforpassword.pem')
const req = require('express/lib/request')

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, '/public')))

var checkLogin = (req, res, next)=>{
    try {
        var token = req.cookies.token
        var idUser = jwt.verify(token, 'mk')
        AccountModel.findOne( {
            _id: idUser
        })
        .then(data=>{
            if(data){
                req.data = data
                next()
            }else{
                res.json('not permisions')
            }
        })
        .catch(err=>{

        })
    } catch (err) {
        res.status(500).json('token khong hop le')
    }
}

var checkCustomer = (req, res, next)=>{
    var role = req.data.role
    if(role >= 0) {
        next()
    } else {
        res.json('not permision')
    }
}

var checkSeller = (req, res, next)=>{
    var role = req.data.role
    if(role >= 1) {
        next()
    } else {
        res.json('not permision')
    }
}

var checkAdmin = (req, res, next)=>{
    var role = req.data.role
    if(role >= 2) {
        next()
    } else {
        res.json('not permision')
    }
}

app.get('/home', (req, res, next) => {
    var duongDanFile = path.join(__dirname, 'home.html')
    res.sendFile(duongDanFile)
});

var accountRouter = require('./routers/account');
app.use('/api/account/', accountRouter)

var productRouter = require('./routers/product')
app.use('/api/product', productRouter)

var invoiceRouter = require('./routers/invoice')
app.use('/api/invoice', invoiceRouter)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
