const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//* Les tables.

// let tableName = "gestion_substrats_datas";
// let tableName = "gestion_airs_etalonnages";
// let tableName = "gestion_airs_etat_relays";
// let tableName = "gestion_substrats";

//* -------------------------------------------------

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

const readTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${tableName}`;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la lecture de la table " + tableName,
          err
        );
        return reject(err);
      }
      console.log("Contenu de la table " + tableName + " 👍:", results);
      resolve(results);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    await readTable();
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
