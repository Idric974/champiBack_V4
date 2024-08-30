const Sequelize = require("sequelize");
const db = require("../../models");
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionAirVannesModels = db.gestionAirVannes;

//? Récupérer la température de l'air.

exports.getTemperatureAir = async (req, res) => {
  try {
    const idResult = await gestionAirModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucune température trouvée." });
    }

    const dataTemperatureAir = await gestionAirModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataTemperatureAir) {
      return res.status(404).json({
        error: "La température avec l'ID spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ dataTemperatureAir });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? Récupérer le pas et la consigne.

exports.getPasEtConsigneTemperatureAir = async (req, res) => {
  try {
    const idResult = await gestionAirsDataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res
        .status(404)
        .json({ error: "Aucune donnée de température trouvée." });
    }

    const datatemperatureAir = await gestionAirsDataModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!datatemperatureAir) {
      return res.status(404).json({
        error:
          "La donnée de température avec l'ID spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ datatemperatureAir });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? Poster la consigne.

exports.postConsigneTemperatureAir = async (req, res) => {
  try {
    const consigneAir = req.body.consigneAir;
    console.log("Consigne Temperature Air ", consigneAir);

    await gestionAirsDataModels.create({
      consigneAir: req.body.consigneAir,
    });

    res.status(200).json({
      message: "Consigne Air enregistrée dans la base gestion_airs",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//? Poster le pas et l'objectif'.

exports.postPasEtConsigneTemperatureAir = async (req, res) => {
  try {
    const { pasAir, objectifAir } = req.body;
    console.log("Datas : ", { objectifAir, pasAir });

    // Trouver l'ID maximum
    const idResult = await gestionAirsDataModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucun enregistrement trouvé." });
    }

    const lastId = idResult.maxid;

    // Mettre à jour l'enregistrement avec le dernier ID
    await gestionAirsDataModels.update(
      { pasAir: pasAir, objectifAir: objectifAir },
      { where: { id: lastId } }
    );

    res.status(200).json({
      message: "Pas et objectif enregistrés dans la base gestion_airs_data",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

//? Poster de la vanne active air.

exports.postVanneActiveAir = async (req, res) => {
  try {
    const vanneActive = req.body.vanneActive;
    // console.log("Vanne active air", vanneActive);

    await gestionAirVannesModels.create({
      vanneActive: vanneActive,
    });

    res.status(200).json({
      message: "Vanne active air enregistrée dans la base",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

//? Fermeture de la vanne froid humidité ou sec pour 40 sec.

const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

exports.postFermetureVanneAir = async (req, res) => {
  let gpioPin = req.body.pin;
  // console.log("gpioPin ==>", gpioPin);

  try {
    // Exécuter le script gpioOn.py
    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOn.py ${gpioPin}`
    );
    if (stderrOn) {
      console.error(`Error output (gpioOn.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOn.py): ${stdoutOn}`);

    // Attendre 40 secondes avant d'exécuter le script gpioOff.py
    await new Promise((resolve) => setTimeout(resolve, 40000));

    // Exécuter le script gpioOff.py
    const { stdout: stdoutOff, stderr: stderrOff } = await execAsync(
      `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOff.py ${gpioPin}`
    );
    if (stderrOff) {
      console.error(`Error output (gpioOff.py): ${stderrOff}`);
    }
    console.log(`Script output (gpioOff.py): ${stdoutOff}`);

    // Envoyer la réponse
    res.status(200).json({ message: "Fermeture de la vanne terminée" });
  } catch (error) {
    console.error(`Error executing script: ${error}`);
    res
      .status(500)
      .json({ message: "Erreur lors de l'exécution du script", error });
  }
};

//? Recupération de la vanne à utiliser.

exports.getVanneActive = async (req, res) => {
  try {
    const idResult = await gestionAirVannesModels.findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    });

    if (!idResult || !idResult.maxid) {
      return res.status(404).json({ error: "Aucune température trouvée." });
    }

    const dataVanneActive = await gestionAirVannesModels.findOne({
      where: { id: idResult.maxid },
    });

    if (!dataVanneActive) {
      return res.status(404).json({
        error: "La température avec l'ID spécifié n'a pas été trouvée.",
      });
    }

    res.status(200).json({ dataVanneActive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};
