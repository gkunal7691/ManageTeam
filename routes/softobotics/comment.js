const express = require('express');
const router = express.Router();
const mail = require('../core/mail');

const Comment = require('../../models').Comment;

router.post('/', async function (req, res, next) {
    Comment.create({ comment: req.body.comment, taskId: req.body.taskId, createdById: req.user.id }).then((comment) => {
        mail.taskMailer(req.user, req.body.action, req.body.taskId);
        res.json({ success: true, data: comment })
    }).catch(next)
})

module.exports = router;