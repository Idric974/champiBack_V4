const schedule = require("node-schedule");
const childProcess = require("child_process");
const invoked = false;
const process = childProcess.fork(scriptPath);

//*! 1) Gestion Air.

//? Calcules.

const gestionAir = schedule.scheduleJob("*/5 * * * *", () => {
  function runScript(scriptPath, callback) {
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  runScript(
    "/home/pi/Desktop/champiBack_V4/api/src/services/gestionAir/gestionAir.js",
    function (err) {
      if (err) throw err;
      // console.log(
      //   jaune,
      //   '[ GESTION AIR CRON TAB  ] CALCULES Calcules sont  terminés'
      // );
    }
  );
});

//? -------------------------------------------------

//*! 2) Gestion humidité.

//? Calcules.

const gestionHum = schedule.scheduleJob("*/15 * * * *", () => {
  // const gestionHum = schedule.scheduleJob(' _/10 \* \* \* \* ', () => {

  function runScript(scriptPath, callback) {
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  runScript(
    "/home/pi/Desktop/champiBack_V4/api/src/services/gestionHumidite/gestionHumidite.js",
    function (err) {
      if (err) throw err;
      // console.log(
      //   bleu,
      //   '[ GESTION HUM CRON TAB  ] GESTION HUMIDITÉ finished running some-script.js'
      // );
    }
  );
});

//? -------------------------------------------------

//*! 3) Gestion Co2

//? Calculs.

const gestionCo2 = schedule.scheduleJob(" 01 * * * * ", () => {
  function runScript(scriptPath, callback) {
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  runScript("./gestion/gestionCo2/gestionCo2.js", function (err) {
    if (err) throw err;
    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CRON TAB  ] GESTION CO2 finished running some-script.js'
    // );
  });
});

//? -------------------------------------------------
