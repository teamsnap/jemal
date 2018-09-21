import nodemailer from 'nodemailer';
import dotenv from 'dotenv-flow';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config()

const options = {
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
};

console.log(options)

const transporter = nodemailer.createTransport(options);

export default transporter;
