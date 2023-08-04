const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const DataTypes = Sequelize.DataTypes;

const TelephoneNumber = sequelize.define("Telefone", {
  ID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  NUMERO: {
    type: DataTypes.CHAR(16),
    allowNull: false,
  },
  IDCONTATO: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = TelephoneNumber;
