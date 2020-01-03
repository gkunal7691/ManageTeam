const express = require('express');
const router = express.Router();
const weekday = require('../../models').WeekDay;


router.get('/', function (req, res, next) {
    weekday.findAll().then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)

})

module.exports = router;