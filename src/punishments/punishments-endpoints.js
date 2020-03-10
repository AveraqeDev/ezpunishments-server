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
    PunishmentsService.getAllPunishments(req.app.get('db'))
      .then(punishments => {
        res.json(PunishmentsService.serializePunishments(punishments));
      })
      .catch(next);
  });

punishmentsRouter
  .route('/:punishmentId')
  .all(checkPunishmentExists)
  .get((req, res) => {
    res.json(PunishmentsService.serializePunishment(res.punishment));
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