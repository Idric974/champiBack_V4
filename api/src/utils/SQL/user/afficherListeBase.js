const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Les tables.
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

const listTables = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${configDataBase.dbConfig.database}'`;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Erreur lors de la lecture des tables:", err);
        return reject(err);
      }
      console.log("Liste des tables 👍:", results.map(row => row.table_name));
      resolve(results);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    await listTables();
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
