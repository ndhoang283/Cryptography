const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AccountModel = require('./models/account');
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, './public')))

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

app.post('/login', (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password

    AccountModel.findOne({
        username: username,
        password: password
    })
    .then(data=>{
        if(data){
            res.json('dang nhap thanh cong')
        }else {
            res.status(300).json('account khong dung')
        }
    })
    .catch(err=>{
        res.status(500).json('co loi ben server')
    })
})

var accountRouter = require('./routers/account')

app.use('/api/account/', accountRouter)

app.get('/', (req, res) => {
    var duongDanFile = path.join(__dirname, 'home.html')
    res.sendFile(duongDanFile)
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
