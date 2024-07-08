const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Table relay eau au sol.

const tableName = "relay_eau_au_sol";

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

const dropTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `DROP TABLE IF EXISTS ${tableName}`;

    db.query(sql, (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la suppression de la table " + tableName,
          err
        );
        return reject(err);
      }
      console.log(
        "Table " + tableName + " supprimée ou n'existait pas 👍:",
        result
      );
      resolve(result);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    await dropTable();
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
