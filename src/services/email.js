import nodemailer from 'nodemailer';
require('dotenv').config();

// async..await is not allowed in global scope, must use a wrapper
async function mailService(user, token) {
  try {
    // listen for token updates (if refreshToken is set)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        // move all of this to .env file
        user: 'kellshoppingsite@gmail.com',
        clientId:process.env.clientId,
        clientSecret:process.env.clientSecret ,
        refreshToken: process.env.refreshToken,
        accessToken: process.env.accessToken,
        expires: 3599,
      },
    });

    // email verification url
    const url = `http://localhost:3000/api/v1/auth/emailVerification?token=${token}`;
    // might be moving this to the endpoint or create a function and export it

    const info = await transporter.sendMail({
      from: 'support@shoppingsite.com', // sender address
      to: user.email, // list of receivers
      subject: 'Verify your email address', // Subject line
      // text: 'Hello world?', // plain text body
      html: `<h3>Hi ${user.firstname}<h3>
           <p> please click on the link to verify your email</p>
           <p> ${url}</p>`, // html body
    });
    console.log('Message sent: %s', info.messageId);

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  } catch (error) {
    console.log(error);
  }
}

export default mailService;
