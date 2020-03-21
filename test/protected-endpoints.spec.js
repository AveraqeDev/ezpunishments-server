const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected endpoints', function() {
  let db;

  const {
    testUsers,
    testPunishments
  } = helpers.makeFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert punishments', () =>
    helpers.seedPunishmentsTable(
      db,
      testPunishments
    )
  );

  const protectedEndpoints = [
    {
      name: 'POST /api/punishments/',
      path: '/api/punishments/',
      method: supertest(app).post
    },
    {
      name: 'GET /api/punishments/:punishmentId',
      path: '/api/punishments/1',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/punishments/:punishmentId',
      path: '/api/punishments/1',
      method: supertest(app).patch
    },
    {
      name: 'GET /api/users/',
      path: '/api/users/',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/users/:userId',
      path: '/api/users/1',
      method: supertest(app).patch
    },
    {
      name: 'GET /api/users/:userId',
      path: '/api/users/1',
      method: supertest(app).get
    },
    {
      name: 'GET /api/users/:userId/punishments',
      path: '/api/users/1/punishments',
      method: supertest(app).get
    },
    {
      name: 'GET /api/users/:userId/punishes',
      path: '/api/users/1/punishes',
      method: supertest(app).get
    },
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 401 \'Missing bcrypt token\' when no bearer token', () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: 'Missing bearer token' });
      });

      it('responds 401 \'Unauthorized request\' when invalid JWT secret', () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: 'Unauthorized request' });
      });

      it('responds 401 \'Unauthorized request\' when invalid sub in payload', () => {
        const invalidUser = { user_name: 'user-not-existy', id: 1 };
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });
});