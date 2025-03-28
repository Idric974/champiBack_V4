const Sequelize = require("sequelize");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const db = require("../../models");
const gestionAirModels = db.gestionAir;

//? Mise à jour etat Relay.

exports.majRelay = (req, res) => {
  let etatRelay = req.body.etatRelay;
  let actionRelay = req.body.actionRelay;

  try {
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
          .update(
            { actionRelay: actionRelay, etatRelay: etatRelay },
            { where: { id: lastId } }
          )

          .then(function (result) {
            res.status(200).json({ message: "Le relai mis à jour.", result });
          })

          .catch((err) => console.log(err));
      });
  } catch (error) {
    console.error(`Error executing script: ${error}`);
    res
      .status(500)
      .json({ message: "Erreur lors de l'exécution du script", error });
  }
};

//? -------------------------------------------------

//?  Activation du relais Gestion Air..

exports.gpioActionOn = async (req, res) => {
  let gpioPin = req.body.pin;
  // console.log("🟢 Controleurs gpioPin ==>", gpioPin);

  try {
    //* Exécuter le script gpioOn.py

    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiback_V4/api/src/utils/python/gpioOn.py ${gpioPin}`
    );

//     const scriptPathOn = path.join(__dirname, "../../api/src/utils/python/gpioOn.py");

//     const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
//   `python3 ${scriptPathOn} ${gpioPin}`
  
// );

    if (stderrOn) {
      console.error(`Error output (gpioOn.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOn.py): ${stdoutOn}`);

    //* Envoyer la réponse
    res
      .status(200)
      .json({ message: "Le relai : " + gpioPin + " à été activé." });
  } catch (error) {
    console.error(`Error executing script: ${error}`);
    res
      .status(500)
      .json({ message: "Erreur lors de l'exécution du script", error });
  }
};

//?  Déactivation du relais Gestion Air..

exports.gpioActionOff = async (req, res) => {
  let gpioPin = req.body.pin;
  // console.log("🟢 Controleurs gpioPin ==>", gpioPin);

  try {
    //* Exécuter le script gpioOn.py

    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiback_V4/api/src/utils/python/gpioOff.py ${gpioPin}`
    );

    // const scriptPathOff = path.join(__dirname, "../../api/src/utils/python/gpioOff.py");

    // const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
    //   `python3 ${scriptPathOff} ${gpioPin}`
    // );
    

    if (stderrOn) {
      console.error(`Error output (gpioOff.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOff.py): ${stdoutOn}`);

    //* Envoyer la réponse
    res
      .status(200)
      .json({ message: "Le relai : " + gpioPin + " à été déactivé." });
  } catch (error) {
    console.error(`Error executing script: ${error}`);
    res
      .status(500)
      .json({ message: "Erreur lors de l'exécution du script", error });
  }
};
