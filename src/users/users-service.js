const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getAllUsers(db) {
    return db('ezpunishments_users')
      .select('*');
  },

  getById(db, id) {
    return db
      .from('ezpunishments_users')
      .select('*')
      .where({ id })
      .first();
  },

  hasUserWithUserName(db, user_name) {
    return db('ezpunishments_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('ezpunishments_users')
      .returning('*')
      .then(([user]) => user);
  },
  
  updateUser(db, user_name, newUserFields) {
    return db('ezpunishments_users')
      .where({ user_name })
      .update(newUserFields);
  },

  getUserPunishments(db, user_name) {
    return db('ezpunishments_punishments')
      .select('*')
      .where('name', user_name);
  },

  getPunishmentsByUser(db, user_name) {
    return db('ezpunishments_punishments')
      .select('*')
      .where('punished_by', user_name);
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUsers(users) {
    return users.map(this.serializeUser);
  },

  serializeUser(user) {
    return {
      id: user.id,
      email: xss(user.email),
      user_name: xss(user.user_name),
      user_role: xss(user.user_role),
      date_created: new Date(user.date_created),
    };
  }
};

module.exports = UsersService;