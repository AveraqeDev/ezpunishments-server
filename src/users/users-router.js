const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

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
  .all(checkUserExists)
  .patch(jsonBodyParser, (req, res, next) => {
    const { email, user_name, password, user_role } = req.body;
    const userToUpdate = { email, user_name, password, user_role };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if(numberOfValues === 0) {
      console.log('missing required field');
      return res.status(400).json({
        error: 'Request body must contain either "email", "user_name", "password", or "role"'
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
  .get((req, res) => {
    res.json(UsersService.serializeUser(res.user));
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