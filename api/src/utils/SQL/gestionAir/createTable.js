const configDataBase = require("../config/dbConfig");
const Sequelize = require("sequelize");

//? Table Gestion air.

// let tableName = "gestion_airs";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_airs (
//   id INT AUTO_INCREMENT,
//   temperatureAir FLOAT,
//   deltaAir FLOAT,
//   days FLOAT,
//   heures FLOAT,
//   etatRelay FLOAT,
//   actionRelay FLOAT,
//   consigne VARCHAR(255),
//   valeurAxeX VARCHAR(255),
//   jourDuCycle VARCHAR(255),
//   createdAt DATE,
//   updatedAt DATE,
//   PRIMARY KEY(id)
// )`;

//? -------------------------------------------------

//? Table Gestion Air Datas.

// let tableName = "gestion_airs_datas";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_airs_datas (
//   id INT AUTO_INCREMENT,
//   consigneAir FLOAT,
//   pasAir FLOAT,
//   objectifAir FLOAT,
//   deltaAir FLOAT,
//   days INT,
//   heures INT,
//   createdAt DATE,
//   updatedAt DATE,
//   PRIMARY KEY(id)
// )`;

//? -------------------------------------------------

//? Table Gestion air étalonnages.

// let tableName = "gestion_airs_etalonnages";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_airs_etalonnages (
//   id INT AUTO_INCREMENT,
//   etalonnageAir FLOAT,
//   createdAt DATE,
//   updatedAt DATE,
//   PRIMARY KEY(id)
// )`;

//? -------------------------------------------------

//? Table Gestion air etat relays.

// let tableName = "gestion_airs_etat_relays";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_airs_etat_relays (
//   id INT AUTO_INCREMENT,
//   etatRelay FLOAT,
//   createdAt DATE,
//   updatedAt DATE,
//   PRIMARY KEY(id)
// )`;

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
const connectToDatabase = async () => {
  try {
    await db.authenticate();
    console.log("Connexion à la base de donnée réussie 👍");
  } catch (err) {
    console.error("Erreur lors de la connexion à la base de données:", err);
    throw err;
  }
};

//* Fonction pour créer la table
const createTable = async () => {
  try {
    const result = await db.query(sql);
    console.log("Table " + tableName + " créée ou déjà existante 👍 :", result);
  } catch (err) {
    console.error("Erreur lors de la création de la table " + tableName, err);
    throw err;
  }
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
    await db.close();  // Fermeture correcte de la connexion avec Sequelize
    console.log("Connexion à la base de données fermée.");
  }
};

run();