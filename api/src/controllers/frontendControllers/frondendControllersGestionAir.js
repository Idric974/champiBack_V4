const Sequelize = require("sequelize");
const db = require("../../models");
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionAirVannesModels = db.gestionAirVannes;

//? Récupérer la température de l'air.

exports.getTemperatureAir = (req, res) => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((temperatureAir) => {
          res.status(200).json({ temperatureAir });
        });
    });
};

//? Récupérer le pas et la consigne.

exports.getPasEtConsigneTemperatureAir = (req, res) => {
  gestionAirsDataModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirsDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((datatemperatureAir) => {
          res.status(200).json({ datatemperatureAir });
        });
    });
};

//? Poster la consigne.

exports.postConsigneTemperatureAir = (req, res) => {
  let consigneAir = req.body.consigneAir;
  console.log("Consigne Temperature Air ", consigneAir);

  gestionAirsDataModels
    .create({
      consigneAir: req.body.consigneAir,
    })
    .then(() =>
      res.status(200).json({
        message: "Consigne Air enregitrée dans la base gestion_airs",
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};

//? Poster le pas et l'objectif'.

exports.postPasEtConsigneTemperatureAir = (req, res) => {
  let pasAir = req.body.pasAir;
  console.log("Le pas Air : " + pasAir);

  let objectifAir = req.body.objectifAir;
  console.log("L objectif Air : " + objectifAir);

  let lastId;

  gestionAirsDataModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirsDataModels
        .update(
          { pasAir: pasAir, objectifAir: objectifAir },
          { where: { id: lastId } }
        )

        .then(() =>
          res.status(200).json({
            message:
              "Pas et objectif enregitrés dans la base gestion_airs_data",
          })
        )

        .catch((err) => console.log(err));
    });
};

//? Poster de la vanne active air.

exports.postVanneActiveAir = (req, res) => {
  let vanneActive = req.body.vanneActive;
  console.log("Vanne active air", vanneActive);

  gestionAirVannesModels
    .create({
      vanneActive: req.body.vanneActive,
    })
    .then(() =>
      res.status(200).json({
        message: "Vanne active air dans la base",
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};
