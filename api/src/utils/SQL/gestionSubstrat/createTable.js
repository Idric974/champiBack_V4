const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Table Gestion substrats.

// let tableName = "gestion_substrats";

// const sql = `
// CREATE TABLE gestion_substrats (
// id INT AUTO_INCREMENT,
// temperatureSubstrat FLOAT,
// days FLOAT,
// heures FLOAT,
// valeurAxeX VARCHAR(255),
// jourDuCycle VARCHAR(255),
// createdAt DATE,
// updatedAt DATE,
// PRIMARY KEY(id)
// )`;

//? -------------------------------------------------

//? Table Gestion substrats datas.

// let tableName = "gestion_substrats_data";

// const sql = `
// CREATE TABLE gestion_substrats_datas (id int auto_increment,
// temperatureSubstratMax FLOAT,
// temperatureSubstratMin FLOAT,
// days INTEGER,
// heures INTEGER,
// createdAt DATE,
// updatedAt DATE,
// primary key(id))`;

//? -------------------------------------------------

//? Table Gestion airs etalonnages.

// let tableName = "gestion_substrats_etalonnage";

// const sql = `
// CREATE TABLE gestion_airs_etalonnages (id int auto_increment,
// etalonnageAir FLOAT,
// createdAt DATE,
// updatedAt DATE,
// primary key(id))`;

//? -------------------------------------------------

//? Table Gestion airs etat relays.

let tableName = "gestion_airs_etat_relays";

const sql = `
CREATE TABLE gestion_airs_etat_relays (id int auto_increment,
etatRelay FLOAT,
createdAt DATE,
updatedAt DATE,
primary key(id))`;

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
