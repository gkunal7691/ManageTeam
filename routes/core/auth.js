const router = require('express').Router();
const jwt = require('jsonwebtoken');
var passport = require('passport');
const User = require('../../models').User;
const config = require('../../config/config');

const request = require('request');
const uuidv1 = require('uuid/v1');

const passwordResetDetails = {
    apiUrl: 'https://api.postageapp.com/v.1.0/send_message.json',
    api_key: "kn0hVBIvzooPXynHSPjZtR9agqYJL4XD",
    emailTemplate: "Security-PasswordReset",
};

router.get('/check-token', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send({ success: true, user: req.user });
});

router.get('/:id?', async function (req, res, next) {
    const query = {};
    if (req.query && req.query.email) {
        query.where = query.where || {};
        query.where.email = req.query.email;
        query.where.organizationId = parseInt(req.query.orgId);
    }
    User.findAndCountAll(query).then((users) => {
        if (users.count == 0) {
            return res.json({ emailTaken: false });
        }
        return res.json({ emailTaken: true });
    }).catch(next)
});

/* Login user. */
router.post('/', function (req, res, next) {

    if (!req.body.email)
        return next(new Error('missing_email'));
    if (!req.body.password)
        return next(new Error('missing_password'));

    User.findOne({ where: { email: req.body.email.toLowerCase(), organizationId: req.body.organizationId }, raw: false }).then((user) => {
        if (!user)
            return next(new Error('invalid_email'));
        if (!user.isValidPassword(req.body.password))
            return next(new Error('invalid_password'));
        let expiresIn = req.body.rememberMe ? '15d' : '1d';
        let token = jwt.sign({
            id: user.id,
            email: user.email.toLowerCase(),
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: user.roleId,
            orgId: user.organizationId
        }, config.jwt.secret, { expiresIn: expiresIn, algorithm: config.jwt.algorithm });

        res.json({
            success: true,
            data: {
                token: token
            }
        });

        User.update({ lastLogin: new Date() }, { where: { id: user.id } });
    }).catch(next)
});

// Password Reset mail
router.delete('/:email/:orgId', async function (req, res, next) {

    const query = {};
    let url = req.headers.origin + "/resetpassword/";

    query.where = { email: req.params.email, organizationId: req.params.orgId };

    User.findOne(query).then((users) => {


        let token = jwt.sign({
            data: users
        }, config.jwt.secret, { expiresIn: 60 * 60 });

        let uuid = uuidv1();

        request.post({
            headers: { 'content-type': 'application/json' },
            url: `${passwordResetDetails.apiUrl}`,
            json: {
                "api_key": `${passwordResetDetails.api_key}`,
                "uid": `${uuid}`,
                "arguments": {
                    "recipients": [`${users.dataValues.email}`],
                    "headers": {
                        "subject": "HDGFND: Password Reset Request"
                    },
                    "template": `${passwordResetDetails.emailTemplate}`,
                    "variables": {
                        "name": `${users.dataValues.fullName}`,
                        "resetlink": `${url}` + `${token}`
                    }

                }
            }
        }, function (error, response) {
            if (response.body.data.message.status == 'queued') {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        });

    }).catch(next)

});

//reset password
router.patch('/', function (req, res, next) {

    var decoded = jwt.verify(req.body.token, config.jwt.secret);

    let newData = {};
    let query = {};


    if (req.body.password && req.body.password.length)
        newData.password = User.generateHash(req.body.password);

    if (newData.errors)
        return next(newData.errors[0]);

    query.where = { id: decoded.data.id, roleId: decoded.data.roleId };

    User.update(newData, query).then(() => {

        res.json({ success: true });
    }).catch(next)
});

module.exports = router;
