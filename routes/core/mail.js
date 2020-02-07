const nodemailer = require("nodemailer");
const Task = require('../../models').Task;
const User = require('../../models').User;

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
                    isDoubt = '<td style="border: 2px solid #000;text-align: left;padding: 8px;"><div style="height:12px;width:18px;background-color: #f05050;padding:8px;">Yes</div>'
                } else {
                    isDoubt = '<td style="border: 2px solid #000;text-align: left;padding: 8px;"><div style="height:12px;width:16px;background-color: #23b7e5;padding:8px;">No</div>'
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
                    subject: 'TMS-' + data.taskId + ' [' + action + '] ' + data.title,
                    html: '<table style="font-family: arial, sans-serif; border-collapse: collapse;width: 100%;"><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Task ID</th><td style="border: 2px solid #000;text-align: left;padding: 8px;"><a style="color: #000;" '
                        + `${link.concat(data.taskId)}">` + 'TMS-' + `${data.taskId}` + '</a>' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #ffefc4;">Title</th><td style="border: 2px solid #000;text-align: left;padding: 8px;background-color: #e6e6e6;">'
                        + data.title + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Description</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + data.description + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Status</th><td style="border: 2px solid #000;text-align: left;padding: 8px;text-transform: capitalize;">'
                        + data.status + '</td></tr><tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Priority</th><td style="border: 2px solid #000;text-align: left;padding: 8px;text-transform: capitalize;">'
                        + data.priority + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Due Date</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + dueTimeStamp + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Estimated Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + (Math.round((data.estimatedTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Client Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + (Math.round((data.clientTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Original Time</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + (Math.round((data.originalTime / 60) * 100) / 100).toFixed(1) + '\t' + 'Hours' + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Assignee</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + data.user.firstName + '&nbsp;' + data.user.lastName + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Has Doubt</th>'
                        + isDoubt + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Action</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + action + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Action By User</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + req.user.firstName + '&nbsp;' + req.user.lastName + '</td></tr><tr><th style="border: 2px solid #000;text-align: left;padding: 8px;">Updated Timestamp</th><td style="border: 2px solid #000;text-align: left;padding: 8px;">'
                        + timeStamp + '</td></tr></table> <br> <button style="background-color: #007bff;border-color: #007bff;float: left;margin-bottom:10px;"><a style="text-decoration: none;font-size:24px;color:#fff;" '
                        + `${link.concat(data.taskId)}">` + ' Open Task </a></button>'
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
