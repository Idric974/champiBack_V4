const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  host: process.env.MYSQL_HOST,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD_CR,
  database: process.env.DB_NAME,
  dialect: process.env.SQL_DIALECT,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("[NODE SERVER] Connexion à la base de données réussie");
  })

  .catch((err) => {
    console.log(
      "[NODE SERVER] Connexion à la base de données ❌❌ échouée ❌❌",
      err
    );
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//? GestionAir

db.gestionAir = require("./gestionAir/gestionAirModels")(sequelize, Sequelize);

module.exports = db;
