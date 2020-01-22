
const express = require('express');
const router = express.Router();
var passport = require('passport');
const User = require('../../models').User;

// Employee List

router.get('/employee', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findAll({
        where: { organizationId: req.user.orgId, roleId: 1 }, order: [['updatedAt', 'DESC']],
    }).then((employeelist) => {
        res.json({ success: true, data: employeelist });
    }).catch(next)
});

router.get('/singleUser/:userId', function (req, res, next) {
    User.findOne({
        where: { id: req.params.userId }
    }).then((userdata) => {
        res.json({ success: true, data: userdata });
    }).catch(next)
});

module.exports = router;