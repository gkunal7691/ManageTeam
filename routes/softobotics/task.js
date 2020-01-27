const express = require('express');
const router = express.Router();
const Task = require('../../models').Task;
const Comment = require('../../models').Comment;
const User = require('../../models').User;

var currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
var convertedDate = new Date(currentDate);
var compareConvertedDate = convertedDate.getDate();

router.post('/', async function (req, res, next) {
  req.body.createdById = req.user.id;
  var dueDate = new Date(req.body.dueDate)
  // var compareDueDate = dueDate.getDate();
  // console.log(compareDueDate, compareConvertedDate, compareDueDate < compareConvertedDate);
  // if (compareDueDate < compareConvertedDate || req.body.estimatedTime > 480) {
  //   res.json({ success: false, data: "Error Cant Add" });
  // }
  // else {
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
    organizationId: req.user.orgId, userId: req.body.assignee,
  })
    .then((data) => {
      res.json({ success: true, data: data });
    }).catch(next);
  //}
})


router.post('/getTask/dueDate', async function (req, res, next) {
  Task.findAll({
    where: {
      dueDate: {
        $between: [req.body.firstDay, req.body.lastDay]
      }, organizationId: req.user.orgId, userId: req.body.userId
    },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
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

router.post('/get-day-task/:userId', async function (req, res, next) {
  console.log("body", req.body.dueDate)
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

router.post('/get-selected-date-task/:userId', async function (req, res, next) {
  console.log("test", req.body.dueDate)
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
      }
    ],
    order: [
      ['order', 'ASC'],
    ],
  })
    .then((data) => {
      let totalEstimatedTime = 0;
      data.forEach(task => {
        totalEstimatedTime += task.estimatedTime;
      })
      console.log(totalEstimatedTime)
      res.json({ success: true, data: totalEstimatedTime })
    }).catch(next)
})

//To fetch the task according to the user

router.post('/getTask/dueDate/admin', async function (req, res, next) {
  Task.findAll({
    where: {
      dueDate: {
        $between: [req.body.firstDay, req.body.lastDay]
      }, organizationId: req.user.orgId, userId: req.body.userId
    },
    include: [
      {
        model: Comment, include: [
          { model: User, as: 'createdBy', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'] },
        ],
        order: [
          ['createdAt', 'desc']
        ]
      }
    ]
  })
    .then((data) => {
      res.json({ success: true, data: data })
    }).catch(next)
})

router.get('/backlog/getTask', async function (req, res, next) {
  let firstDay = '0000-00-00';
  let lastDay = '1970-01-01';
  Task.findAll({
    where: {
      dueDate: {
        $between: [firstDay, lastDay]
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
        model: User, as: 'user'
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
  req.body.updatedById = req.user.id;
  var dueDate = new Date(req.body.dueDate)
  Task.update({
    title: req.body.title, description: req.body.description, dueDate: dueDate, priority: req.body.priority,
    status: req.body.status, estimatedTime: req.body.estimatedTime, originalTime: req.body.originalTime, clientTime: req.body.clientTime, updatedBy: req.user.id,
    userId: req.body.assignee, isCloned: req.body.clonned
  }, { where: { taskId: req.body.taskId } })
    .then((data) => {
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
