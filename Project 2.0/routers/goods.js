const express = require('express');
var router = express.Router();
const { json } = require('body-parser');
const GoodsModel = require('../models/goods.js');
const PAGE_SIZE = 5

// lay du lieu tu db
router.get('/', (req, res, next)=>{
    var page = req.query.page;
    if(page) {
        page = parseInt(page)
        var skip = (page - 1) * PAGE_SIZE

        GoodsModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then(data=>{
            GoodsModel.countDocuments({}).then((total)=>{
                console.log(total);
                var tongSoPage = Math.floor(total/PAGE_SIZE)
                res.json({
                    total: total,
                    tongSoPage: tongSoPage,
                    data: data
                });
            })
        })
        .catch(err=>{
            res.status(500).json
        })
    }
    else {
        GoodsModel.find({})
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

    GoodsModel.findById(id)
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json('Loi server')
    })
})

// them moi du lieu vao db
router.post('/', (req, res, next)=>{
    var name = req.body.name
    var type = req.body.type
    var quantity = req.body.quantity

    GoodsModel.create({
        name: name,
        type: type,
        quantity: quantity
    })
    .then(data=>{
        res.json('them mat hang thanh cong')
    })
    .catch(err=>{
        res.status(500).json('loi server')
    })
})

// update du lieu trong db
router.put('/:id', (req, res, next)=>{
    var id = req.params.id
    var newtype = req.body.newtype

    GoodsModel.findByIdAndUpdate(id, {
        type: newtype
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

    GoodsModel.deleteOne({
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