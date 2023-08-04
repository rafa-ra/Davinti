const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Contact = require("./models/contact");
const TelephoneNumber = require("./models/telephoneNumber");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const contactRoutes = require("./routes/contacts");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(contactRoutes);

app.use(errorController.get404);
app.use("/500", errorController.get500);

Contact.hasMany(TelephoneNumber, {
  foreignKey: "IDCONTATO",
  onDelete: "CASCADE",
});
TelephoneNumber.belongsTo(Contact, {
  foreignKey: "IDCONTATO",
});

sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
