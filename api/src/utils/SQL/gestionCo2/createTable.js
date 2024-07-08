const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

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

// let tableName = "gestion_co2s_datas";

// const sql = `
// CREATE TABLE IF NOT EXISTS gestion_co2s_datas (
//   id INT AUTO_INCREMENT,
//   consigneCo2 FLOAT,
//   pasCo2 FLOAT,
//   objectifCo2 FLOAT,
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
