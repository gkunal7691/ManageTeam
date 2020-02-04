const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

router.post('/', async function (req, res, next) {
    console.log("hello");
    let transporter = nodemailer.createTransport({
        host: "mail.softobotics.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'notification@softobotics.com', // generated ethereal user
            pass: 'notification@123' // generated ethereal password
        }
    });

    var mailOptions = {
        from: 'gaurav.kunal@softobotics.com',
        to: 'gkunal7691@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
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

});


module.exports = router;
