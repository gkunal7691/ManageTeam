const express = require('express');
const router = express.Router();
const Task = require('../../models').Task;
const Comment = require('../../models').Comment;
const User = require('../../models').User;
const Holiday = require('../../models').Holiday;
const mail = require('../core/mail');
const Leave = require('../../models').Leave;

var currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
var convertedDate = new Date(currentDate);
var compareConvertedDate = convertedDate.getDate();

router.post('/', async function (req, res, next) {
  var dueDate = new Date(req.body.dueDate)
  const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
  if (env === 'local') {
    dueDate.setHours(dueDate.getHours() + 5, 30)
  }
  else {
    dueDate.setHours(dueDate.getHours() + 6, 00)
  }
  Task.create({
    title: req.body.title, description: req.body.description, dueDate: dueDate, priority: req.body.priority,
    status: req.body.status, estimatedTime: req.body.estimatedTime, originalTime: req.body.originalTime, clientTime: req.body.clientTime, createdBy: req.user.id,
    organizationId: req.user.orgId, userId: req.body.assignee, createdById: req.user.id, isDoubt: req.body.isDoubt
  })
    .then((data) => {
      mail.taskMailer(req, req.body.action, data.taskId)
      res.json({ success: true, data: data });
    }).catch(next);
})

router.get('/month-view/:dueDate/:userId', async function (req, res, next) {
  var dueDate = new Date(req.params.dueDate);
  var firstDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), 1);
  var firstDay = firstDate.getFullYear() + '-' + (firstDate.getMonth() + 1) + '-' + firstDate.getDate();
  var lastDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0);
  var lastDay = lastDate.getFullYear() + '-' + (lastDate.getMonth() + 1) + '-' + lastDate.getDate();
  var monthArray = [];
  var resultArray = [];
  firstDate.setDate(firstDate.getDate() + 1);
  lastDate.setDate(lastDate.getDate() + 1);
  while (firstDate <= lastDate) {
    var day = new Date(new Date(firstDate).setUTCHours(0, 0, 0, 0));
    var convertedDay = day.toISOString();
    monthArray.push(convertedDay);
    firstDate.setDate(firstDate.getDate() + 1);
  }
  Task.findAll({
    where: {
      dueDate: {
        $between: [firstDay, lastDay]
      }, organizationId: req.user.orgId, userId: req.params.userId
    },
  })
    .then((data) => {
      Holiday.findAll({
        where: {
          holidayDate: {
            $between: [firstDay, lastDay]
          },
          organizationId: req.user.orgId,
        }
      }).then((holiday) => {
        Leave.findAll({
          where: {
            fromDate: {
              $between: [firstDay, lastDay]
            }, toDate: {
              $between: [firstDay, lastDay]
            }, status: {
              $or: [
                { $eq: 'pending' },
                { $eq: 'approved' }
              ]
            }, organizationId: req.user.orgId, userId: req.params.userId
          }
        }).then((leave) => {
          monthArray.forEach(monthDate => {
            let dayObject = {};
            let dayTasks = data.filter(task =>
              new Date(task.dueDate).getTime() == new Date(monthDate).getTime()
            )
            let isHoliday = holiday.find(date =>
              new Date(date.holidayDate).getTime() == new Date(monthDate).getTime()
            )
            if (isHoliday == undefined) {
              isHoliday = null;
            }
            let isLeave;
            let leaveStatus;
            leave.forEach(leaveData => {
              let isFromDate = new Date(new Date(leaveData.fromDate).setUTCHours(0, 0, 0, 0));
              let isToDate = new Date(new Date(leaveData.toDate).setUTCHours(0, 0, 0, 0));
              isFromDate.setDate(isFromDate.getDate() + 1);
              isToDate.setDate(isToDate.getDate() + 1);
              let leaveFrom = isFromDate.toISOString();
              let leaveTo = isToDate.toISOString();
              if (new Date(monthDate).getTime() >= new Date(leaveFrom).getTime() && new Date(monthDate).getTime() <= new Date(leaveTo).getTime()) {
                isLeave = true;
                leaveStatus = leaveData.status;
              }
            })
            dayObject['totalEstimatedTime'] = 0;
            dayObject['totalClientTime'] = 0;
            dayObject['totalOrginalTime'] = 0;
            dayTasks.forEach(task => {
              dayObject['totalEstimatedTime'] += task.dataValues.estimatedTime;
              dayObject['totalClientTime'] += task.dataValues.clientTime;
              dayObject['totalOrginalTime'] += task.dataValues.originalTime;
            })
            dayObject['holiday'] = isHoliday;
            dayObject['leave'] = isLeave;
            dayObject['leaveStatus'] = leaveStatus;
            dayObject['totalPlannedTasks'] = dayTasks.filter(task => task.status === 'planned').length;
            dayObject['totalInProgressTasks'] = dayTasks.filter(task => task.status === 'progress').length;
            dayObject['totalCompletedTasks'] = dayTasks.filter(task => task.status === 'completed').length;
            dayObject['totalTasks'] = dayTasks.length;
            dayObject['taskDate'] = new Date(monthDate)
            resultArray.push(dayObject)
          })
          res.json({ success: true, data: resultArray });
        }).catch(next);
      }).catch(next);
    }).catch(next);
});

