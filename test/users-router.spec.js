const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

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

  describe('POST /api/users', () => {
    context('User validation', () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers
        )
      );

      const requireFields = ['email', 'user_name', 'password'];

      requireFields.forEach((field) => {
        const registerAttemptBody = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: 'test password'
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            });
        });
      });

      it('responds 400 \'Password must be longer than 8 characters\' when empty password', () => {
        const userShortPassword = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: '1234567',
        };
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, {
            error: 'Password must be longer than 8 characters'
          });
      });

      it('responds 400 \'Password must be less than 72 characters\' when long password', () => {
        const userLongPassword = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: '*'.repeat(73)
        };
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: 'Password must be less than 72 characters' });
      });

      it('responds 400 error when password starts with spaces', () => {
        const userPasswordStartsSpaces = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: ' 1Aa!2Bb@'
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: 'Password must not start or end with empty spaces' });
      });

      it('responds 400 error when password ends with spaces', () => {
        const userPasswordEndsSpaces = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: '1Aa!2Bb@ '
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: 'Password must not start or end with empty spaces' });
      });

      it('responds 400 error when password isn\'t complex enough', () => {
        const userPasswordNotComplex = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: '11AAaabb'
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: 'Password must contain one upper case, lower case, number and special character' });
      });

      it('responds 400 \'User name already taken\' when user_name isn\'t unique', () => {
        const duplicateUser = {
          email: 'test@email.com',
          user_name: testUser.user_name,
          password: '11AAaa!!'
        };
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: 'Username already taken' });
      });
    });

    context('Happy path', () => {
      it('responds 201, serialized user, storing bcrypted password', () => {
        const newUser = {
          email: 'test@email.com',
          user_name: 'test user_name',
          password: '11AAaa!!'
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.email).to.eql(newUser.email);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
          .expect(res =>
            db
              .from('ezpunishments_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.email).to.eql(newUser.email);
                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
                const actualDate = new Date(row.date_created).toLocaleString();
                expect(actualDate).to.eql(expectedDate);
              })
          );
      });
    });
  });
});
