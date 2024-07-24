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

//? GET Date de démarrage du Cycle.

exports.getDateDemarrageCycle = (req, res) => {
  //
  gestionCourbesModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionCourbesModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((dateDemarrageCycle) => {
          // console.log(
          //   'Date de démarrage du cycle =========> ' +
          //     JSON.stringify(dateDemarrageCycle.dateDemarrageCycle)
          // );

          res.status(200).json({ dateDemarrageCycle });
        });
    });
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
