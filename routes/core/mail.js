const nodemailer = require("nodemailer");
const Task = require('../../models').Task;
const User = require('../../models').User;
const Leave = require('../../models').Leave;

module.exports = {
    taskMailer: async function (req, action, taskId) {
        let link = 'href="https://' + req.headers.host + '/employee/task/';
        let compMail = 'kunal@softobotics.com';
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
                let updatedDate = new Date(data.updatedAt).getHours();
                let dueDate = new Date(data.dueDate).getHours();
                let strAmPm;
                if (updatedDate >= 12 || dueDate >= 12) {
                    strAmPm = "PM";
                } else {
                    strAmPm = "AM";
                }
                let timeStamp = new Date(data.updatedAt).getDate() + '-' + (new Date(data.updatedAt).getMonth() + 1) + '-' + new Date(data.updatedAt).getFullYear() + '\t' + new Date(data.updatedAt).getHours() + ':' + new Date(data.updatedAt).getMinutes() + '\t' + strAmPm;
                let dueTimeStamp = new Date(data.dueDate).getDate() + '-' + (new Date(data.dueDate).getMonth() + 1) + '-' + new Date(data.dueDate).getFullYear() + '\t' + new Date(data.dueDate).getHours() + ':' + new Date(data.dueDate).getMinutes() + '\t' + strAmPm;
                let isDoubt;
                if (data.isDoubt == 1) {
                    isDoubt = '<td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #f05050;">Yes'
                } else {
                    isDoubt = '<td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #28a745;">No'
                }
                let mailerList = [];
                mailerList.push('gkunal7691@gmail.com');
                if (req.user.email != compMail) {
                    mailerList.push(compMail)
                }
                if (req.user.email != data.user.email) {
                    mailerList.push(data.user.email)
                }
                mailerList = mailerList.join(',');
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
                    to: `${mailerList}`,
                    subject: 'TMS-' + data.taskId + ' [' + action + ' - ' + req.user.firstName + ' ' + req.user.lastName + ']' + data.title,
                    html: '<table style="font-family: arial, sans-serif; border-collapse: collapse;"><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Task ID</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;"><a style="color: #000;" '
                        + `${link.concat(data.taskId)}">` + 'TMS-' + `${data.taskId}` + '</a>' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Title</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + data.title + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Description</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + data.description + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Status</th><td style="border: 2px solid #000;text-align: left;padding: 8px;text-transform: capitalize;background-color: #e6e6e6;">'
                        + data.status + '</td></tr><tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Priority</th><td style="border: 2px solid #000;text-align: left;padding: 8px;text-transform: capitalize;background-color: #e6e6e6;">'
                        + data.priority + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Due Date</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + dueTimeStamp + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Estimated Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + (Math.round((data.estimatedTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Client Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + (Math.round((data.clientTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Original Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + (Math.round((data.originalTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Assignee</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + data.user.firstName + '&nbsp;' + data.user.lastName + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Has Doubt</th>'
                        + isDoubt + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Action</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + action + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Action By User</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + req.user.firstName + '&nbsp;' + req.user.lastName + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Updated Timestamp</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + timeStamp + '</td></tr></table> <br> <button style="background-color: #007bff;border-color: #007bff;float: left;border: 1px solid transparent;padding: .375rem .75rem;line-height: 1;border-radius: .25rem;"><a style="text-decoration: none;font-size:24px;color:#fff;" '
                        + `${link.concat(data.taskId)}">` + ' Open Task </a></button>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info);
                    }
                });
            })
    },
    leaveMailer: async function (req, noofDays, toDate, fromDate, leaveId) {
        let compMail = 'kunal@softobotics.com';
        Leave.findOne({
            where: {
                leaveId: leaveId
            },
            include: [
                {
                    model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'roleId']
                },
            ],
        }).then((data) => {
            let timeStamp = new Date(fromDate).getDate() + '-' + (new Date(fromDate).getMonth() + 1) + '-' + new Date(fromDate).getFullYear() + '\t' + new Date(fromDate).getHours() + ':' + new Date(fromDate).getMinutes();
            let dueTimeStamp = new Date(toDate).getDate() + '-' + (new Date(toDate).getMonth() + 1) + '-' + new Date(toDate).getFullYear() + '\t' + new Date(toDate).getHours() + ':' + new Date(toDate).getMinutes();
            let mailerList = [];
            mailerList.push('gkunal7691@gmail.com');
            if (req.user.email != compMail) {
                mailerList.push(compMail)
            }
            if (req.user.email != data.User.email) {
                mailerList.push(data.User.email)
            }
            mailerList = mailerList.join(',');
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
                to: `${mailerList}`,
                subject: 'Leave Apply By - ' + req.user.firstName + ' ' + req.user.lastName,
                html: '<table style="font-family: arial, sans-serif; border-collapse: collapse;"><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">From Date</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                    + timeStamp + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">To Date</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                    + dueTimeStamp + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Number of Days</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                    + noofDays + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Applied By</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                    + req.user.firstName + '&nbsp;' + req.user.lastName + '</td></tr></table>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info);
                }
            });
        })
    }
};
