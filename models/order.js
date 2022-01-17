const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        startDate: {type: Date},
        endDate: {type: Date},
        taker: {type: {name: String, email: String}},
        table: {type: Number, required: true},
    }
);

OrderSchema
    .virtual('url')
    .get(function () {
        return '/pub/order/' + this._id;
    });

module.exports = mongoose.model('Order', OrderSchema);