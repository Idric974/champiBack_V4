const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//* Les tables.
let tableName = "gestion_airs";
// let tableName = "gestion_airs_datas";
// let tableName = "gestion_airs_etalonnages";
// let tableName = "gestion_airs_etat_relays";

//* -------------------------------------------------

const db = mysql.createConnection(configDataBase.dbConfig);

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Erreur lors de la connexion à la base de données:", err);
        return reject(err);
      }
      console.log("Connexion à la base de donnée réussie ??");
      resolve();
    });
  });
};

const readTable = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${tableName} WHERE createdAt BETWEEN ? AND ?`;

    db.query(sql, [startDate, endDate], (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la lecture de la table " + tableName,
          err
        );
        return reject(err);
      }
      console.log("Contenu de la table " + tableName + " ??:", results);
      resolve(results);
    });
  });
};

const run = async () => {
  try {
    await connectToDatabase();

    // Dates à lire
    const startDate = "2024-07-25 00:00:00"; // Remplacez par la date de début souhaitée
    const endDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Date actuelle

    await readTable(startDate, endDate);
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
