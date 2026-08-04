require('dotenv').config();
const fastify = require("fastify")({ logger: true });
const fastifyCors = require("@fastify/cors");
const multipart = require('@fastify/multipart');
const fastifyCookie = require('@fastify/cookie');
const path = require('path')
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const roleRoutes = require('./routes/roles');

const sequelize = require("./config/dbconnection");
const User = require("./models/users");
const Product = require("./models/Product");
const Role = require("./models/Role");

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
productRoutes.forEach((route) => fastify.route(route));
fastify.register(roleRoutes);

// Port
const PORT = process.env.PORT || 4000;

// Running server
fastify.listen({ port: PORT, host: "0.0.0.0" }, async (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully to MySQL on port 3306!");
    await sequelize.sync({ alter: true });
    console.log("MySQL Database Tables synced successfully!");

    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate([
        { sku: "PROD-101", name: 'MacBook Pro 16" M3 Max', category: "Electronics", price: 2499.00, stock: 18, status: "In Stock", desc: "Apple M3 Max chip, 36GB unified memory, Liquid Retina XDR display." },
        { sku: "PROD-102", name: "iPhone 15 Pro Max 256GB", category: "Electronics", price: 1199.00, stock: 25, status: "In Stock", desc: "Forged in titanium, A17 Pro chip, customizable Action button." },
        { sku: "PROD-103", name: "Sony WH-1000XM5 Wireless Headphones", category: "Gadgets", price: 399.00, stock: 4, status: "Low Stock", desc: "Industry-leading noise canceling headphones." },
        { sku: "PROD-104", name: "Hydrating Glow SPF 50 Sunscreen", category: "Skincare", price: 28.00, stock: 50, status: "In Stock", desc: "Weightless daily sunscreen infused with Hyaluronic Acid." },
        { sku: "PROD-105", name: "Vitamin C Radiance Serum", category: "Skincare", price: 34.50, stock: 0, status: "Out of Stock", desc: "Potent 15% Pure Vitamin C antioxidant formula." },
      ]);
      console.log("Initial default products seeded into MySQL database table 'products'!");
    }

  } catch (dbErr) {
    console.error("Database connection error:", dbErr.message);
  }
});
