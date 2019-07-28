const nodemailer = require('nodemailer');

const options = {
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
};

const transporter = nodemailer.createTransport(options);

module.exports = transporter;
