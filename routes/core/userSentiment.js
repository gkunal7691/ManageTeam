const express = require('express');
const router = express.Router();


const UserSentimentType = require('../../models').UserSentimentType;
const UserSentimentIndex = require('../../models').UserSentimentIndex;


router.get('/', async function(req, res, next) {

    UserSentimentType.findAndCountAll().then((endpoints) => {

        res.json({success: true, data: endpoints.rows, count: endpoints.count});
    }).catch(next)
});


// router.post('/', function(req, res, next) {
//     UserSentimentIndex.create(req.body).then((data) => {
//         res.json({success: true, data: data});

//     }).catch(next)
// });

module.exports = router;