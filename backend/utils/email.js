const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1)create a transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2)DEfine email options

  const mailOptions = {
    from: 'Alice Johnson <alice.johnson@email.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  //3)send email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
