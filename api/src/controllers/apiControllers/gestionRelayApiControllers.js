const Sequelize = require("sequelize");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const db = require("../../models");
const gestionAirModels = db.gestionAir;
const relayEauAuSol = db.gestionEtatBoutonRelayEauAuSol;

//! Functions.

//? Activation du relais.

let pinAActiver;

const gpioActionOn = async () => {
  try {
    //* Exécuter le script gpioOn.py

    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiback_V4/api/src/utils/python/gpioOn.py ${pinAActiver}`
    );
    if (stderrOn) {
      console.error(`Error output (gpioOn.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOn.py): ${stdoutOn}`);
  } catch (error) {
    console.error(`Error executing script: ${error}`);
  }
};

//? Déactivation du relais.

const gpioActionOff = async () => {
  try {
    //* Exécuter le script gpioOn.py

    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiback_V4/api/src/utils/python/gpioOff.py ${pinAActiver}`
    );
    if (stderrOn) {
      console.error(`Error output (gpioOff.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOff.py): ${stdoutOn}`);
  } catch (error) {
    console.error(`Error executing script: ${error}`);
  }
};

//? Mise à jour etat Relay.

let etatRelay;

miseAjourEtatRelay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirModels
        .update({ etatRelay: etatRelay }, { where: { id: lastId } })

        .then(function (result) {
          //console.log("miseAjourEtatRelay =======> " + result);
        })

        .catch((err) => console.log(err));
    });
};

//? -------------------------------------------------

//? Mise à jour Action Relay.

miseAjourActionRelay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirModels
        .update({ actionRelay: actionRelay }, { where: { id: lastId } })

        .then(function (result) {
          // console.log("miseAjourActionRelay =======> " + result);
        })

        .catch((err) => console.log(err));
    });
};

//? -------------------------------------------------

//? Recuperation état Relay.

let valEtatRelay;

recuperationEtatRlay = () => {
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
        .then((result) => {
          valEtatRelay = result.etatRelay;

          // console.log('valEtatRelay : ' + valEtatRelay);
          // console.log('valEtatRelay : ' + typeof valEtatRelay);
        });
    });
};

//? -------------------------------------------------

//? Mise à etat Relay eau au sol.

miseAjourEtatRelayEauAuSol = () => {
  relayEauAuSol
    .findOne({
      attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      relayEauAuSol
        .update({ etatRelayEauAuSol: 1 }, { where: { id: lastId } })

        .then(function (result) {
          // console.log("miseAjourEtatRelayEauAuSol =======> " + result);
        })

        .catch((err) => console.log(err));
    });
};

//? -------------------------------------------------

//! -------------------------------------------------

//? Clic sur le bouton eau au sol.

let etatRelayEauAuSol;
const relayBoutonEauAuSol = db.gestionEtatBoutonRelayEauAuSol;
let valPinAActiver = 16;

