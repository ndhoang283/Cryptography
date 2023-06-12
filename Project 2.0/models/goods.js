const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const GoodsSchema = new Schema({
    name: String,
    type: String,
    quantity: {
        type: Number,
        default: 0
    }
}, {
    collection: 'goods'
});

const GoodsModel = mongoose.model('goods', GoodsSchema);

module.exports = GoodsModel;
