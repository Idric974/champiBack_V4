const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Table Gestion air.

// const tableName = "gestion_airs";

// const data = {
//   temperatureAir: 0,
//   deltaAir: 0,
//   days: 0,
//   heures: 0,
//   etatRelay: 0,
//   actionRelay: 0,
//   consigne: 0,
//   valeurAxeX: 0,
//   jourDuCycle: 0,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

//? -------------------------------------------------

//? Table Gestion Air Datas.

// let tableName = "gestion_airs_datas";

// const data = {
//   consigneAir: 0,
//   pasAir: 0,
//   objectifAir: 0,
//   deltaAir: 0,
//   days: 0,
//   heures: 0,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

//? -------------------------------------------------

//? Table Gestion air étalonnages.

// let tableName = "gestion_airs_etalonnages";

// const data = {
//   etalonnageAir: 0,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

//? -------------------------------------------------

//? Table Gestion air etat relays.

// let tableName = "gestion_airs_etat_relays";

// const data = {
//   etatRelay: 0,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

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

const insertData = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ${tableName} SET ?`;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de l'insertion des données dans la table " + tableName,
          err
        );
        return reject(err);
      }
      console.log(
        "Données insérées dans la table " + tableName + " 👍:",
        result
      );
      resolve(result);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();

    await insertData(data);
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
