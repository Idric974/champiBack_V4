const Sequelize = require("sequelize");
const db = require("../../models");
const gestionHumiditeModels = db.gestionHum;
const gestionHumiditeDataModels = db.gestionHumData;

//? Récupérer du taus d'humidité.

exports.getTauxHumidite = async (req, res) => {
  try {
    const idResult = await gestionHumiditeModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucun taux d'humidité trouvé." });
    }

    const dataTauxHumidite = await gestionHumiditeModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataTauxHumidite) {
      return res.status(404).json({
        error: "Le taux d'humidité avec l'id spécifié n'a pas été trouvé.",
      });
    }

    res.status(200).json({ dataTauxHumidite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? -------------------------------------------------

//? Récupération de la consigne Humidité.

exports.getConsigneHumidite = async (req, res) => {
  try {
    const idResult = await gestionHumiditeDataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res
        .status(404)
        .json({ error: "Aucune consigne d'humidité trouvée." });
    }

    const dataConsigneHumidite = await gestionHumiditeDataModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataConsigneHumidite) {
      return res.status(404).json({
        error: "La consigne d'humidité avec l'id spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ dataConsigneHumidite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? -------------------------------------------------

//? Récupération de la consigne Humidité.

exports.postConsigneHumidite = async (req, res) => {
  try {
    console.log("consigneHum ", req.body.consigneHum);

    await gestionHumiditeDataModels.create({
      consigneHum: req.body.consigneHum,
    });

    res.status(200).json({
      message: "Consigne Humidité enregitrée dans la base gestion_airs",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//? -------------------------------------------------

//? Post du pas et de l'objectif humidité.

exports.postPasetObjectifHumidite = async (req, res) => {
  try {
    const pasHum = req.body.pasHum;
    const objectifHum = req.body.objectifHum;
    //
    console.log("DATA : ", { pasHum, objectifHum });

    const idResult = await gestionHumiditeDataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucun enregistrement trouvé." });
    }

    const lastId = idResult.maxid;

    await gestionHumiditeDataModels.update(
      { pasHum: pasHum, objectifHum: objectifHum },
      { where: { id: lastId } }
    );

    res.status(200).json({
      message: "Pas et objectif enregitrés",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? -------------------------------------------------
