const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD_CR,
  database: process.env.DB_NAME,
  dialect: process.env.SQL_DIALECT,
  logging: false,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connexion à la base de donnée réussie");

  // Liste des requêtes de création de tables avec IF NOT EXISTS
  const createTableQueries = [
    "CREATE TABLE IF NOT EXISTS gestion_airs (id int auto_increment, temperatureAir FLOAT, deltaAir FLOAT, days FLOAT, heures FLOAT, etatRelay FLOAT, actionRelay FLOAT, consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_airs_datas (id int auto_increment, consigneAir FLOAT, pasAir FLOAT, objectifAir FLOAT, deltaAir FLOAT, days INTEGER, heures INTEGER, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_airs_etalonnages (id int auto_increment, etalonnageAir FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_airs_etat_relays (id int auto_increment, etatRelay FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_hums (id int auto_increment, tauxHumidite FLOAT, deltaHum FLOAT, valeursMesureSec180 FLOAT, valeursMesureHum90 FLOAT, daysHum INTEGER, heuresHum INTEGER, createdAt DATE, consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_hums_datas (id int auto_increment, consigneHum FLOAT, pasHum FLOAT, objectifHum FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_hums_etalonnage_secs (id int auto_increment, etalonnageSec FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_hums_etalonnage_hums (id int auto_increment, etalonnageHum FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_co2s (id int auto_increment, tauxCo2 FLOAT, deltaCo2 FLOAT, daysCo2 FLOAT, heuresCo2 FLOAT, consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_co2s_datas (id int auto_increment, consigneCo2 FLOAT, pasCo2 FLOAT, objectifCo2 FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_logs (id int auto_increment, fichier TEXT(255), nomModule TEXT(255), typeErreur TEXT(255), createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_courbes (id int auto_increment, dateDemarrageCycle DATE, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS relay_eau_au_sol (id int auto_increment, etatRelayEauAuSol INTEGER, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_substrats (id int auto_increment, temperatureSubstrat FLOAT, days FLOAT, heures FLOAT, etatRelay FLOAT, actionRelay FLOAT, valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_substrats_datas (id int auto_increment, consigneMaxDataSubstrat FLOAT, consigneMinDataSubstrat FLOAT, createdAt DATE, updatedAt DATE, primary key(id))",
    "CREATE TABLE IF NOT EXISTS gestion_vannes (id int auto_increment, vanneActive TEXT, createdAt DATE, updatedAt DATE, primary key(id))",
  ];

  // Fonction pour exécuter les requêtes séquentiellement
  function createTables(queries, index = 0) {
    if (index < queries.length) {
      db.query(queries[index], function (err, result) {
        if (err) {
          console.error(
            `Erreur lors de la création de la table : ${err.message}`
          );
        } else {
          console.log(`Table créée ou déjà existante : ${queries[index]}`);
        }
        createTables(queries, index + 1);
      });
    } else {
      console.log("Toutes les tables ont été créées ou existent déjà");
      db.end(); // Fermer la connexion
    }
  }

  // Lancer la création des tables
  createTables(createTableQueries);
});
