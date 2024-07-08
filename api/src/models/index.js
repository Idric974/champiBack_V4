const Sequelize = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize({
  host: '127.0.0.1',
  username: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
  dialect: 'mysql',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log(
      '\x1b[32m',
      '[NODE SERVER] Connexion à la base de données réussie'
    );
  })

  .catch((err) => {
    console.log(
      '\x1b[32m',
      '[NODE SERVER] Connexion à la base de données ❌❌ échouée ❌❌',
      err
    );
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//? GestionAir

// Mesure.
db.gestionAir = require('./gestionAir/gestionAirModels')(sequelize, Sequelize);

// Data.
db.gestionAirData = require('./gestionAir/gestionAirsDataModels')(
  sequelize,
  Sequelize
);

// Etalonnage.
db.etalonnageAir = require('./gestionAir/gestionAirEtalonnageModels')(
  sequelize,
  Sequelize
);

// Etat relay.
db.gestionAirEtatRelay = require('./gestionAir/gestionAirEtatRelayModels')(
  sequelize,
  Sequelize
);

// Courbes.
db.gestionCourbes = require('./courbes/gestionCourbesModels')(
  sequelize,
  Sequelize
);

// Vannes.
db.gestionAirVannes =
require('./gestionAir/gestionAirVannesModels')(sequelize, Sequelize);

//* -----------------------------------------------------------------

//? Gestion Humidité.

// Mesure.
db.gestionHum = require('./gestionHum/gestionHumModels')(sequelize, Sequelize);

// Data.
db.gestionHumData = require('./gestionHum/gestionHumDataModels')(
  sequelize,
  Sequelize
);

// Etalonnage.
db.etalonnageSec = require('./gestionHum/gestionHumEtalonnageSecModels')(
  sequelize,
  Sequelize
);

db.etalonnageHum = require('./gestionHum/gestionHumEtalonnageHumModels')(
  sequelize,
  Sequelize
);

//* -----------------------------------------------------------------

//? Gestion Co2.

// Mesure.
db.gestionCo2 = require('./gestionCo2/gestionCo2Models')(sequelize, Sequelize);

// Data.
db.gestionCo2Data = require('./gestionCo2/gestionCo2DataModels')(
  sequelize,
  Sequelize
);

//? Gestion des log.

// Logs du back
db.gestionLogsBack = require('./logsModels/gestionLogsModels')(
  sequelize,
  Sequelize
);

//? Gestion eau au sol.

db.gestionEtatBoutonRelayEauAuSol =
  require('./relayEauAuSol/relayEauAuSolModels')(sequelize, Sequelize);

//? Gestion substrat.

db.gestionSubstrat =
  require('./gestionSubstrat/gestionSubstratModels')(sequelize, Sequelize);

db.gestionSubstratData =
  require('./gestionSubstrat/gestionSubstratDataModels')(sequelize, Sequelize);

module.exports = db;
