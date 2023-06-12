const express = require('express');
const crypto = require('crypto')
var fs = require('fs')
var router = express.Router();
const InvoiceModel = require('../models/invoice.js');
const AccountModel = require('../models/account.js');
const { json } = require('body-parser');
var publicKey = fs.readFileSync('./key/public.crt')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const PAGE_SIZE = 5

router.use('/public', express.static(path.join(__dirname, '../public')))
router.use(cookieParser());

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

// lay du lieu tu db
router.get('/',checkLogin, checkAdmin, (req, res, next) => {
    var page = req.query.page;
    if (page) {
        page = parseInt(page);
        var skip = (page - 1) * PAGE_SIZE;

        InvoiceModel.find({})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then(data => {
                InvoiceModel.countDocuments({}).then((total) => {
                    var tongSoPage = Math.floor(total / PAGE_SIZE);
                    res.json({
                        total: total,
                        tongSoPage: tongSoPage,
                        data: data
                    });
                });
            })
            .catch(err => {
                res.status(500).json('Error');
            });
    } else {
        InvoiceModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(500).json('Loi server');
            });
    }
});

router.get('/getAll', checkLogin, checkAdmin, (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../invoice_getAll.html'))
})

router.get('/:id', (req, res, next)=>{
    var id = req.params.id

    InvoiceModel.findById(id)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json('Loi server')
    })
})

// them moi du lieu vao db
router.post('/', (req, res, next)=>{
    var customer = req.body.customer
    var product = req.body.product
    var quantity = req.body.quantity
    var ammout = req.body.ammout

    InvoiceModel.create({
        customer: customer,
        product: product,
        quantity: quantity,
        ammout: ammout
    })
    .then(data=>{
        res.json('them hoa don thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

// update du lieu trong db
router.put('/:id', (req, res, next)=>{
    var id = req.params.id
    var newproduct = req.body.newproduct

    InvoiceModel.findByIdAndUpdate(id, {
        product: newproduct
    })
    .then(data=>{
        res.json('update thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

// xoa du lieu trong db
router.delete('/:id', (req, res, next)=>{
    var id = req.params.id

    InvoiceModel.deleteOne({
        _id: id
    })
    .then(data=>{
        res.json('xoa thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

module.exports = router