import nodemailer from 'nodemailer';
import Email from 'email-templates';
import path from 'path';
// const nodemailer = require('nodemailer');
// const Email = require('email-templates');
// const path = require('path');

require('dotenv').config();

// listen for token updates (if refreshToken is set)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.userEmail,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken: process.env.refreshToken,
    accessToken: process.env.accessToken,
    expires: 3599,
  },
});

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
  views: {
    options: {
      extension: 'hbs',
    },
    root: __dirname,
  },
});
const sendEmailConfirmation = (user, token) =>
  email
    .send(
      {
        template: path.join(__dirname, 'template'),
        message: {
          from: 'LysterGems <support@lystergems.com>', // sender address
          to: user.email, // list of receivers
        },
        locals: {
          fname: user.firstname,
          lname: user.lastname,
          token,
        },
      },
      console.log('email', user, token),
    )
    .then(() => console.log('Message sent: %s'))
    .catch((error) => console.log(error));

export default sendEmailConfirmation;
