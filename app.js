const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
var passport = require('passport');

/* CORE */

const authRouter = require('./routes/core/auth');
const usersRouter = require('./routes/core/users');
const orgMetaRouter = require('./routes/core/orgMeta');
const organizationRouter = require('./routes/core/organization');
const userMetaRouter = require('./routes/core/userMeta');
// const mailRouter = require('./routes/core/mail');


/* softobotics */

const userRouter = require('./routes/softobotics/user');
const taskRouter = require('./routes/softobotics/task');
const commentRouter = require('./routes/softobotics/comment');
const Leave = require('./routes/softobotics/leave');
const Holiday = require('./routes/softobotics/holiday');
const Dayoff = require('./routes/softobotics/dayoff');
const Weekday = require('./routes/softobotics/weekday');
const todoRouter = require('./routes/softobotics/todo');
const UserInfoRouter = require('./routes/softobotics/userInfo');
const PayslipRouter = require('./routes/softobotics/payslip');

const env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';

const app = express();

const originsWhitelist = [
    ''
];

originsWhitelist.push('http://localhost:4200');
originsWhitelist.push('http://localhost:8000');
originsWhitelist.push('https://employee.softobotics.com');
originsWhitelist.push('https://employee.cloudprism.in');
originsWhitelist.push('https://softobotics.herokuapp.com');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/login', express.static('dist'));
app.use('/login/registration', express.static('dist'));
app.use('/login/forgotpassword', express.static('dist'));
app.use('/login/resetpassword/:id', express.static('dist'));

app.use('/employee/edashboard', express.static('dist'));
app.use('/employee/eprofile', express.static('dist'));
app.use('/employee/month-view', express.static('dist'));
app.use('/employee/manage-leave', express.static('dist'));
app.use('/employee/backlog', express.static('dist'));
app.use('/employee/task/:id', express.static('dist'));
app.use('/employee/todo', express.static('dist'));
app.use('/employee/todo/:id', express.static('dist'));
app.use('/employee/todo/completed/:id', express.static('dist'));
app.use('/employee/payslip', express.static('dist'));

app.use('/admin/adashboard', express.static('dist'));
app.use('/admin/aprofile', express.static('dist'));
app.use('/admin/leave-request', express.static('dist'));
app.use('/admin/admin-employee', express.static('dist'));
app.use('/admin/manage-time', express.static('dist'));
app.use('/admin/backlog', express.static('dist'));


app.use('/systemadmin/sadashboard', express.static('dist'));
app.use('/systemadmin/admin', express.static('dist'));
app.use('/systemadmin/notification', express.static('dist'));
app.use('/systemadmin/holiday', express.static('dist'));
app.use('/systemadmin/dayoff', express.static('dist'));
app.use('/systemadmin/ManagePayslip/:id', express.static('dist'));
app.use('/systemadmin/downloadPdf', express.static('dist'));

app.use(express.static('dist'));
app.use(cookieParser());

//Enabling CORS

app.use(cors({
    origin: (origin, callback) => {
        const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
}));

app.use(passport.initialize());
require('./config/passport')(passport);

//Public routes
app.use('/api/auth', authRouter);

//Private routes.
// app.use(authMiddleware.verifyToken);

/* CORE */

app.use('/api/users', /*roleMiddleware,*/ usersRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/userMeta', passport.authenticate('jwt', { session: false }), /*roleMiddleware,*/ userMetaRouter);
app.use('/api/orgMeta',   /*roleMiddleware,*/ orgMetaRouter);
// app.use('/api/mail', mailRouter);

/* softobotics */

app.use('/api/user', /*roleMiddleware,*/ userRouter);
app.use('/api/task', passport.authenticate('jwt', { session: false }), taskRouter);
app.use('/api/comment', passport.authenticate('jwt', { session: false }), commentRouter);
app.use('/api/leave', passport.authenticate('jwt', { session: false }), Leave);
app.use('/api/holiday', passport.authenticate('jwt', { session: false }), Holiday);
app.use('/api/dayoff', passport.authenticate('jwt', { session: false }), Dayoff);
app.use('/api/todo', passport.authenticate('jwt', { session: false }), todoRouter);
app.use('/api/weekday', passport.authenticate('jwt', { session: false }), Weekday);
app.use('/api/userInfo', passport.authenticate('jwt', { session: false }), UserInfoRouter);
app.use('/api/payslip', passport.authenticate('jwt', { session: false }), PayslipRouter);

// error handler, don't remove next

app.use(function (err, req, res, next) {
    let errorCode = '';
    const errorCodes = [
        'MISSING_USERNAME',
        'MISSING_PASSWORD',
        'INVALID_USERNAME',
        'INVALID_PASSWORD',
        'INVALID_EMAIL',
        'PERMISSION_DENIED',
        'MISSING_EMAIL',
    ];

    switch (err.name) {
        case 'TokenExpiredError':
            errorCode = 'expired_token';
            break;
        case 'JsonWebTokenError':
            errorCode = 'invalid_token';
            break;
        case 'SequelizeUniqueConstraintError':
            errorCode = 'duplicated_' + Object.keys(err.fields)[0];
            break;
        case 'SequelizeDatabaseError':
            errorCode = 'invalid_inputs';
            break;
        default:
            errorCode = 'unrecognized';
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        errorCode = 'INCORRECT_FILE_SIZE';
    }
    if (err.message && errorCodes.includes(err.message.toUpperCase())) {
        errorCode = err.message;
    }
    res.json({
        success: false,
        error: {
            name: errorCode.toUpperCase()
        }
    });
});

module.exports = app;