const Sequelize = require("sequelize");
const db = require("../../models");
const gestionAirModels = db.gestionAir;

//? Post relay action.

exports.postRelayAction = (req, res) => {
  let gpioPin = req.body.pin;
  // console.log("gpioPin ==>", gpioPin);
  let action = req.body.action;
  // console.log("action ==>", action);

  const { exec } = require("child_process");

  exec(
    `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOn.py ${gpioPin}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error}`);
        return;
      }

      if (stderr) {
        //  console.error(`Error output: ${stderr}`);
        return;
      }

      console.log(`Script output: ${stdout}`);
    }
  );

  setTimeout(() => {
    exec(
      `python3 /home/pi/Desktop/champiBack_V4/api/src/utils/python/gpioOff.py ${gpioPin}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error}`);
          return;
        }

        if (stderr) {
          //  console.error(`Error output: ${stderr}`);
          return;
        }

        console.log(`Script output: ${stdout}`);

        res.status(200).json({ message: "GPIO OFF" });
      }
    );
  }, action);
};
