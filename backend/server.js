require('dotenv').config();
const fastify = require("fastify")({ logger: true });
const fastifyCors = require("@fastify/cors");
const multipart = require('@fastify/multipart');
const fastifyCookie = require('@fastify/cookie');
const path = require('path')
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/users');

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', "http://192.168.1.16:3000", 'http://localhost:3001'];

fastify.register(fastifyCors, {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE']
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'supersecret',
  parseOptions: {}
});

fastify.register(require('@fastify/formbody'));
fastify.register(multipart, { attachFieldsToBody: true });

// Route for serving 'index.html' for paths starting with '/app/'
fastify.get('/app/*', function (req, reply) {
  reply.sendFile("index.html");
});

// Serve static files from 'uploads'
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads',
  index: false,
  list: true
});

authRoutes.forEach((route) => fastify.route(route));
userRoutes.forEach((route) => fastify.route(route));

// Port
const PORT = process.env.PORT || 4000;

// Running server
fastify.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
