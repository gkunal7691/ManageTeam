
const express = require('express');
const router = express.Router();
const User = require('../../models').User;


router.get('/singleUser/:userId', function (req, res, next) {

    User.findOne({
        where: { id: req.params.userId }
    }).then((userdata) => {

        res.json({ success: true, data: userdata });

    }).catch(next)
});


module.exports = router;