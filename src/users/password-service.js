const bcrypt = require('bcryptjs');

const PasswordService = {
  getById(db, id) {
    return db
      .from('ezpunishments_reset_password')
      .where({ user_id: id, status: 0 })
      .first();
  },

  insert(db, newPasswordReset) {
    return db
      .insert(newPasswordReset)
      .into('ezpunishments_password_reset')
      .returning('*')
      .then(([resetPassword]) => resetPassword);
  },

  updateStatus(db, id) {
    return db('ezpunishments_password_reset')
      .where({ id })
      .update({ status: 1 });
  },

  generateToken(length) {
    let a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let b = []; 
    for(let i = 0; i < length; i++) {
      let j = (Math.random() * (a.length-1)).toFixed(0);
      b[i] = a[j];
    }
    return b.join('');
  },

  hashToken(token) {
    return bcrypt.hash(token, 12);
  }
};

module.exports = PasswordService;