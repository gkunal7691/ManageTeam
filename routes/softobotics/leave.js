const express = require('express');
const router = express.Router();
const Leave = require('../../models').Leave;
const sequelize = require('../../models').sequelize;
const User = require('../../models').User;
const Organization = require('../../models').Organization;
const dayOff = require('../../models').DayOff;
const Holiday = require('../../models').Holiday;
const cron = require('node-cron');


router.get('/', async function (req, res, next) {
   Leave.findAll({
      attributes: ['type', [sequelize.fn('sum', sequelize.col('noOfdays')), 'sum']],
      group: ['type'],
      where: {
         userId: req.user.id,
         $or: [
            {
               status: "approved"
            },
            {
               status: "pending"
            },
            {
               status: "added"
            }
         ]
      }
      //{ userId: req.user.id }, $or: [{status: 'approved'}, {status: 'pending'}, {status: 'added'}]
   }).then((data) => {
      let leave = {};
      data.forEach(e => {
         leave[e.dataValues.type] = e.dataValues.sum.toFixed(2);
      })
      res.json({ success: true, data: leave })
   })
})

//For admin to view remaining leave data

router.get('/:userId', async function (req, res) {
   Leave.findAll({
      attributes: ['type', [sequelize.fn('sum', sequelize.col('noOfdays')), 'sum']],
      group: ['type'],
      where: {
         userId: req.params.userId,
         $or: [
            {
               status: "approved"
            },
            {
               status: "pending"
            },
            {
               status: "added"
            }
         ]
      }
   }).then((data) => {
      let leave = {};
      data.forEach(e => {
         leave[e.dataValues.type] = e.dataValues.sum.toFixed(2);
      })
      res.json({ success: true, data: leave })
   })
})

// create leave Request

router.post('/', async function (req, res, next) {
   var totaldate = []
   let holidayDateList = []
   let fromdate = new Date(req.body.fromDate)
   let todate = new Date(req.body.toDate)

   dayOff.findAll({ where: { organizationId: req.user.orgId } }).then((dayOffList) => {
      dayOffList = dayOffList.map(x => x.weekdayId);
      for (let i = 0; i < dayOffList.length; i++) {
         if (dayOffList[i] == 0) {
            dayOffList[i] = 'sunday';
         }
         else if (dayOffList[i] == 1) {
            dayOffList[i] = 'monday';
         }
         else if (dayOffList[i] == 2) {
            dayOffList[i] = 'tuesday';
         }
         else if (dayOffList[i] == 3) {
            dayOffList[i] = 'wednesday';
         }
         else if (dayOffList[i] == 4) {
            dayOffList[i] = 'thursday';
         }
         else if (dayOffList[i] == 5) {
            dayOffList[i] = 'friday';
         }
         else if (dayOffList[i] == 6) {
            dayOffList[i] = 'saturday';
         }
      }
      Holiday.findAll({ where: { organizationId: req.user.orgId } }).then((holidayList) => {

         holidayList.forEach(x => {
            holidayDateList.push((new Date(x.holidayDate).getMonth() + 1) + '/' + new Date(x.holidayDate).getDate() + '/' + new Date(x.holidayDate).getFullYear())
         })
         for (let date = fromdate.getDate(); date <= todate.getDate(); date++) {
            let day = new Date(fromdate);
            totaldate.push(day);
            fromdate.setDate(fromdate.getDate() + 1);
         }
         totaldate.forEach(x => {

            if (x.getDay() == 0) {
               x.day = 'sunday'
            }
            if (x.getDay() == 1) {
               x.day = 'monday'
            }
            if (x.getDay() == 2) {
               x.day = 'tuesday'
            }
            if (x.getDay() == 3) {
               x.day = 'wednesday'
            }
            if (x.getDay() == 4) {
               x.day = 'thursday'
            }
            if (x.getDay() == 5) {
               x.day = 'friday'
            }
            if (x.getDay() == 6) {
               x.day = 'saturday'
            }
         })
         let totalLeaveDay = totaldate.filter(x => !dayOffList.includes(x.day) && !holidayDateList.includes((new Date(x).getMonth() + 1) + '/' + new Date(x).getDate() + '/' + new Date(x).getFullYear()));
         let noOfdays;
         if (req.body.halfday) {
            noOfdays = -0.5
         } else {
            noOfdays = -(totalLeaveDay.length)
         }
         Leave.create({
            noOfdays: noOfdays,
            type: req.body.type,
            status: req.body.status,
            reason: req.body.reason,
            toDate: req.body.toDate,
            fromDate: req.body.fromDate,
            userId: req.user.id,
            organizationId: req.user.orgId
         }).then((data) => {
            res.json({ success: true, data: data })
         }).catch(next);
      }).catch(next);
   }).catch(next);
})

