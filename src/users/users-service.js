const bcrypt = require('bcryptjs');
const xss = require('xss');

// regex to compare against for password requirements
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  // get every user from database
  getAllUsers(db) {
    return db('ezpunishments_users')
      .select('*');
  },

  // get user by their id
  getById(db, id) {
    return db
      .from('ezpunishments_users')
      .select('*')
      .where({
        id
      })
      .first();
  },

  // get user by their username
  getByName(db, user_name) {
    return db
      .from('ezpunishments_users')
      .select('*')
      .where({
        user_name
      })
      .first();
  },

  // check if a username already exists
  hasUserWithUserName(db, user_name) {
    return db('ezpunishments_users')
      .where({
        user_name
      })
      .first()
      .then(user => !!user);
  },

  // insert a new user
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('ezpunishments_users')
      .returning('*')
      .then(([user]) => user);
  },

  // update an existing user
  updateUser(db, id, newUserFields) {
    return db('ezpunishments_users')
      .where({
        id
      })
      .update(newUserFields);
  },

  // get a users punishments
  getUserPunishments(db, user_name) {
    return db('ezpunishments_punishments')
      .select('*')
      .where('name', user_name);
  },

  // get a users executed punishments
  getPunishmentsByUser(db, user_name) {
    return db('ezpunishments_punishments')
      .select('*')
      .where('punished_by', user_name);
  },

  // check if password passes requirements (> 8 characters, < 72 characters, no spaces at ends, Upper case, lower case, number, special character)
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  // hash a users password for storing
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  // serialize an array of users
  serializeUsers(users) {
    return users.map(this.serializeUser);
  },

  // serialize a user for protection against SQL injection attacks
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