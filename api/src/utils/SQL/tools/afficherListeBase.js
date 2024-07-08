const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

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

const listDatabases = () => {
  return new Promise((resolve, reject) => {
    const sql = "SHOW DATABASES";
    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération de la liste des bases de données:",
          err
        );
        return reject(err);
      }
      resolve(results);
    });
  });
};

const displayDatabases = (databases) => {
  console.log("Liste des bases de données:");
  databases.forEach((database) => {
    console.log("⭐ :", database.Database);
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    const databases = await listDatabases();
    displayDatabases(databases);
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
