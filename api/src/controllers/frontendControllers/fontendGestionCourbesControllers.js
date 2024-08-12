const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../../models");
require("dotenv").config();

//! Gestion Air.
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
//! ---------------------------------------------

//! Gestion Humidité.
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
//! ---------------------------------------------

//! Gestion Co2.
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//! ---------------------------------------------

const gestionCourbesModels = db.gestionCourbes;
//! ---------------------------------------------

const dateDuJour = new Date();

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

    const nombreDeJourDuCycle = Math.floor(
      (dateDuJour - dateDemarrageCycle) / (1000 * 60 * 60 * 24)
    );

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

exports.dateDemarrageCycle = async (req, res) => {
  try {
    await gestionCourbesModels.create({
      dateDemarrageCycle: req.body.dateDemarrageCycle,
    });

    res.status(200).json({
      message: "La date de démarrage du cycle a été enregistrée",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//?--------------------------------------------------------------

//! Construction du graphique température air.

exports.getTemperatureAirCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

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

//? --------------------------------------------------------------

//? Construction du graphique température air consigne.

exports.getConsigneAirCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const consigneAirCourbe = await gestionAirsDataModels.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", tauxHumiditeCourbe);

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

//? --------------------------------------------------------------

//! Construction du taux humidité.

exports.getTauxHumiditeCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const tauxHumiditeCourbe = await gestionHumModels.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", tauxHumiditeCourbe);

    if (tauxHumiditeCourbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ tauxHumiditeCourbe });
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

//? --------------------------------------------------------------

//? Construction du graphique température air consigne.

exports.getConsigneHumiditeCourbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const consigneHumiditeCourbeCourbe = await gestionHumDataModels.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", tauxHumiditeCourbe);

    if (consigneHumiditeCourbeCourbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ consigneHumiditeCourbeCourbe });
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

//? --------------------------------------------------------------

//! Construction de la courbe taux Co2.

//? Récupération du taux De Co2.

exports.getTauxCo2Courbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const tauxCo2Courbe = await gestionCo2Models.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", tauxCo2Courbe);

    if (tauxCo2Courbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ tauxCo2Courbe });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de Co2 : ",
      error
    );
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des données Co2",
    });
  }
};

//? --------------------------------------------------------------

//? Récupération des Datas Co2.

exports.getDataCo2Courbe = async (req, res) => {
  try {
    const dateDemarrageCycle = await recuperationDateDemarrageCycle();

    if (!dateDemarrageCycle) {
      throw new Error("Date de démarrage du cycle non trouvée.");
    }

    const consigneCo2Courbe = await gestionCo2Models.findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDemarrageCycle, dateDuJour],
        },
      },
    });

    // console.log("Données de température récupérées : ", tauxCo2Courbe);

    if (consigneCo2Courbe.length === 0) {
      console.warn("Aucune donnée récupérée entre ces dates.");
    }

    res.status(200).json({ consigneCo2Courbe });
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

//? --------------------------------------------------------------
