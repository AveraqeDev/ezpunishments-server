const AuthService = require('../auth/auth-service');

// check bearer token for authorization
function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    console.log('no token');
    return res.status(401).json({
      error: 'Missing bearer token'
    });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.vertifyJwt(bearerToken);

    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if (!user) {
          console.log('no user');
          return res.status(401).json({
            error: 'Unauthorized request'
          });
        }
        req.user = user;
        next();
      })
      .catch(error => {
        console.error(error);
        next(error);
      });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      error: 'Unauthorized request'
    });
  }
}

module.exports = {
  requireAuth
};