const jwt = require('jsonwebtoken');
const { secretKey } = require('./jwtSign');
const dotenv = require('dotenv');
 dotenv.config();

function jwtAuthenticator(ctx, next) {
  const authorizationHeader = ctx.headers.authorization;
  
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication fail nice message' };
    return;
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.exp < Date.now() / 1000) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication fail nice message' };
      return;
    }

    if (!decoded.aud || !decoded.userId) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication fail nice message' };
      return;
    }

    ctx.state.user = decoded;
    return next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication fail nice message' };
  }
}

module.exports = jwtAuthenticator;
