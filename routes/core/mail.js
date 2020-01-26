const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");

//let testAccount = nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport


router.post('/', async function (req, res, next) {
    console.log("hello");
    let transporter = nodemailer.createTransport({
        host: "mail.softobotics.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'gaurav.kunal@softobotics.com', // generated ethereal user
            pass: 'Kunal@123' // generated ethereal password
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

    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    

});


module.exports = router;
