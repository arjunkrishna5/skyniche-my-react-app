const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconnection");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "roles",
  timestamps: false,
});

module.exports = Role;