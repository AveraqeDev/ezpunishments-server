const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Punishments Endpoints', function() {
  let db;

  const {
    testUsers,
    testPunishments,
  } = helpers.makeFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/punishments', () => {
    context('Given no punishments', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/punishments')
          .expect(200, []);
      });
    });

    context('Given there are punishments in the database', () => {
      beforeEach('insert punishments', () =>
        helpers.seedPunishmentsTables(
          db,
          testUsers,
          testPunishments,
        )
      );

      it('responds with 200 and all of the punishments', () => {
        return supertest(app)
          .get('/api/punishments')
          .expect(200, testPunishments);
      });
    });

    context('Given an XSS attack punishment', () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousPunishment,
        expectedPunishment,
      } = helpers.makeMaliciousPunishment();

      beforeEach('insert malicious punishment', () => {
        return helpers.seedMaliciousPunishment(
          db,
          testUser,
          maliciousPunishment,
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/punishments')
          .expect(200)
          .expect(res => {
            expect(res.body[0].reason).to.eql(expectedPunishment.reason);
            expect(res.body[0].proof).to.eql(expectedPunishment.proof);
          });
      });
    });
  });

  describe('GET /api/punishments/:punishmentId', () => {
    context('Given no punishments', () => {
      beforeEach(() =>
        helpers.seedUsers(db ,testUsers)
      );

      it('responds with 404', () => {
        const punishmentId = 123456;
        return supertest(app)
          .get(`/api/punishments/${punishmentId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: 'Punishment doesn\'t exist' });
      });
    });

    // context('Given there are punishments in the database', () => {
    //   beforeEach('insert punishments', () =>
    //     helpers.seedPunishmentsTables(
    //       db,
    //       testUsers,
    //       testPunishments,
    //     )
    //   );

    //   it('responds with 200 and the specified punishment', () => {
    //     const punishmentId = 2;
    //     return supertest(app)
    //       .get(`/api/punishments/${punishmentId}`)
    //       .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
    //       .expect(200, testPunishments[punishmentId - 1]);
    //   });
    // });

    context('Given an XSS attack punishment', () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousPunishment,
        expectedPunishment,
      } = helpers.makeMaliciousPunishment();

      beforeEach('insert malicious punishment', () => {
        return helpers.seedMaliciousPunishment(
          db,
          testUser,
          maliciousPunishment,
        );
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/punishments/${maliciousPunishment.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.reason).to.eql(expectedPunishment.reason);
            expect(res.body.proof).to.eql(expectedPunishment.proof);
          });
      });
    });
  });
});