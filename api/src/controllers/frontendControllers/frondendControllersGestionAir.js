const Sequelize = require("sequelize");
const db = require("../../models");
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionAirVannesModels = db.gestionAirVannes;

exports.getTemperatureAir = (req, res) => {
  let gestionAirTempId;
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

exports.getDataAir = (req, res) => {
  let gestionAirId;
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

exports.postConsigneAir = (req, res) => {};
exports.postPasEtObjectifAir = (req, res) => {};
