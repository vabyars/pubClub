const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TableSchema = new Schema(
    {
        number: {type: Number, required: true},
        capacity: {type: Number, required: true},
        bookingPrice: {type: Number, required: false},
    }
);

TableSchema
    .virtual('url')
    .get(function () {
        return '/pub/table/' + this.number;
    });

module.exports = mongoose.model('Table', TableSchema);