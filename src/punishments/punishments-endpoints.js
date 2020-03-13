const express = require('express');
const path = require('path');
const PunishmentsService = require('./punishments-service');

const punishmentsRouter = express.Router();
const jsonBodyParser = express.json();

punishmentsRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { name, reason, proof, punished_by, expires } = req.body;
    const newPunishment = { name, reason, proof, punished_by, expires };

    for (const [key, value] of Object.entries(newPunishment))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    PunishmentsService.insertPunishment(
      req.app.get('db'),
      newPunishment
    )
      .then(punishment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${req.body.id}`))
          .json(PunishmentsService.serializePunishment(punishment));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    if(req.query.recent) {
      PunishmentsService.getRecentPunishments(req.app.get('db'))
        .then(punishments => {
          res.json(PunishmentsService.serializePunishments(punishments));
        })
        .catch(next);
    } else {
      PunishmentsService.getAllPunishments(req.app.get('db'))
        .then(punishments => {
          res.json(PunishmentsService.serializePunishments(punishments));
        })
        .catch(next);
    }
  });

punishmentsRouter
  .route('/:punishmentId')
  .all(checkPunishmentExists)
  .get((req, res) => {
    res.json(PunishmentsService.serializePunishment(res.punishment));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { reason, proof, punished_by, removed_by, active, expires, updated } = req.body;
    const punishmentToUpdate = { reason, proof, punished_by, removed_by, active, expires };

    const numberofValues = Object.values(punishmentToUpdate).filter(Boolean).length;
    if(numberofValues === 0) {
      return res.status(400).json({
        error: 'Request body must contain either "reason", "proof", "punished_by", "removed_by", "active", or "expires"'
      });
    }

    punishmentToUpdate.updated = updated;

    PunishmentsService.updatePunishment(
      req.app.get('db'),
      req.params.punishmentId,
      punishmentToUpdate
    )
      .then(numRowsAffected => {
        if(numRowsAffected > 0) {
          return PunishmentsService.getById(
            req.app.get('db'),
            req.params.punishmentId
          )
            .then(punishment => res.status(200).json(PunishmentsService.serializePunishment(punishment)))
            .catch(next);
        } else {
          return res.status(304).end();
        }
      })
      .catch(next);
  });

async function checkPunishmentExists(req, res, next) {
  try {
    const punishment = await PunishmentsService.getById(
      req.app.get('db'),
      req.params.punishmentId
    );

    if(!punishment)
      res.status(404).json({
        error: 'Punishment doesn\'t exist'
      });
    
    res.punishment = punishment;
    next();
  } catch(error) {
    next(error);
  }
}

module.exports = punishmentsRouter;