router.post('/get-day-task/:userId', async function (req, res, next) {
  let dueDate = new Date(req.body.dueDate);
  const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
  if (env === 'local') {
    dueDate.setHours(dueDate.getHours() + 5, 30)
  }
  Task.findAll({
    where: { dueDate: dueDate, organizationId: req.user.orgId, userId: parseInt(req.params.userId) },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      },
      {
        model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((data) => {
      res.json({ success: true, data: data })
    }).catch(next)
})

router.post('/get-selected-date-estimate/:userId', async function (req, res, next) {
  let dueDate = new Date(req.body.dueDate);
  const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
  if (env === 'local') {
    dueDate.setHours(dueDate.getHours() + 5, 30)
  }
  Task.findAll({
    where: { dueDate: dueDate, organizationId: req.user.orgId, userId: parseInt(req.params.userId) },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      },
      {
        model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((time) => {
      let x = {}
      let totalEstimatedTime = 0;
      time.forEach(task => {
        totalEstimatedTime += task.estimatedTime;
      })
      x['totalEstimatedTime'] = totalEstimatedTime;
      Holiday.findOne({ where: { organizationId: req.user.orgId, holidayDate: dueDate }, order: [['updatedAt', 'DESC']], }).then((holiday) => {
        x['isHoliday'] = holiday;
        res.json({ success: true, data: x });
      }).catch(next)
    }).catch(next)

})

router.post('/backlog/getTask', async function (req, res, next) {
  Task.findAll({
    where: {
      dueDate: {
        $between: [req.body.firstDay, req.body.lastDay]
      }, organizationId: req.user.orgId
    },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      },
      {
        model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((data) => {
      res.json({ success: true, data: data })
    }).catch(next)
})

router.post('/upcoming-task', async function (req, res, next) {
  Task.findAll({
    where: {
      dueDate: {
        $gte: req.body.dueDate
      }, organizationId: req.user.orgId
    },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      },
      {
        model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((data) => {
      res.json({ success: true, data: data })
    }).catch(next)
})

router.get('/:taskId', async function (req, res, next) {
  Task.findOne({
    where: {
      taskId: req.params.taskId, organizationId: req.user.orgId
    },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      },
      {
        model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      },
      {
        model: User, as: 'updatedBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((data) => {
      res.json({ success: true, data: data })
    }).catch(next)
})

router.put('/', function (req, res, next) {
  var dueDate = new Date(req.body.dueDate)
  Task.update({
    title: req.body.title, description: req.body.description, dueDate: dueDate, priority: req.body.priority,
    status: req.body.status, estimatedTime: req.body.estimatedTime, originalTime: req.body.originalTime, clientTime: req.body.clientTime, updatedBy: req.user.id,
    userId: req.body.assignee, isCloned: req.body.clonned, updatedById: req.user.id, isDoubt: req.body.isDoubt
  }, { where: { taskId: req.body.taskId } })
    .then((data) => {
      mail.taskMailer(req, req.body.action, req.body.taskId);
      res.json({ success: true, data: data });
    }).catch(next);
})

router.put('/edit/reOrder', function (req, res, next) {
  let order = 1;
  let count = 0;
  req.body.forEach((task, index, array) => {
    Task.update({
      order: order
    }, { where: { taskId: task.taskId, organizationId: req.user.orgId } }).then(() => {
      if (count == array.length - 1) {
        res.json({ success: true });
      }
      count++;
    }).catch(next)
    order++;
  })
});



router.delete('/:taskId', function (req, res, next) {
  var dueDate = new Date(req.body.dueDate)
  var compareDueDate = dueDate.getDate()
  if (compareDueDate < compareConvertedDate) {
    res.json({ success: true, data: "Error Cant Delete" });
  }
  else {
    Task.destroy({ where: { taskId: req.params.taskId } }).then((data) => {
      res.json({ success: true, data: data })
    }).catch(next);
  }
})

module.exports = router;
