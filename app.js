const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router'); 
const jwtAuthenticator = require('./jwtAuthenticator');
const { generateToken, respondWithToken } = require('./jwtSign');

const app = new Koa();
const router = new Router();

router.post('/login', async (ctx) => {
  const { aud, userId } = ctx.request.body;

  if (!aud || !userId) {
    ctx.status = 401;
    ctx.body = { error: 'Authentication fail nice message' };
    return;
  }

  const user = {
    userId,
    aud,
  };

  const token = generateToken(user);
  
  respondWithToken(ctx, token);
});

router.get('/protected', jwtAuthenticator, async (ctx) => {
  ctx.body = { message: 'You are authorized to access this resource', user: ctx.state.user };
});

app.use(bodyParser());
app.use(router.routes()); 
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
