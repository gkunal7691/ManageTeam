const express = require('express');
const router = express.Router();
const dayOff = require('../../models').DayOff;
const weekday = require('../../models').WeekDay;


router.post('/', function (req, res, next) {
    var weekdayIds = req.body.weekdayId;
    var dayCount = 0;
    weekdayIds.forEach((day, dayIndex, dayArray) => {
        dayOff.create({ weekdayId: day, createdBy: req.user.id, organizationId: req.user.orgId })
            .then((result) => {
                if (dayCount === dayArray.length - 1) {
                    res.json({ success: true, data: result })
                }
                dayCount++;

            }).catch(next);
    })
})


router.put('/', function (req, res, next) {
    dayOff.update({ weekdayOff: req.body.weekdayOff })
    dayOff.findAll({ where: { organizationId: req.user.orgId } }).then((day) => {
        Promise.resolve(day.setDays(data))
            .then((data) => {
                res.json({ success: true, data: data });
            }).catch(next);
    }).catch(next);

})

router.get('/', function (req, res, next) {
    dayOff.findAll({ where: { organizationId: req.user.orgId }, order: [['updatedAt', 'DESC']], }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)

})

router.put('/delete', function (req, res, next) {
    dayOff.destroy({ where: { dayoffId: req.body.dayoffId, organizationId: req.user.orgId } }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next);
})

module.exports = router;