const bcrypt = require('bcryptjs');

const PasswordService = {
  // get a password reset request by user id
  getById(db, id) {
    return db
      .from('ezpunishments_reset_password')
      .where('user_id', id)
      .andWhere('status', 0)
      .first();
  },

  // insert a new password reset request
  insert(db, newPasswordReset) {
    return db
      .into('ezpunishments_reset_password')
      .insert(newPasswordReset)
      .returning('*')
      .then(([resetPassword]) => resetPassword);
  },

  // update the status of a password reset request
  updateStatus(db, id) {
    return db('ezpunishments_reset_password')
      .where({
        id
      })
      .update({
        status: 1
      });
  },

  // generate a random token for password reset
  generateToken(length) {
    let a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let b = [];
    for (let i = 0; i < length; i++) {
      let j = (Math.random() * (a.length - 1)).toFixed(0);
      b[i] = a[j];
    }
    return b.join('');
  },

  // hash the random token
  hashToken(token) {
    return bcrypt.hash(token, 12);
  }
};

module.exports = PasswordService;