// leave request list by employee

router.post('/manageleavelist', async function (req, res, next) {

   let condition = {}
   condition['userId'] = req.user.id;
   condition['organizationId'] = req.user.orgId;

   condition['$or'] = [];

   if (req.body.isapprove) {
      let x = {};
      x['status'] = "approved"
      condition['$or'].push(x);
   }
   if (req.body.ispending) {
      let x = {};
      x['status'] = "pending";
      condition['$or'].push(x);
   }
   if (req.body.iscancel) {
      let x = {};
      x['status'] = "cancelled";
      condition['$or'].push(x);
   }
   if (req.body.isadd) {
      let x = {};
      x['status'] = "added";
      condition['$or'].push(x);
   }
   if (req.body.isreject) {
      let x = {};
      x['status'] = "rejected";
      condition['$or'].push(x);
   }
   Leave.findAll({ where: condition, order: [['LeaveId', 'DESC']] }).then((data) => {
      res.json({ success: true, data: data })
   }).catch(next);
})

// leave request list by admin

router.post('/leaverequestlist', async function (req, res, next) {

   let condition = {}
   condition['organizationId'] = req.user.orgId;

   condition['$or'] = [];

   if (req.body.isapprove) {
      let x = {};
      x['status'] = "approved"
      condition['$or'].push(x);
   }
   if (req.body.ispending) {
      let x = {};
      x['status'] = "pending";
      condition['$or'].push(x);
   }
   if (req.body.iscancel) {
      let x = {};
      x['status'] = "cancelled";
      condition['$or'].push(x);
   }
   if (req.body.isadd) {
      let x = {};
      x['status'] = "added";
      condition['$or'].push(x);
   }
   if (req.body.isreject) {
      let x = {};
      x['status'] = "rejected";
      condition['$or'].push(x);
   }

   Leave.findAll({
      include: [
         {
            model: User, attributes: ['id', 'firstName', 'lastName', 'email']
         }
      ], where: condition
   }).then((data) => {
      res.json({ success: true, data: data })
   }).catch(next);
})

// request update

router.put('/', function (req, res, next) {
   if (req.user.roleId == 2) {
      Leave.update({ status: req.body.status }, { where: { leaveId: req.body.leaveId } }).then((data) => {
         res.json({ success: true, data: data });
      }).catch(next);
   }
   else {
      res.json({ success: false, data: "unauthorized" });
   }

})

router.put('/cancel', function (req, res, next) {
   Leave.update({ status: 'cancelled' }, { where: { leaveId: req.body.leaveId, userId: req.user.id } }).then((data) => {
      res.json({ success: true, data: data });
   }).catch(next);
})



cron.schedule('0 0 1 * *', () => {
   Organization.findAll().then(orgList => {
      // console.log(orgList)
      orgList.forEach(org => {
         User.findAll({ where: { roleId: 1, organizationId: org.dataValues.organizationId } }).then(userList => {

            userList.forEach(user => {
               // console.log(JSON.stringify(user));
               Leave.create({
                  noOfdays: 1.25,
                  type: 'earned',
                  status: 'added',
                  reason: 'earned leaves',
                  userId: user.dataValues.id,
                  organizationId: org.dataValues.organizationId
               }).then((data) => {
                  //console.log(data);
               }).catch();

               Leave.create({
                  noOfdays: 1,
                  type: 'wfh',
                  status: 'added',
                  reason: 'WFH added',
                  userId: user.dataValues.id,
                  organizationId: org.dataValues.organizationId
               }).then((data) => {
                  //console.log(data);
               }).catch();
            })
         })

      });
   })
});


module.exports = router;