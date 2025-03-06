const configDataBase = require("../config/dbConfig");
const Sequelize = require("sequelize");

//? Table Gestion air.

let tableName = "gestion_courbes";

const sql = `
CREATE TABLE IF NOT EXISTS gestion_courbes (
  id INT AUTO_INCREMENT,
  dateDemarrageCycle DATE,
  createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY(id)
)`;

//? -------------------------------------------------

//* Connexion à la base de données avec Sequelize
const db = new Sequelize(
  configDataBase.dbConfig.database,
  configDataBase.dbConfig.username,
  configDataBase.dbConfig.password,
  {
      host: configDataBase.dbConfig.host,
      dialect: configDataBase.dbConfig.dialect,
      port: configDataBase.dbConfig.port,
      logging: configDataBase.dbConfig.logging
  }
);

//* Fonction pour tester la connexion
const connectToDatabase = () => {
return db.authenticate()
  .then(() => {
    console.log("Connexion à la base de donnée réussie 👍");
  })
  .catch((err) => {
    console.error("Erreur lors de la connexion à la base de données:", err);
    throw err;
  });
};

//* Fonction pour créer la table
const createTable = () => {
return db.query(sql)
  .then((result) => {
    console.log("Table " + tableName + " créée ou déjà existante 👍 :", result);
    return result;
  })
  .catch((err) => {
    console.error("Erreur lors de la création de la table " + tableName, err);
    throw err;
  });
};

//* Fonction principale
const run = async () => {
try {
  await connectToDatabase();
  await createTable();
} catch (err) {
  console.error("Une erreur s'est produite:", err);
  process.exit(1); // Quitte le processus avec un code d'erreur
} finally {
  await db.close()
    .then(() => console.log("Connexion à la base de données fermée."))
    .catch((err) => console.error("Erreur lors de la fermeture de la connexion:", err));
}
};

run();