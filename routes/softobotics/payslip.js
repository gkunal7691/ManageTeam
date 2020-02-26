const express = require('express');
const router = express.Router();
var passport = require('passport');
const payslip = require('../../models').Payslip;
const User = require('../../models').User;

// To add more info about user.

router.post('/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.user.roleId == 3) {
        payslip.create({
            basic: req.body.basic, house_rent_allowance: req.body.house_rent_allowance, special_allowance: req.body.special_allowance,
            hot_skill_bonus: req.body.hot_skill_bonus, provident_fund: req.body.provident_fund, professional_tax: req.body.professional_tax,
            income_tax: req.body.income_tax, month: req.body.month, year: req.body.year, lop_days: req.body.lop_days, std_days: req.body.std_days,
            worked_days: req.body.worked_days, userId: req.params.userId, organizationId: req.user.orgId
        }).then((result) => {
            res.json({ success: true, data: result })
        }).catch(next);
    }
    else {
        let comment = 'Access Denied'
        res.json({ success: true, data: comment })
    }
});

// To get all payslip for superadmin.

router.get('/:year/:month/:userId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.user.roleId == 3) {
        payslip.findAll({
            where: { year: req.params.year, month: req.params.month, userId: req.params.userId, organizationId: req.user.orgId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }).then((data) => {
            res.json({ success: true, data: data })
        }).catch(next);
    }
    else {
        let comment = 'Access Denied';
        res.json({ success: true, data: comment })
    }
});

// To get all payslip for client.

router.get('/client/:year/:month', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    payslip.findAll({
        where: { year: req.params.year, month: req.params.month, userId: req.user.id, organizationId: req.user.orgId },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((data) => {
        res.json({ success: true, data: data })
    }).catch(next);
});

// To update a selected payslip for superadmin.

router.put('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.user.roleId == 3) {
        payslip.update({
            basic: req.body.basic, house_rent_allowance: req.body.house_rent_allowance, special_allowance: req.body.special_allowance,
            hot_skill_bonus: req.body.hot_skill_bonus, provident_fund: req.body.provident_fund, professional_tax: req.body.professional_tax,
            income_tax: req.body.income_tax, month: req.body.month, year: req.body.year, lop_days: req.body.lop_days, std_days: req.body.std_days,
            worked_days: req.body.worked_days
        }, { where: { payslip_Id: req.body.payslipId, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data })
        }).catch(next);
    }
    else {
        let comment = 'Access Denied'
        res.json({ success: true, data: comment })
    }
});

// To delete a selected payslip for superadmin.

router.delete('/:payslipId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    if (req.user.roleId == 3) {
        payslip.destroy({
            where: { payslip_Id: req.params.payslipId, organizationId: req.user.orgId },
        }).then((data) => {
            res.json({ success: true, data: data })
        }).catch(next);
    }
    else {
        let comment = 'Access Denied'
        res.json({ success: true, data: comment })
    }
});

module.exports = router;