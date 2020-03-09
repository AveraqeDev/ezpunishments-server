const xss = require('xss');

const PunishmentsService = {
  getById(db, id) {
    return db
      .from('ezpunishments_punishments AS punish')
      .select('*')
      .where('punish.id', id)
      .first();
  },

  insertPunishment(db, newPunishment) {
    return db
      .insert(newPunishment)
      .into('ezpunishments_punishments')
      .returning('*')
      .then(([punishment]) => punishment)
      .then(punishment => PunishmentsService.getById(db, punishment.id));
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