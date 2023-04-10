const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

/*Function that automatically generates an account number*/
function generateAccountNumber() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const User = db.define('users', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  accountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    defaultValue: generateAccountNumber(),
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1000,
  },
  status: {
    type: DataTypes.ENUM('active', 'disabled'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = User;
