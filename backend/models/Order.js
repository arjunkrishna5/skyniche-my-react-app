const sequelize = require("../config/dbconnection");
const Sequelize = require("sequelize");

const Order = sequelize.define(
  "orders",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderCode: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    customerName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "Processing",
    },
    trackingNumber: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    itemsJson: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  { tableName: "orders", timestamps: true }
);

module.exports = Order;
