const path = require("path");
const Sequelize = require("sequelize");
const configDataBase = require("../utils/SQL/config/dbConfig");

//* Connexion à la base de données
const sequelize = new Sequelize(
    configDataBase.dbConfig.database,
    configDataBase.dbConfig.user,
    configDataBase.dbConfig.password,
    {
        host: configDataBase.dbConfig.host,
        dialect: configDataBase.dbConfig.dialect,
        port: configDataBase.dbConfig.port,
        logging: configDataBase.dbConfig.logging
    }
);

sequelize
  .authenticate()
  .then(() => {
    // console.log(
    //   '\x1b[32m',
    //   '[NODE SERVER] Connexion à la base de données réussie ✅'
    // );
  })
  .catch((err) => {
    console.log(
      "\x1b[31m",
      "[NODE SERVER] Connexion à la base de données ❌❌ échouée ❌❌",
      err
    );
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//? GestionAir
db.gestionAir = require(path.join(__dirname, "gestionAir/gestionAirModels"))(sequelize, Sequelize);
db.gestionAirData = require(path.join(__dirname, "gestionAir/gestionAirsDataModels"))(sequelize, Sequelize);
db.etalonnageAir = require(path.join(__dirname, "gestionAir/gestionAirEtalonnageModels"))(sequelize, Sequelize);
db.gestionAirEtatRelay = require(path.join(__dirname, "gestionAir/gestionAirEtatRelayModels"))(sequelize, Sequelize);
db.gestionCourbes = require(path.join(__dirname, "courbes/gestionCourbesModels"))(sequelize, Sequelize);
db.gestionAirVannes = require(path.join(__dirname, "gestionAir/gestionAirVannesModels"))(sequelize, Sequelize);

//* -----------------------------------------------------------------
//? Gestion Humidité
db.gestionHum = require(path.join(__dirname, "gestionHum/gestionHumModels"))(sequelize, Sequelize);
db.gestionHumData = require(path.join(__dirname, "gestionHum/gestionHumDataModels"))(sequelize, Sequelize);
db.etalonnageSec = require(path.join(__dirname, "gestionHum/gestionHumEtalonnageSecModels"))(sequelize, Sequelize);
db.etalonnageHum = require(path.join(__dirname, "gestionHum/gestionHumEtalonnageHumModels"))(sequelize, Sequelize);

//* -----------------------------------------------------------------
//? Gestion Co2
db.gestionCo2 = require(path.join(__dirname, "gestionCo2/gestionCo2Models"))(sequelize, Sequelize);
db.gestionCo2Data = require(path.join(__dirname, "gestionCo2/gestionCo2DataModels"))(sequelize, Sequelize);

//* -----------------------------------------------------------------
//? Gestion des logs
db.gestionLogsBack = require(path.join(__dirname, "logsModels/gestionLogsModels"))(sequelize, Sequelize);

//* -----------------------------------------------------------------
//? Gestion eau au sol
db.gestionEtatBoutonRelayEauAuSol = require(path.join(__dirname, "relayEauAuSol/relayEauAuSolModels"))(sequelize, Sequelize);

//* -----------------------------------------------------------------
//? Gestion substrat
db.gestionSubstrat = require(path.join(__dirname, "gestionSubstrat/gestionSubstratModels"))(sequelize, Sequelize);
db.gestionSubstratData = require(path.join(__dirname, "gestionSubstrat/gestionSubstratDataModels"))(sequelize, Sequelize);

module.exports = db;
