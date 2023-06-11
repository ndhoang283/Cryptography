const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AccountModel = require('./models/account');
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')))

app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const data = await AccountModel.findOne({ username: username });
        if (data) {
            return res.json('user nay da ton tai');
        } else {
            await AccountModel.create({
                username: username,
                password: password
            });
            return res.json('Tao tai khoan thanh cong');
        }
    } catch (err) {
        return res.status(500).json('Tao tai khoan that bai');
    }
});


// GET Login
app.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'login.html'))
})

/*app.get('/home', (req, res, next)=>{
    var token = req.cookies.token;
    var decodeToken = jwt.verify(token, 'mk')
    AccountModel.find({_id:decodeToken._id})
    .then(function(data){
        if(data.length==0) {
            return res.redirect('/login')
        }else{
            if(data[0].role == 2) {
                next()
            }else{
                return res.redirect('/login')
            }
        }
    })
}, (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'home.html'))
})*/


// POST Login
app.post('/login', (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
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

var accountRouter = require('./routers/account')

app.use('/api/account/', accountRouter)

app.get('/home', (req, res, next) => {
    var duongDanFile = path.join(__dirname, 'index.html')
    res.sendFile(duongDanFile)
});

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

var checkStudent = (req, res, next)=>{
    var role = req.data.role
    if(role >= 0) {
        next()
    } else {
        res.json('not permision')
    }
}

var checkTeacher = (req, res, next)=>{
    var role = req.data.role
    if(role >= 1) {
        next()
    } else {
        res.json('not permision')
    }
}

var checkManager = (req, res, next)=>{
    var role = req.data.role
    if(role >= 2) {
        next()
    } else {
        res.json('not permision')
    }
}

app.get('/task', checkLogin, checkStudent, (req, res, next)=>{
    console.log(req.data)
    res.json('all task')
})

app.get('/student', checkLogin, checkTeacher, (req, res, next)=>{
    next()
}, (req, res, next)=>{
    res.json('STUDENT')
})

app.get('/teacher', checkLogin, checkManager, (req, res, next)=>{
    next()
}, (req, res, next)=>{
    res.json('TEACHER')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
