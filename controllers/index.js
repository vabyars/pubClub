const Table = require("../models/table");
const Order = require("../models/order");

exports.home_page = function(req, res, next) {

    Table.find({}, 'number capacity bookingPrice')
        .sort({number : 1})
        .exec(function (err, list_tables) {
            if (err) { return next(err); }
            res.render('tables', { title: 'Hello', table_list: list_tables });
        });
};


exports.order_page = function(req, res, next) {
    console.log(req.params.id)
    Order.findOne({'_id': req.params.id})
        .exec(function (error, order){
            if (error) { return next(error); }
            Table.findOne({number: order.table}, 'number capacity bookingPrice')
                .exec(function (err, table) {
                    if (err) { return next(err); }
                    const date = `${order.startDate.toDateString()} ${getHoursString(order.startDate)} - ${getHoursString(order.endDate)}`
                    res.render('order', { title: `Order № ${order._id.toString().slice(0, 8)}`, table, order: {date, email: order.taker.email, name: order.taker.name} });
                });
        })
}

function getHoursString(date){
    const time = date.getMinutes().toString();
    return `${date.getHours()}:${time.length > 1 ? time : '0' + time }`
}

exports.table_page = function(req, res, next) {
    Table.findOne({number: req.params.id}, 'number capacity bookingPrice')
        .exec(function (err, table) {
            if (err) { return next(err); }
            res.render('table', { title: `Table № ${req.params.id}`, table });
        });
};

exports.book_table =
    function(req, res, next) {
        const date = new Date(req.body.date);
        const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        const startDate = new Date(req.body.date + ' ' + req.body.from)
        const endDate = new Date(req.body.date + ' ' + req.body.to)
        const newOrder = new Order(
            {
                startDate,
                endDate,
                taker: {
                    name: req.body.username,
                    email: req.body.email,
                },
                table: parseInt(req.params.id),
            }
        );


        Order.find({ 'table': req.params.id, 'startDate': {$gt : date}, 'endDate': {$lt: nextDate}  })
            .exec( async function(err, orders) {
                if (err) { return next(err); }
                if (isTimeBooked(startDate, endDate, orders)) {
                    // Genre exists, redirect to its detail page.
                    Table.findOne({number: req.params.id}, 'number capacity bookingPrice')
                        .exec(function (err, table) {
                            if (err) { return next(err); }
                            res.render('table', {
                                title: `Table № ${req.params.id}`,
                                table,
                                formData: {
                                    date: req.body.date,
                                    from: req.body.from,
                                    to: req.body.to,
                                    username: req.body.username,
                                    email: req.body.email,
                                },
                                error: 'This time is taken. Try to book for another date. '});
                        });
                }
                else {
                    newOrder.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(`/pub/order/${newOrder._id}`);
                    });
                }
            });
    }

function isTimeBooked(startDate, endDate, orders){
    for (order of orders){
        if (startDate <= order.endDate && endDate >= order.startDate)
            return true;
    }
    return false;
}