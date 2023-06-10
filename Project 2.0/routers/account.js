const express = require('express');
var router = express.Router();
const AccountModel = require('../models/account');
const { json } = require('body-parser');
const PAGE_SIZE = 5

// lay du lieu tu db
router.get('/', (req, res, next)=>{
    var page = req.query.page;
    if(page) {
        page = parseInt(page)
        var skip = (page - 1) * PAGE_SIZE

        AccountModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.status(500).json
        })
    }
    else {
        AccountModel.find({})
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.status(500).json('Loi server')
        })
    }   
})

router.get('/:id', (req, res, next)=>{
    var id = req.params.id

    AccountModel.findById(id)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json('Loi server')
    })
})

// them moi du lieu vao db
router.post('/', (req, res, next)=>{
    var username = req.body.username
    var password = req.body.password

    AccountModel.create({
        username: username,
        password: password
    })
    .then(data=>{
        res.json('them account thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

// update du lieu trong db
router.put('/:id', (req, res, next)=>{
    var id = req.params.id
    var newPassword = req.body.newPassword

    AccountModel.findByIdAndUpdate(id, {
        password: newPassword
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

    AccountModel.deleteOne({
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