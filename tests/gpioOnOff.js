const { exec } = require("child_process");

let on = "gpioOn.py";
let off = "gpioOff.py";
let gpioPin = "22";

exec(
  `python3 /home/pi/Desktop/champiback_V4/api/src/utils/python/${off} ${gpioPin}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  }
);
