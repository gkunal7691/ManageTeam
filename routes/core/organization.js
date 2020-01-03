const express = require('express');
const router = express.Router();

const Organization = require('../../models').Organization;
var crypto = require('crypto');

/* Get user by ID or users list. */

router.get('/:url', async function(req, res, next) {
     Organization.findOne({ where: {customUrl: req.params.url.toLowerCase()}, raw: false}).then((org) => {
        res.json({success: true, data: org.dataValues});
    }).catch(next)
});


module.exports = router;
