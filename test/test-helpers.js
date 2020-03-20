const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'testuser1@test.com',
      user_name: 'test-user-1',
      password: 'password',
      user_role: 'member',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      email: 'testuser2@test.com',
      user_name: 'test-user-2',
      password: 'password',
      user_role: 'member',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      email: 'testuser3@test.com',
      user_name: 'test-user-3',
      password: 'password',
      user_role: 'admin',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      email: 'testuser4@test.com',
      user_name: 'test-user-4',
      password: 'password',
      user_role: 'staff',
      date_created: '2029-01-22T16:28:32.615Z'
    }
  ];
}

function makePunishmentsArray(users) {
  return [
    {
      id: 1,
      name: users[0].user_name,
      reason: 'test punishment 1',
      proof: 'https://test1.proof',
      punished_by: users[3].user_name,
      removed_by: '',
      active: true,
      expires: null,
      date_punished: '2029-01-22T16:28:32.615Z',
      updated: null
    },
    {
      id: 2,
      name: users[1].user_name,
      reason: 'test punishment 2',
      proof: 'https://test2.proof',
      punished_by: users[2].user_name,
      removed_by: '',
      active: true,
      expires: '2029-01-26T16:28:32.615Z',
      date_punished: '2029-01-22T16:28:32.615Z',
      updated: null
    },
    {
      id: 3,
      name: users[1].user_name,
      reason: 'test punishment 3',
      proof: 'https://test3.proof',
      punished_by: users[3].user_name,
      removed_by: users[2].user_name,
      active: false,
      expires: '2029-01-22T16:28:32.615Z',
      date_punished: '2029-01-22T16:28:32.615Z',
      updated: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      name: users[0].user_name,
      reason: 'test punishment 4',
      proof: 'https://test4.proof',
      punished_by: users[2].user_name,
      removed_by: '',
      active: true,
      expires: null,
      date_punished: '2029-01-22T16:28:32.615Z',
      updated: null
    },
  ];
}

function makeMaliciousPunishment() {
  const users = makeUsersArray();
  const maliciousPunishment = {
    id: 911,
    name: users[0].user_name,
    reason: 'Naughty naughty very naughty <script>alert("xss");</script>',
    proof: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    punished_by: users[2].user_name,
    removed_by: null,
    active: true,
    expires: null,
    date_punished: '2029-01-22T16:28:32.615Z',
    updated: null
  };
  const expectedPunishment = {
    ...maliciousPunishment,
    reason: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    proof: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
  };
  return {
    maliciousPunishment,
    expectedPunishment
  };
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testPunishments = makePunishmentsArray(testUsers);
  return { testUsers, testPunishments };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw('TRUNCATE ezpunishments_punishments, ezpunishments_users, ezpunishments_reset_password')
      .then(() =>
        Promise.all([
          trx.raw('ALTER SEQUENCE ezpunishments_punishments_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE ezpunishments_users_id_seq minvalue 0 START WITH 1'),
          trx.raw('ALTER SEQUENCE ezpunishments_reset_password_id_seq minvalue 0 START WITH 1'),
          trx.raw('SELECT setval(\'ezpunishments_punishments_id_seq\', 0)'),
          trx.raw('SELECT setval(\'ezpunishments_users_id_seq\', 0)'),
          trx.raw('SELECT setval(\'ezpunishments_reset_password_id_seq\', 0)'),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into('ezpunishments_users').insert(preppedUsers)
    .then(() => {
      db.raw(
        'SELECT setval(\'ezpunishments_users_id_seq\', ?)',
        [users[users.length-1].id]
      );
    });
}

function seedPunishmentsTables(db, users, punishments) {
  db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('ezpunishments_punishments').insert(punishments);
    await trx.raw(
      'SELECT setval(\'ezpunishments_punishments_id_seq\', ?)',
      [punishments[punishments.length - 1].id]
    );
  });
}

function seedMaliciousPunishment(db, user, punishment) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('ezpunishments_punishments')
        .insert([punishment])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id, role: user.user_role }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makePunishmentsArray,
  makeMaliciousPunishment,
  makeFixtures,
  
  cleanTables,
  seedUsers,
  seedPunishmentsTables,
  seedMaliciousPunishment,
  makeAuthHeader
};
