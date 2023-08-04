const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Contact = sequelize.define("Contato", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.DataTypes.STRING(100),
    allowNull: false,
  },
  idade: {
    type: Sequelize.DataTypes.INTEGER,
  },
});

module.exports = Contact;
