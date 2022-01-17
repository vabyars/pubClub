const express = require('express');
const router = express.Router();

const controller = require('../controllers');

router.get('/', (req, res) => {
    res.redirect('/pub/home');
});

router.get('/home', controller.home_page);

router.get('/table/:id', controller.table_page);

router.post('/table/:id', controller.book_table);

router.get('/order/:id', controller.order_page);


module.exports = router;