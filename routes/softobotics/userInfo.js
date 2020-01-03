const express = require('express');
const router = express.Router();
var passport = require('passport');
const userInfo = require('../../models').UserInfo;

// to add more info about user

router.post('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  userInfo.create({
    designation: req.body.designation, secondaryEmail: req.body.secondaryEmail, tempAddress: req.body.tempAddress,
    permanentAddress: req.body.permanentAddress, mobile: req.body.mobile, userId: req.body.userId
  }).then((result) => {
    res.json({ success: true, data: result })
  }).catch(next);
});

router.get('/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  userInfo.findOne({
    where: { userId: req.params.userId },
  }).then((data) => {
    res.json({ success: true, data: data });
  }).catch(next)
});

module.exports = router;