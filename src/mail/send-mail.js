const nodemailer = require('nodemailer');

const config = require('../config');

// send reset password email to user
module.exports = function sendMail(options) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.EMAIL_USER,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN,
      accessToken: config.ACCESS_TOKEN
    }
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};