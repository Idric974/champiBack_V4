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

const listUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, username, email, created_at FROM users";
    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération de la liste des utilisateurs:",
          err
        );
        return reject(err);
      }
      resolve(results);
    });
  });
};

const displayUsers = (users) => {
  console.log("Liste des utilisateurs:");
  users.forEach((user) => {
    console.log(
      `ID: ${user.id}, Nom d'utilisateur: ${user.username}, Email: ${user.email}, Créé le: ${user.created_at}`
    );
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    const users = await listUsers();
    displayUsers(users);
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
