const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../models");
require("dotenv").config();
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
const gestionCourbesModels = db.gestionCourbes;

//! Les fonctions.

const recuperationDateDemarrageCycle = async () => {
  try {
    // Récupérer le dernier id
    const idResult = await gestionCourbesModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      throw new Error("Aucun cycle trouvé");
    }

    // Récupérer la date de démarrage du cycle en utilisant l'id
    const result = await gestionCourbesModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!result || !result.dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée");
    }

    return result.dateDemarrageCycle;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la date de démarrage du cycle : ",
      error
    );
    throw error;
  }
};

//!--------------------------------------------------------------

//? GET Date de démarrage du Cycle.

exports.getDateDemarrageCycle = async (req, res) => {
  try {
    // Récupérer le dernier id
    const idResult = await gestionCourbesModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucun cycle trouvé" });
    }

    const dernierCycle = await gestionCourbesModels.findOne({
      where: { id: idResult.maxid },
    });

    // console.log("dernierCycle : ", dernierCycle);

    if (!dernierCycle || !dernierCycle.dateDemarrageCycle) {
      return res
        .status(404)
        .json({ error: "Date de démarrage du cycle non trouvée" });
    }

    const dateDemarrageCycle = new Date(dernierCycle.dateDemarrageCycle);
    const jour = String(dateDemarrageCycle.getDate()).padStart(2, "0");
    const mois = String(dateDemarrageCycle.getMonth() + 1).padStart(2, "0");
    const annee = dateDemarrageCycle.getFullYear();
    const myDateDemarrageCycle = `${jour}-${mois}-${annee}`;

    const dateDuJour = new Date();
    const nombreDeJourDuCycle = Math.floor(
      (dateDuJour - dateDemarrageCycle) / (1000 * 60 * 60 * 24)
    );

    // console.log("Date de démarrage du cycle : ", myDateDemarrageCycle);
    // console.log("Nombre de jours du cycle : ", nombreDeJourDuCycle);

    res.status(200).json({ nombreDeJourDuCycle, myDateDemarrageCycle });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la date de démarrage du cycle :",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//? --------------------------------------------------------------

//? POST Date de démarrage du Cycle.

exports.dateDemarrageCycle = (req, res) => {
  //
  gestionCourbesModels
    .create({
      dateDemarrageCycle: req.body.dateDemarrageCycle,
    })
    .then(() =>
      res.status(200).json({
        message: "La date de démarrage du cycle à été enregistrée",
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};

//?--------------------------------------------------------------

//? Construction du graphique température air.

exports.getTemperatureAirCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const dateDuJour = new Date();
    // console.log("Date de démarrage du cycle : ", dateDemarrageCycle);
    // console.log("Date du jour : ", dateDuJour);

    const temperatureAirCourbe = await gestionAirModels.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", temperatureAirCourbe);

    if (temperatureAirCourbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ temperatureAirCourbe });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de température : ",
      error
    );
    res.status(500).json({
      error:
        "Erreur serveur lors de la récupération des données de température",
    });
  }
};

//? Construction du graphique température air consigne.

exports.getConsigneAirCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const dateDuJour = new Date();
    // console.log("Date de démarrage du cycle : ", dateDemarrageCycle);
    // console.log("Date du jour : ", dateDuJour);

    const consigneAirCourbe = await gestionAirsDataModels.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", temperatureAirCourbe);

    if (consigneAirCourbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ consigneAirCourbe });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de température : ",
      error
    );
    res.status(500).json({
      error:
        "Erreur serveur lors de la récupération des données de température",
    });
  }
};