exports.activerRelayEauAuSol = (req, res) => {
  console.log("ROUTE OK");

  //? Les promesses.

  let getEtatRelayEauAuSol = () => {
    return new Promise((resolve, reject) => {
      try {
        relayBoutonEauAuSol
          .findOne({
            attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
            raw: true,
          })
          .then((id) => {
            // console.log('Le dernier id de gestionAir est : ', id);
            // console.log(id.maxid);

            relayBoutonEauAuSol
              .findOne({
                where: { id: id.maxid },
              })
              .then((result) => {
                etatRelayEauAuSol = result.etatRelayEauAuSol;
                resolve();

                console.log(
                  "✅ SUCCÈS | Gestions relais au sol | Etat Relay au eau au Sol de départ : ",
                  etatRelayEauAuSol
                );
              });
          });
      } catch (error) {
        reject(
          console.log(
            "❌ ERROR | Gestions relais au sol | Relays eau au sol | Clic sur le bouton eau au sol",

            error
          )
        );
      }
    });
  };

  let activationDeactivationBoutonRelayEauAuSol = () => {
    return new Promise((resolve, reject) => {
      try {
        if (etatRelayEauAuSol === 0) {
          //

          gpioActionOn((pinAActiver = valPinAActiver));

          console.log(
            "✅ SUCCÈS | Gestions relais au sol | Eau au sol activée"
          );

          //* Mise à jour de la basede donnée.

          relayBoutonEauAuSol
            .findOne({
              attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
              raw: true,
            })
            .then((id) => {
              // console.log('Le dernier id de gestionAir est : ', id);
              // console.log(id.maxid);
              lastId = id.maxid;

              relayBoutonEauAuSol
                .update({ etatRelayEauAuSol: 1 }, { where: { id: lastId } })

                .then(function (result) {
                  // console.log("Activation relay ===> ", result);
                })

                .catch((err) => console.log(err));
            });

          setTimeout(() => {
            gpioActionOff((pinAActiver = valPinAActiver));

            //* Mise à jour de la base de donnée.

            relayBoutonEauAuSol
              .findOne({
                attributes: [
                  [Sequelize.fn("max", Sequelize.col("id")), "maxid"],
                ],
                raw: true,
              })
              .then((id) => {
                // console.log('Le dernier id de gestionAir est : ', id);
                // console.log(id.maxid);
                lastId = id.maxid;

                relayBoutonEauAuSol
                  .update({ etatRelayEauAuSol: 0 }, { where: { id: lastId } })

                  .then(function (result) {
                    console.log(
                      "✅ SUCCÈS | Gestions relais au sol | Eau au sol déactivée"
                    );
                  })

                  .catch((err) => console.log(err));
              });

            res.status(200).json({ message: "Eau au sol déactivé ✅" });

            resolve();

            //*-------------------------------------
          }, 5000);
        }

        if (etatRelayEauAuSol === 1) {
          console.log("Relay au sol = Off");

          //* Mise à jour de la basede donnée.

          relayBoutonEauAuSol
            .findOne({
              attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
              raw: true,
            })
            .then((id) => {
              // console.log('Le dernier id de gestionAir est : ', id);
              // console.log(id.maxid);
              lastId = id.maxid;

              relayBoutonEauAuSol
                .update({ etatRelayEauAuSol: 0 }, { where: { id: lastId } })

                .then(function (result) {
                  console.log("Déactivation relay au clic  ===> ", result);
                })

                .catch((err) => console.log(err));
            });

          //*-------------------------------------

          res.status(200).json({ message: "Eau au sol déactivé ✅" });

          resolve();
        }
      } catch (error) {
        console.log(
          "❌ %c ERREUR ==> Relays eau au sol ==> Action bouton",
          "color: orange",
          error
        );

        reject();
      }
    });
  };

  //? Resolve promise.

  let handleMyPromise = async () => {
    try {
      // await getEtatRelayEauAuSol();
      // await activationDeactivationBoutonRelayEauAuSol();
    } catch (err) {
      console.log("err :", err);
    }
  };

  handleMyPromise();
};

//? -------------------------------------------------

//? Gestion relay Ventilateur humidité.

exports.relayVentilo = (req, res) => {
  let relayVentilo = req.body.relayVentilo;
  // console.log("relayVentilo ==> ", relayVentilo);

  if (relayVentilo === 1) {
    gpioActionOn((pinAActiver = 17));

    res.status(200).json({ message: "ventilateur ON" });
  }
  if (relayVentilo === 0) {
    gpioActionOff((pinAActiver = 17));

    res.status(200).json({ message: "ventilateur OFF" });
  }
};

//? Gestion relay Vanne Froid à 5 secondes.

exports.relayVanneFroid5Secondes = (req, res) => {
  let relayVanneFroid = req.body.etatRelay;
  console.log("relayVanneFroid ====> ", relayVanneFroid);

  if (relayVanneFroid === "ON") {
    actionRelay = 1;
    miseAjourActionRelay();
    recuperationEtatRlay();
    gpioActionOn((pinAActiver = 23));

    setTimeout(() => {
      gpioActionOff((pinAActiver = 23));

      if (valEtatRelay >= 100) {
        etatRelay = 100;
      } else {
        etatRelay = valEtatRelay + 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();
      miseAjourEtatRelay();

      res.status(200).json({ message: "Fin action à 5 secondes ON" });
    }, 5000);
  }

  if (relayVanneFroid === "OFF") {
    actionRelay = 1;
    miseAjourActionRelay();
    recuperationEtatRlay();
    gpioActionOn((pinAActiver = 22));

    setTimeout(() => {
      gpioActionOff((pinAActiver = 22));

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();
      miseAjourEtatRelay();
      res.status(200).json({ message: "Fin action à 5 secondes OFF" });
    }, 5000);
  }
};

//? Gestion relay Vanne Froid à 40 secondes.

exports.relayVanneFroid40Secondes = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  if (relayVanneFroid == "ON") {
    actionRelay = 1;
    miseAjourActionRelay();
    recuperationEtatRlay();
    gpioActionOn((pinAActiver = 23));

    setTimeout(() => {
      gpioActionOff((pinAActiver = 23));

      if (valEtatRelay >= 100) {
        etatRelay = 100;
      } else {
        etatRelay = valEtatRelay + 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();
      miseAjourEtatRelay();

      res.status(200).json({ message: "Fin action à 40 secondes ON" });
    }, 40000);
  }

  if (relayVanneFroid == "OFF") {
    actionRelay = 1;
    miseAjourActionRelay();
    recuperationEtatRlay();
    gpioActionOn((pinAActiver = 22));

    setTimeout(() => {
      gpioActionOff((pinAActiver = 22));

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();
      miseAjourEtatRelay();
      res.status(200).json({ message: "Fin action à 40 secondes OFF" });
    }, 40000);
  }
};
