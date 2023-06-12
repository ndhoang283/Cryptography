const express = require('express');
var router = express.Router();
const { json } = require('body-parser');
const InvoiceModel = require('../models/invoice.js');
const PAGE_SIZE = 5

// lay du lieu tu db
router.get('/', (req, res, next)=>{
    var page = req.query.page;
    if(page) {
        page = parseInt(page)
        var skip = (page - 1) * PAGE_SIZE

        InvoiceModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then(data=>{
            InvoiceModel.countDocuments({}).then((total)=>{
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
        InvoiceModel.find({})
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

    InvoiceModel.create({
        customer: customer,
        product: product,
        quantity: quantity
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