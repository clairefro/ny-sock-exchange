const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// entry point to our app, so get the ENV variables
require('dotenv').config({path: 'variables.env'});

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handle cookies (JWT)
// this line gives us access to all the cookies in nice formatted object
server.express.use(cookieParser());

// middleware for decoding JWT and add userId to each request (if avail)
server.express.use((req, res, next) => {
  const cooks = req.cookies;
  // get token from request
  const { token } = req.cookies;
  // decode token if exists
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
    // console.log({userId})
  }
  // put user id onto req for further access requests
  next();
 });

// middleware that populates user on each request
server.express.use(async (req, res, next) => {
  // skip this middleware if not logged in
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
});


server.start({
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
    // for security - prevent third parties from accessing playground
    playground: false,
    port: process.env.PORT,
  }, deets => {
      console.log(`Server is now running on https://localhost:${deets.port}`);
    }
);

// cors above only allows db access from authorized url (defined in ENV)
