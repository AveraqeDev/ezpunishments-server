const bcrypt = require('bcryptjs');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'testuser1@test.com',
      user_name: 'test-user-1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      email: 'testuser2@test.com',
      user_name: 'test-user-2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      email: 'testuser3@test.com',
      user_name: 'test-user-3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      email: 'testuser4@test.com',
      user_name: 'test-user-4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makePunishmentsFixtures() {
  const testUsers = makeUsersArray();

  return { testUsers };
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hash(user.password, 1)
  }));
  return db.into('ezpunishments_users').insert(preppedUsers)
    .then(() => {
      db.raw(
        'SELECT setval(\'ezpunishments_users_id_seq\', ?',
        [users[users.length - 1].id]
      );
    });
}