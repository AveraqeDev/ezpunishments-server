const xss = require('xss');

const PunishmentsService = {
  //get a punishment by id
  getById(db, id) {
    return db
      .from('ezpunishments_punishments')
      .select('*')
      .where({
        id
      })
      .first();
  },

  // insert a new punishment
  insertPunishment(db, newPunishment) {
    return db
      .insert(newPunishment)
      .into('ezpunishments_punishments')
      .returning('*')
      .then(([punishment]) => punishment)
      .then(punishment => PunishmentsService.getById(db, punishment.id));
  },

  // get all punishments
  getAllPunishments(db) {
    return db
      .from('ezpunishments_punishments')
      .select('*')
      .orderBy('id');
  },

  // get last 10 punishments
  getRecentPunishments(db) {
    return db
      .from('ezpunishments_punishments')
      .select('*')
      .orderBy('id', 'desc')
      .limit(10);
  },

  updatePunishment(db, id, newPunishmentFields) {
    return db('ezpunishments_punishments')
      .where('id', id)
      .update(newPunishmentFields);
  },

  serializePunishments(punishments) {
    return punishments.map(this.serializePunishment);
  },

  serializePunishment(punishment) {
    return {
      id: punishment.id,
      name: xss(punishment.name),
      reason: xss(punishment.reason),
      proof: xss(punishment.proof),
      punished_by: xss(punishment.punished_by),
      removed_by: xss(punishment.removed_by),
      active: punishment.active,
      expires: punishment.expires,
      date_punished: punishment.date_punished,
      updated: punishment.updated
    };
  }
};

module.exports = PunishmentsService;