const express = require('express');
const router = express.Router();
const task = require('../../models').Task;
const Comment = require('../../models').Comment;
const User = require('../../models').User;
var currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
var convertedDate = new Date(currentDate);
var compareConvertedDate = convertedDate.getDate();

router.post('/', async function (req, res, next) {
  console.log(res.data)
  req.body.createdById = req.user.id;
  var dueDate = new Date(req.body.dueDate)
  var compareDueDate = dueDate.getDate();
  if (compareDueDate < compareConvertedDate || req.body.estimatedTime > 480) {
    res.json({ success: true, data: "Error Cant Add" });
  }
  else {
    const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
    if (env === 'local') {
      dueDate.setHours(dueDate.getHours() + 5, 30)
    }
    else {
      dueDate.setHours(dueDate.getHours() + 6, 00)
    }
    task.create({
      title: req.body.title, description: req.body.description, dueDate: dueDate, priority: req.body.priority,
      status: req.body.status, estimatedTime: req.body.estimatedTime, originalTime: req.body.originalTime, clientTime: req.body.clientTime, createdBy: req.user.id,
      organizationId: req.user.orgId, userId: req.body.assignee,
    })
      .then((data) => {
        res.json({ success: true, data: data });
      }).catch(next);
  }
})


router.post('/getTask/dueDate', async function (req, res, next) {
  task.findAll({
    where: {
      dueDate: {
        $between: [req.body.firstDay, req.body.lastDay]
      }, organizationId: req.user.orgId, userId: req.user.id
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

router.post('/getSingleTask', async function (req, res, next) {
  let newDueDate = new Date(req.body.dueDate);
  newDueDate.setHours(newDueDate.getHours() + 5, 30);

  task.findAll({
    where: { dueDate: newDueDate, organizationId: req.user.orgId, userId: req.user.id },
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

//To fetch the task according to the user

router.post('/getTask/dueDate/admin', async function (req, res, next) {
  task.findAll({
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


router.put('/', function (req, res, next) {
  req.body.updatedById = req.user.id;
  var dueDate = new Date(req.body.dueDate)
  var compareDueDate = dueDate.getDate()
  if (compareDueDate < compareConvertedDate) {
    res.json({ success: true, data: "Error Cant Edit" });
  }
  else {
    task.update({
      title: req.body.title, description: req.body.description, dueDate: req.body.dueDate, priority: req.body.priority,
      status: req.body.status, estimatedTime: req.body.estimatedTime, originalTime: req.body.originalTime, clientTime: req.body.clientTime, updatedBy: req.user.id,
      userId: req.body.assignee, clonned: req.body.clonned
    }, { where: { taskId: req.body.taskId } })
      .then((data) => {
        res.json({ success: true, data: data });
      }).catch(next);
  }
})


router.delete('/:taskId', function (req, res, next) {
  var dueDate = new Date(req.body.dueDate)
  var compareDueDate = dueDate.getDate()
  if (compareDueDate < compareConvertedDate) {
    res.json({ success: true, data: "Error Cant Delete" });
  }
  else {
    task.destroy({ where: { taskId: req.params.taskId } }).then((data) => {
      res.json({ success: true, data: data })
    }).catch(next);
  }
})

module.exports = router;
