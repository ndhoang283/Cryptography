const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://20521841:291101@cluster0.4kmc2yl.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    seller: String,
    quantity: Number,
    price: Number
}, {
    collection: 'product'
});

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
