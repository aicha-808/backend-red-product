
require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to,subject, test)  => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        test
    };
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;