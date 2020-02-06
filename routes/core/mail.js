const nodemailer = require("nodemailer");
const Task = require('../../models').Task;
const User = require('../../models').User;

module.exports = {
    taskMailer: async function (req, action, taskId) {
        let link = 'href="https:// ' + req.headers.host + '/employee/task/';
        let compMail = 'piysuh.dutta@softobotics.com';
        Task.findOne({
            where: {
                taskId: taskId
            },
            include: [
                {
                    model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
                },
            ],
        })
            .then((data) => {
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
                    to: `${data.user.email}`,
                    cc: `${compMail}`,
                    subject: 'Softobotics, TMS-' + `${data.taskId} ` + `${data.title}, ` + ` ${action}`,
                    html: '<a style="font-size:18px"' + `${link.concat(data.taskId)}">` + 'TMS-' + `${data.taskId}` + '</a>' +
                        '<p style="font-size:18px;><span style="font-size:20px;color:black;font-weight: bold;">TMS-' + data.taskId + '</span> &nbsp;' +
                        action + '&nbsp; by &nbsp;' + data.user.firstName + '&nbsp;' + data.user.lastName + ' in TMS at &nbsp;' + `${data.updatedAt} </p>`
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
            })
    }
};
