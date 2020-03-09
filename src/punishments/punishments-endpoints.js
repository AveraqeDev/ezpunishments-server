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
      // eslint-disable-next-line eqeqeq
      if (value == null)
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
  });

module.exports = punishmentsRouter;