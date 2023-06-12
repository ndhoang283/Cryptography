const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MyDB', {
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
