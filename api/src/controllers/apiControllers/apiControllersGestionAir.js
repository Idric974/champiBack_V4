const Sequelize = require("sequelize");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const db = require("../../models");
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionAirVannesModels = db.gestionAirVannes;

//?  Activation du relais Gestion Air..

exports.gpioActionOn = async (req, res) => {
  let gpioPin = req.body.pin;
  // console.log("🟢 Controleurs gpioPin ==>", gpioPin);

  try {
    //* Exécuter le script gpioOn.py

    const { stdout: stdoutOn, stderr: stderrOn } = await execAsync(
      `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOn.py ${gpioPin}`
    );
    if (stderrOn) {
      console.error(`Error output (gpioOn.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOn.py): ${stdoutOn}`);

    //* Envoyer la réponse
    res.status(200).json({ message: `Le relai ${gpioPin} à été activé.` });
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
      `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOff.py ${gpioPin}`
    );
    if (stderrOn) {
      console.error(`Error output (gpioOff.py): ${stderrOn}`);
    }
    console.log(`Script output (gpioOff.py): ${stdoutOn}`);

    //* Envoyer la réponse
    res.status(200).json({ message: `Le relai ${gpioPin} à été déactivé.` });
  } catch (error) {
    console.error(`Error executing script: ${error}`);
    res
      .status(500)
      .json({ message: "Erreur lors de l'exécution du script", error });
  }
};
