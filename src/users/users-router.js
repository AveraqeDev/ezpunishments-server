const express = require('express');
const path = require('path');
const moment = require('moment');
const bcrypt = require('bcryptjs');

const config = require('../config');
const UsersService = require('./users-service');
const PunishmentsService = require('../punishments/punishments-service');
const PasswordService = require('./password-service');

const sendMail = require('../mail/send-mail');
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { email, user_name, password } = req.body;
    
    for(const field of ['email', 'user_name', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const passwordError = UsersService.validatePassword(password);

    if(passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if(hasUserWithUserName)
          return res.status(400).json({error: 'Username already taken' });
        
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              email,
              user_name,
              password: hashedPassword
            };

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  })
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(UsersService.serializeUsers(users));
      })
      .catch(next);
  });
  
usersRouter
  .route('/:userId')
  .patch(jsonBodyParser, checkUserExists, (req, res, next) => {
    const { email, user_name, user_role } = req.body;
    const userToUpdate = { email, user_name, user_role };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({
        error: 'Request body must contain either "email", "user_name", or "role"'
      });
    }

    UsersService.updateUser(
      req.app.get('db'),
      req.params.userId,
      userToUpdate
    )
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .get(checkUserExists, (req, res) => {
    res.json(UsersService.serializeUser(res.user));
  });

usersRouter
  .get('/:userId/punishments', checkUserExists, (req, res, next) => {
    const { user_name } = res.user;
    UsersService.getUserPunishments(
      req.app.get('db'),
      user_name
    )
      .then(punishments => {
        res.json(PunishmentsService.serializePunishments(punishments));
      })
      .catch(next);
  })
  .get('/:userId/punishes', checkUserExists, (req, res, next) => {
    const { user_name } = res.user;
    UsersService.getPunishmentsByUser(
      req.app.get('db'),
      user_name
    )
      .then(punishments => {
        res.json(PunishmentsService.serializePunishments(punishments));
      })
      .catch(next);
  })
  .post('/resetpw', jsonBodyParser, (req, res, next) => {
    const { user_name } = req.body;

    if(!user_name)
      return res.status(400).json({
        error: 'Missing \'user_name\' in request body'
      });

    UsersService.getByName(
      req.app.get('db'),
      user_name
    )
      .then(user => {
        if(!user || !user.email) 
          return res.status(404).json({ error: 'Could not find email associated with given username' });

        return PasswordService.getById(
          req.app.get('db'),
          user.id
        )
          .then(reset => {
            if(reset) {
              PasswordService.updateStatus(
                req.app.get('db'),
                reset.id
              );
            }
            let token = PasswordService.generateToken(32);

            PasswordService.hashToken(token)
              .then(hashedToken => {
                PasswordService.insert(
                  req.app.get('db'),
                  {
                    user_id: user.id,
                    token: hashedToken,
                    expire: moment.utc().add(config.RESET_PASSWORD_EXPIRY, 'seconds')
                  })
                  .then(resetPassword => {
                    if(!resetPassword)
                      return res.status(500).json({ error: 'Oops problem creating new password record' });

                    let mailOptions = {
                      from: 'averaqedev@gmail.com',
                      to: user.email,
                      subject: 'Reset your eZPunishments password',
                      html: '<h4><b>Reset Password</b></h4>' +
                            '<p>To reset your password, complete this form:</p>' +
                            '<a href="' + req.hostname + '/reset-password/' + user.id + '/' + token + '">http://' + 
                            req.hostname + '/reset-password/' + user.id + '/' + token + '</a>' +
                                '<br><br>' +
                                '<p>--Team</p>'
                    };
                    
                    sendMail(mailOptions)
                      .then(() => {
                        return res.json({ success: true });
                      })
                      .catch(next);
                  });
              });
          });
      })
      .catch(next);
  })
  .post('/store-password', jsonBodyParser, (req, res, next) => {
    const { user_id, password, token } = req.body;
    
    PasswordService.getById(
      req.app.get('db'),
      user_id
    )
      .then(resetPassword => {
        if(!resetPassword)
          return res.status(401).json({ error: 'Invalid or expired reset token.' });
        bcrypt.compare(token, resetPassword.token)
          .then(tokenMatch => {
            if(!tokenMatch)
              return res.status(401).json({ error: 'Invalid or expired reset token.' });
            let expireTime = moment.utc(resetPassword.expire);
            let currentTime = new Date();
            if(currentTime > expireTime) {
              return res.status(401).json({ error: 'Invalid or expired reset token.' });
            }
            UsersService.hashPassword(password)
              .then(hashedPassword => {
                UsersService.updateUser(
                  req.app.get('db'),
                  user_id,
                  {
                    password: hashedPassword
                  }
                )
                  .then(() => {
                    PasswordService.updateStatus(
                      req.app.get('db'),
                      resetPassword.id
                    );
                  });
              });
          });
      })
      .catch(next);
  });

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getById(
      req.app.get('db'),
      req.params.userId
    );
  
    if(!user)
      res.status(404).json({
        error: 'User doesn\'t exist'
      });
      
    res.user = user;
    next();
  } catch(error) {
    next(error);
  }
}

module.exports = usersRouter;