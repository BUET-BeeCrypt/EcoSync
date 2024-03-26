const nodemailer = require('nodemailer');
exports.sendMail = async (RECEIVER_EMAIL, subject, body) => {
    let mailConfig;
    const SENDER_EMAIL = process.env.EMAIL_ID;

    mailConfig = {
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: SENDER_EMAIL,
            pass: process.env.EMAIL_PASS
        }
    };

    const transporter = nodemailer.createTransport(mailConfig);

    await transporter.sendMail({
        from: SENDER_EMAIL,
        to: RECEIVER_EMAIL,
        subject: subject,
        text: body
    }, (err, info) => {
        if (info)
            console.log('Successful!!!');
        if (err) {
            console.log("Error is ");
            console.log(err)
        }
    })
}