const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

const databaseName = "champyresi";

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

const listTables = (databaseName) => {
  return new Promise((resolve, reject) => {
    const sql = `SHOW TABLES FROM ${mysql.escapeId(databaseName)}`;
    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération de la liste des tables:",
          err
        );
        return reject(err);
      }
      resolve(results);
    });
  });
};

const displayTables = (tables, databaseName) => {
  console.log(`Liste des tables dans la base de données ${databaseName}:`);
  tables.forEach((table) => {
    console.log("⭐ :", table[`Tables_in_${databaseName}`]);
  });
};

const run = async (databaseName) => {
  try {
    await connectToDatabase();
    const tables = await listTables(databaseName);
    displayTables(tables, databaseName);
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

run(databaseName);
