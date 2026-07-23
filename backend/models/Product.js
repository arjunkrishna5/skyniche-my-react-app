const sequelize = require("../config/dbconnection");
const Sequelize = require("sequelize");

const Product = sequelize.define(
  "products",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sku: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "In Stock",
    },
    desc: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  { tableName: "products", timestamps: true }
);

module.exports = Product;
