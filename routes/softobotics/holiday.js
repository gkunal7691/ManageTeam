const express = require('express');
const router = express.Router();
const Holiday = require('../../models').Holiday;


router.post('/', function (req, res, next) {
    Holiday.create({
        holidayDate: req.body.holidayDate, holidayType: req.body.holidayType, occasion: req.body.occasion,
        createdBy: req.user.id, organizationId: req.user.orgId
    })
        .then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
})

router.put('/', function (req, res, next) {
    Holiday.update({ holidayDate: req.body.holidayDate, holidayType: req.body.holidayType, occasion: req.body.occasion, updatedBy: req.user.id }, { where: { holidayId: req.body.holidayId, organizationId: req.user.orgId } })
        .then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
})

router.get('/', function (req, res, next) {
    Holiday.findAll({ where: { organizationId: req.user.orgId }, order: [['updatedAt', 'DESC']], }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)

})

router.put('/delete', function (req, res, next) {
    Holiday.destroy({ where: { holidayId: req.body.holidayId, organizationId: req.user.orgId } }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next);
})

module.exports = router;