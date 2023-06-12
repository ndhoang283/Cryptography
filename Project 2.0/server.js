const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AccountModel = require('./models/account');
const GoodsModel = require('./models/goods')
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
app.use('/public', express.static(path.join(__dirname, 'public')))

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
    var duongDanFile = path.join(__dirname, 'index.html')
    res.sendFile(duongDanFile)
});

app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name
        const phone = req.body.phone
        const address = req.body.address

        const data = await AccountModel.findOne({ username: username });
        if (data) {
            return res.json('user nay da ton tai');
        } else {
            const hmac = crypto.createHmac('sha256', privateKey);
            hmac.update(password)
            const hashedPassword = hmac.digest('hex')

            await AccountModel.create({
                username: username,
                password: hashedPassword,
                name: name,
                phone: phone,
                address: address
            });
            return res.json('Tao tai khoan thanh cong');
        }
    } catch (err) {
        return res.status(500).json('Tao tai khoan that bai');
    }
});

app.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'login.html'))
})

app.post('/login', (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password

    const hmac = crypto.createHmac('sha256', privateKey);
    hmac.update(password)
    const hashedPassword = hmac.digest('hex')

    AccountModel.findOne({
        username: username,
        password: hashedPassword
    })
    .then(data=>{
        if(data){
            var token = jwt.sign({
                _id: data._id
            }, 'mk')
            res.json({
                message: 'dang nhap thanh cong',
                token: token
            })
        }else {
            res.status(300).json('account khong dung')
        }
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

var accountRouter = require('./routers/account');
app.use('/api/account/', /*checkLogin, checkAdmin,*/ accountRouter)

var goodsRouter = require('./routers/goods')
app.use('/api/goods', /*checkLogin, checkSeller,*/ goodsRouter)

var invoiceRouter = require('./routers/invoice')
app.use('/api/invoice', /*checkLogin, checkCustomer,*/ invoiceRouter)

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
