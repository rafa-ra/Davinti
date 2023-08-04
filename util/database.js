const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize("CONTACTS", "root", process.env.SECRET_KEY, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
