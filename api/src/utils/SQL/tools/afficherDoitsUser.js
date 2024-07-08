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

const getUserPermissions = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.id, u.username, p.permission_name
      FROM users u
      JOIN user_permissions up ON u.id = up.user_id
      JOIN permissions p ON up.permission_id = p.id
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des droits utilisateurs:",
          err
        );
        return reject(err);
      }
      resolve(results);
    });
  });
};

const displayUserPermissions = (permissions) => {
  console.log("Droits des utilisateurs:");
  permissions.forEach((permission) => {
    console.log(
      `ID Utilisateur: ${permission.id}, Nom d'utilisateur: ${permission.username}, Permission: ${permission.permission_name}`
    );
  });
};

const run = async () => {
  try {
    await connectToDatabase();
    const permissions = await getUserPermissions();
    displayUserPermissions(permissions);
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
