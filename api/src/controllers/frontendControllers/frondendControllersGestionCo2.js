const Sequelize = require("sequelize");
const db = require("../../models");
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;

//? Récupérer la température de l'air.

exports.getTauxCo2 = async (req, res) => {
  try {
    const idResult = await gestionCo2Models.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Taux de Co2 trouvé" });
    }

    const dataCo2 = await gestionCo2Models.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataCo2) {
      return res.status(404).json({
        error: "Le taux de Co2 avec l'ID spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ dataCo2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? Récupérer des datas Co2.

exports.getDatasCo2 = async (req, res) => {
  try {
    const idResult = await gestionCo2DataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucune donnée de Co2 trouvée." });
    }

    const dataCo2 = await gestionCo2DataModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataCo2) {
      return res.status(404).json({
        error: "La donnée de data Co2 avec l'ID spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ dataCo2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? Poster la consigne Co2.

exports.postConsigneCo2 = async (req, res) => {
  try {
    const consigneCo2 = req.body.consigneCo2;
    console.log("Consigne Co2 ", consigneCo2);

    await gestionCo2DataModels.create({
      consigneCo2: req.body.consigneCo2,
    });

    res.status(200).json({
      message: "Consigne Co2 enregistrée dans la base gestion_airs",
      consigneCo2,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//? -------------------------------------------------

//? Poster les datas de Co2'.

exports.postDatasCo2 = async (req, res) => {
  try {
    const { pasCo2, objectifCo2 } = req.body;
    console.log("Data Co2 : " + { pasCo2, objectifCo2 });

    // Trouver l'ID maximum
    const idResult = await gestionCo2DataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucun enregistrement trouvé." });
    }

    const lastId = idResult.maxid;

    // Mettre à jour l'enregistrement avec le dernier ID
    await gestionCo2DataModels.update(
      { pasCo2: pasCo2, objectifCo2: objectifCo2 },
      { where: { id: lastId } }
    );

    res.status(200).json({
      message: "Pas et objectif enregistrés dans la base gestion_Co2s_data",
      pasCo2,
      objectifCo2,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? -------------------------------------------------
