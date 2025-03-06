const configDataBase = require("../config/dbConfig");
const Sequelize = require("sequelize");

//? Table Gestion Co2.

// let tableName = "gestion_co2s";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_co2s (
//   id INT AUTO_INCREMENT,
//   tauxCo2 FLOAT,
//   deltaAir FLOAT,
//   daysCo2 FLOAT,
//   heuresCo2 FLOAT,
//   consigne VARCHAR(255),
//   valeurAxeX VARCHAR(255),
//   jourDuCycle VARCHAR(255),
//   createdAt DATE,
//   updatedAt DATE,
//   PRIMARY KEY(id)
// )`;

//? -------------------------------------------------

//? Table Gestion Co2 Datas.

let tableName = "gestion_co2s_datas";

const sql = `
CREATE TABLE IF NOT EXISTS gestion_co2s_datas (
  id INT AUTO_INCREMENT,
  consigneCo2 FLOAT,
  pasCo2 FLOAT,
  objectifCo2 FLOAT,
  createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY(id)
)`;

//? -------------------------------------------------

//* Connexion à la base de données avec Sequelize
const db = new Sequelize(
  configDataBase.dbConfig.database,
  configDataBase.dbConfig.username,
  configDataBase.dbConfig.password,
  {
      host: configDataBase.dbConfig.host,
      dialect: configDataBase.dbConfig.dialect,
      port: configDataBase.dbConfig.port,
      logging: configDataBase.dbConfig.logging
  }
);

//* Fonction pour tester la connexion
const connectToDatabase = () => {
return db.authenticate()
  .then(() => {
    console.log("Connexion à la base de donnée réussie 👍");
  })
  .catch((err) => {
    console.error("Erreur lors de la connexion à la base de données:", err);
    throw err;
  });
};

//* Fonction pour créer la table
const createTable = () => {
return db.query(sql)
  .then((result) => {
    console.log("Table " + tableName + " créée ou déjà existante 👍 :", result);
    return result;
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table " + tableName, err);
    throw err;
  });
};

//* Fonction principale
const run = async () => {
try {
  await connectToDatabase();
  await createTable();
} catch (err) {
  console.error("Une erreur s'est produite:", err);
  process.exit(1); // Quitte le processus avec un code d'erreur
} finally {
  await db.close()
    .then(() => console.log("Connexion à la base de données fermée."))
    .catch((err) => console.error("Erreur lors de la fermeture de la connexion:", err));
}
};

run();