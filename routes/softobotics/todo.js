const express = require('express');
const router = express.Router();
const Todo = require('../../models').Todo;


router.post('/', function (req, res, next) {
    Todo.create({
        title: req.body.title, description: req.body.description, complete: req.body.complete,
        userId: req.user.id, organizationId: req.user.orgId, star: false
    }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next);
})

router.put('/', function (req, res, next) {
    if (req.body.userId == undefined) {
        Todo.update({ title: req.body.title, description: req.body.description, updatedBy: req.user.id }, { where: { todoId: req.body.todoId, userId: req.user.id, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    } else {
        Todo.update({ title: req.body.title, description: req.body.description, updatedBy: req.user.id }, { where: { todoId: req.body.todoId, userId: req.body.userId, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    }
})

// incomplete

router.post('/incompletetodo', function (req, res, next) {

    if (req.body.userId == undefined) {

        Todo.findAll({ where: { userId: req.user.id, organizationId: req.user.orgId,complete:false }, order: [['star', 'DESC']], }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next)

    } else {
        Todo.findAll({ where: { userId: req.body.userId, organizationId: req.user.orgId,complete:false }, order: [['star', 'DESC']], }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next)
    }
})

// complete

router.post('/completetodolist', function (req, res, next) {

    if (req.body.userId == undefined) {

        Todo.findAndCountAll({ where: { userId: req.user.id, organizationId: req.user.orgId,complete:true },limit:10, order: [['star', 'DESC']], }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next)

    } else {
        Todo.findAndCountAll({ where: { userId: req.body.userId, organizationId: req.user.orgId,complete:true},limit:10, order: [['star', 'DESC']], }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next)
   }
})

// all complete

router.post('/allcompletetodolist', function (req, res, next) {
    
        Todo.findAndCountAll({ where: { userId: req.body.userId, organizationId: req.user.orgId,complete:true}, order: [['star', 'DESC']], }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next)

})

router.put('/complete', function (req, res, next) {
    if (req.body.userId == undefined) {
        Todo.update({ updatedBy: req.user.id,complete: req.body.complete, updatedBy: req.user.id }, { where: { todoId: req.body.todoId, userId: req.user.id, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    } else {
        Todo.update({ updatedBy: req.user.id,complete: req.body.complete, updatedBy: req.user.id }, { where: { todoId: req.body.todoId, userId: req.body.userId, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    }
})


router.put('/delete', function (req, res, next) {
    Todo.destroy({ where: { todoId: req.body.todoId, userId: req.user.id, organizationId: req.user.orgId } }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next);
})

router.put('/star', function (req, res, next) {
    if (req.body.userId == undefined) {
        Todo.update({ updatedBy: req.user.id, star: req.body.star }, { where: { todoId: req.body.todoId, userId: req.user.id, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    } else {
        Todo.update({ updatedBy:req.user.id, star: req.body.star }, { where: { todoId: req.body.todoId, userId: req.body.userId, organizationId: req.user.orgId } }).then((data) => {
            res.json({ success: true, data: data });
        }).catch(next);
    }
})

module.exports = router;