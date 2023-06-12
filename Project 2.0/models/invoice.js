const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MyDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    customer: String,
    good: String,
    quantity: {
        type: Number,
        default: 0
    }
}, {
    collection: 'invoice'
});

const InvoiceModel = mongoose.model('invoice', InvoiceSchema);

module.exports = InvoiceModel;
