const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

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

const db = mysql.createConnection(configDataBase.dbConfig);

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Erreur lors de la connexion à la base de données:", err);
        return reject(err);
      }
      console.log("Connexion à la base de donnée réussie 👍");
      resolve();
    });
  });
};

const createTable = () => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table" + tableName,
          +err
        );

        return reject(err);
      }
      console.log(
        "Table " + tableName + " créée ou déjà existante 👍 :",
        result
      );
      resolve(result);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    await createTable();
  } catch (err) {
    console.error("Une erreur s'est produite:", err);
    process.exit(1); // Quitte le processus avec un code d'erreur
  } finally {
    db.end((err) => {
      if (err) {
        console.error("Erreur lors de la fermeture de la connexion:", err);
      } else {
        console.log("Connexion à la base de données fermée.");
      }
    });
  }
};

run();
