// entry point to our app, so get the ENV variables
require('dotenv').config({path: 'variables.env'});

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO: use express middleware to handle cookies (JWT)
// TODO: use express middle to populate curr user

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
