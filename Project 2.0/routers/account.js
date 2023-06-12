const express = require('express');
const crypto = require('crypto')
var fs = require('fs')
var router = express.Router();
const AccountModel = require('../models/account.js');
const { json } = require('body-parser');
const PAGE_SIZE = 5
var secretKey = fs.readFileSync('./key/keyforpassword.pem');
var privateKey = fs.readFileSync('./key/private.pem')
var publicKey = fs.readFileSync('./key/public.crt')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

router.use('/public', express.static(path.join(__dirname, '../public')))

var checkLogin = (req, res, next)=>{
    try {
        var token = req.cookies.token
        var idUser = jwt.verify(token, publicKey)
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

router.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../login.html'))
})

router.post('/login', (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password

    const hmac = crypto.createHmac('sha256', secretKey);
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
            }, privateKey, { algorithm: 'RS256' })
            res.json({
                message: 'ok',
                token: token
            })
        }else {
            res.status(300).json('fail')
        }
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

router.get('/register', (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../register.html'))
})
router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name
        const phone = req.body.phone
        const address = req.body.address

        const data = await AccountModel.findOne({ username: username });
        if (data) {
            return res.json('Account already exists');
        } else {
            const hmac = crypto.createHmac('sha256', secretKey);
            hmac.update(password)
            const hashedPassword = hmac.digest('hex')

            await AccountModel.create({
                username: username,
                password: hashedPassword,
                name: name,
                phone: phone,
                address: address
            });
            return res.json('Account created successfully');
        }
    } catch (err) {
        return res.status(500).json('Server error');
    }
});

// lay du lieu tu db
router.get('/', checkLogin, checkAdmin, (req, res, next) => {
    var page = req.query.page;
    if (page) {
        page = parseInt(page);
        var skip = (page - 1) * PAGE_SIZE;

        AccountModel.find({})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then(data => {
                AccountModel.countDocuments({}).then(total => {
                    var tongSoPage = Math.floor(total / PAGE_SIZE);
                    res.json({
                        total: total,
                        tongSoPage: tongSoPage,
                        data: data
                    });
                });
            })
            .catch(err => {
                res.status(500).json('Lỗi server');
            });
    } else {
        AccountModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json('Lỗi server');
            });
    }
});

router.get('/getAll', checkLogin, checkAdmin, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../account_getAll.html'));
});


router.get('/my', checkLogin, (req, res, next)=>{
    var token = req.cookies.token
    var idUser = jwt.verify(token, publicKey)

    AccountModel.findById(idUser)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json('Loi server')
    })
})

router.get('/getMy', checkLogin, (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../account_my.html'));
})

// them moi du lieu vao db
router.post('/create', checkLogin, checkAdmin, (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password
    var name = req.body.name
    var phone = req.body.phone
    var address = req.body.address
    var role = req.role

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(password)
    const hashedPassword = hmac.digest('hex')

    AccountModel.create({
        username: username,
        password: hashedPassword,
        name: name,
        phone:phone,
        address: address,
        roler: role
    })
    .then(data=>{
        res.json('them account thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

// update du lieu trong db
router.put('/changPassword', checkLogin, checkAdmin, (req, res, next)=>{
    var id = req.body.id
    var newPassword = req.body.newPassword
    var name = req.body.name
    var phone = req.body.phone
    var address = req.body.address
    var role = req.body.role

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(newPassword)
    const hashedPassword = hmac.digest('hex')

    AccountModel.findByIdAndUpdate(id, {
        password: hashedPassword,
        name: name,
        phone:phone,
        address: address,
        role: role
    })
    .then(data=>{
        res.json('update thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

router.post('/setRole', (req, res, next)=>{
    var id = req.body.id
    var role = req.body.role

    AccountModel.findByIdAndUpdate(id, {
        role: role
    })
    .then(data=>{
        res.json('ok')
    })
    .catch(err=>{
        res.status(500).json('fail')
    })
})

// xoa du lieu trong db
router.post('/delete', checkLogin, checkAdmin, (req, res, next)=>{
    var id = req.body.id

    AccountModel.deleteOne({
        _id: id
    })
    .then(data=>{
        res.json('ok')
    })
    .catch(err=>{
        res.status(500).json('fail')
    })
})

router.get('/admin', checkLogin, checkAdmin, (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../admin.html'))
})

module.exports = router;
