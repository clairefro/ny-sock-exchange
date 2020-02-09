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

// middleware for decoding JWT and gettign user id
server.express.use((req, res, next) => {
  const cooks = req.cookies;
  // get token from request
  const { token } = req.cookies;
  // decode token if exists
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
    console.log({userId})
  }
  // put user id onto req for further access requests
  next();
 });


server.start({
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
    port: 4444,
  }, deets => {
      console.log(`Server is now running on https://localhost:${deets.port}`);
    }
);

// cors above only allows db access from authorized url (defined in ENV)
