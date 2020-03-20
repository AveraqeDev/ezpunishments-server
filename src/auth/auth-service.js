const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  // get user by username
  getUserWithUserName(db, user_name) {
    return db('ezpunishments_users')
      .where({
        user_name
      })
      .first();
  },

  // compare given password to stored password
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  // create JWT for user
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },

  // verify users JWT is valid
  vertifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  }
};

module.exports = AuthService;