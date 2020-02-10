const router = require('express').Router();
const jwt = require('jsonwebtoken');
var passport = require('passport');
const User = require('../../models').User;
const config = require('../../config/config');
const nodemailer = require("nodemailer");

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
    let url = 'href="https://' + req.headers.host + '/login/resetpassword/';

    query.where = { email: req.params.email, organizationId: req.params.orgId };

    User.findOne(query).then((users) => {
        let token = jwt.sign({
            data: users
        }, config.jwt.secret, { expiresIn: 60 * 60 });
        let link = url + token;
        let transporter = nodemailer.createTransport({
            host: "mail.softobotics.com",
            port: 465,
            secure: true,
            auth: {
                user: 'notification@softobotics.com',
                pass: 'notification@123'
            }
        });
        var mailOptions = {
            from: 'notification@softobotics.com',
            to: users.email,
            subject: 'TMS- Reset You Password',
            html: '<p><b>Dear ' + users.firstName + ' ' + users.lastName + '</b></p><br><p>You recently requested to reset your password from the TMS App. Click the link below to complete the process.<p><br/><button style="background-color: #EF7745;border-radius: 6px;color: white;text-decoration: none;display: inline-block;font-size: 14px;padding: 15px 32px;border: none;"><a style="text-decoration: none;color:#fff" '
                + link + '">Reset Your Password</a></button><p style="font-family: Arial, sans-serif; font-size: 14px; color: #232740">Sincerely, <br>Team TMS</p>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ success: false, data: error });

            } else {
                console.log('Email sent: ' + info);
                res.json({ success: true, data: info });

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
