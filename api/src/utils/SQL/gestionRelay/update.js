const configDataBase = require("../config/dbConfig");
const mysql = require("mysql");

//? Table relay eau au sol.

const tableName = "relay_eau_au_sol";

const newData = {
  etatRelayEauAuSol: 31,
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

const getLastInsertId = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM ${tableName} ORDER BY id DESC LIMIT 1`;

    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération du dernier id inséré dans la table " +
            tableName,
          err
        );
        return reject(err);
      }
      if (results.length === 0) {
        return reject(
          new Error("Aucun enregistrement trouvé dans la table " + tableName)
        );
      }
      resolve(results[0].id);
    });
  });
};

const updateTable = (id, newData) => {
  console.log("Dernier id =>", id);
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

    // Récupérer le dernier ID inséré
    const lastId = await getLastInsertId();

    // Exemple de données à mettre à jour

    await updateTable(lastId, newData);
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
