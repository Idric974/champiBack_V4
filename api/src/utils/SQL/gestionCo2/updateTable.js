const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Table Gestion Co2.

// const tableName = "gestion_co2s";

// const newData = {
//   tauxCo2: 21,
//   deltaAir: 22,
//   daysCo2: 23,
//   heuresCo2: 24,
//   consigne: 25,
//   valeurAxeX: 26,
//   jourDuCycle: 27,
//   valeurAxeX: 28,
//   jourDuCycle: new Date(),
// };

//? -------------------------------------------------

//? Table Gestion Co2 Datas.

const tableName = "gestion_co2s_datas";

const newData = {
  consigneCo2: 21,
  pasCo2: 22,
  objectifCo2: 23,
};

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

const updateTable = (id, newData) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE ${tableName} SET ? WHERE id = ?`;

    db.query(sql, [newData, id], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la mise à jour de la table " + tableName,
          err
        );
        return reject(err);
      }
      console.log("Table " + tableName + " mise à jour 👍:", result);
      resolve(result);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();

    // Exemple de données à mettre à jour
    const id = 1; // L'identifiant de la ligne à mettre à jour

    await updateTable(id, newData);
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
