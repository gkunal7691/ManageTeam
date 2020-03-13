const express = require('express');
const router = express.Router();
const utils = require('../../config/utils');
var passport = require('passport');
const User = require('../../models').User;
const UserMeta = require('../../models').UserMeta;
const userInfo = require('../../models').UserInfo;

/* Get user by ID or users list. */

router.get('/:id?', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const query = {};
    if (req.query && req.query.email) {
        query.where = query.where || {};
        query.where.email = req.query.email;
    }

    User.findAndCountAll(query).then((users) => {
        res.json({ success: true, data: users.rows, count: users.count });
    }).catch(next)
});

/* Add new user. */

router.post('/', function (req, res, next) {
    if (!req.body.email)
        return next(new Error('missing_email'));
    if (!req.body.password)
        return next(new Error('missing_password'));

    let newData = {
        // createdBy: req.locals.user.id,
        password: User.generateHash(req.body.password),
        UserSentimentIndexs: req.body.UserSentimentIndex,
        Accounts: req.body.Accounts,
    };

    utils.validateQuery(req.body, newData, 'email');
    utils.validateQuery(req.body, newData, 'role');
    utils.validateQuery(req.body, newData, 'status');
    utils.validateQuery(req.body, newData, 'firstName');
    utils.validateQuery(req.body, newData, 'lastName');
    utils.validateQuery(req.body, newData, 'organizationId');

    if (newData.errors)
        return next(newData.errors[0]);
    if (!req.body.roleId)
        newData.roleId = 1;

    User.create(newData).then((user) => {
        User.update({ createdBy: user.id }, { where: { id: user.id } }).then(() => {
            res.json({ success: true, data: user })
        }).catch(next);
    }).catch(next);
});

// Reset password

router.put('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    let newData = {};
    let query = {};
    if (req.body.password && req.body.password.length)
        newData.password = User.generateHash(req.body.password);
    if (newData.errors)
        return next(newData.errors[0]);
    query.where = { id: req.user.id };

    User.update(newData, query).then(() => {
        res.json({ success: true });
    }).catch(next)
});

/* Delete user by ID. */

router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.destroy({
        where: { id: req.params.id },
    }).then(() => {
        res.json({ success: true });
    }).catch(next)
});

/* count user */

router.post('/countuser', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.count({
        where: { organizationId: req.body.organizationId }
    }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)
});

// Admin List

router.get('/admin/allAdminList', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findAll({
        where: { organizationId: req.user.orgId, roleId: 2 }, order: [['updatedAt', 'DESC']],
    }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)
});

// User List

router.get('/superAdmin/userList', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.findAll({
        where: { organizationId: req.user.orgId }, order: [['updatedAt', 'DESC']],
        include: [
            { model: userInfo }
        ]
    }).then((data) => {
        res.json({ success: true, data: data });
    }).catch(next)
});

router.post('/superAdmin/createUser', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.create({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: User.generateHash(req.body.password), roleId: req.body.roleId, createdBy: req.body.createdBy, organizationId: req.body.organizationId }).then((result) => {
        res.json({ success: true, data: result })
    }).catch(next);
});

router.post('/createUserMetaList', async function (req, res, next) {
    var userMetaList = req.body.metaList;
    var userMetaCount = 0
    userMetaList.forEach((userMeta, userMetaIndex, userMetaArray) => {
        UserMeta.create({ metaKey: userMeta.metaKey, metaValue: userMeta.metaValue, userId: req.body.userId, createdBy: req.body.userId }).then((result) => {
            if (userMetaCount === userMetaArray.length - 1) {
                res.json({ success: true, data: result })
            }
            userMetaCount++
        }).catch(next);
    })
});

/* Update Client with U */

router.post('/updateUser', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.update({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email },
        { where: { id: req.body.clientId } }).then((data) => {
            res.json({ success: true, data: data })
        }).catch(next)
})

//To update a selected user.

router.put('/superAdmin/updateUser', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    User.update({
        firstName: req.body.firstName, lastName: req.body.lastName,
        email: req.body.email, roleId: req.body.roleId
    }, {
        where: { id: req.body.id, organizationId: req.user.orgId }
    }).then(() => {
        userInfo.update({
            designation: req.body.desg, secondaryEmail: req.body.secEmail,
            tempAddress: req.body.tempAddress, permanentAddress: req.body.permanentAddress,
            mobile: req.body.mobile, bank: req.body.bank, doj: req.body.doj,
            bankAccountNo: req.body.bankAccountNo, pfNumber: req.body.pfNumber,
            location: req.body.location, department: req.body.dept
        }, {
            where: { userId: req.body.id }
        }
        ).then((result) => {
            res.json({ success: true, data: result });
        })
    }).catch(next);
})

module.exports = router;