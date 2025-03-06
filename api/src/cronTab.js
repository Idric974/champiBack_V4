const schedule = require("node-schedule");
const childProcess = require("child_process");
const path = require('path');

//*! 1) Gestion Air.

//? Calcules.

const gestionAir = schedule.scheduleJob(" */1 * * * * ", () => {
  var childProcess = require("child_process");

  function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    // execute the callback once the process has finished running
    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  //* Now we can run a script and invoke a callback when complete, e.g.
  // runScript(
  //   "/home/pi/Desktop/champiBack_V4/api/src/services/gestionAir/gestionAir.js",
  //   function (err) {
  //     if (err) throw err;
  //     console.log(
  //       jaune,
  //       '[ GESTION AIR CRON TAB  ] CALCULES Calcules sont  terminés'
  //     );
  //   }
  // );


  runScript(
    path.join(__dirname, 'services/gestionAir/gestionAir.js'),
    function (err) {
        if (err) throw err;
    }
);
});

//? -------------------------------------------------

//*! 2) Gestion humidité.

//? Calcules.

const gestionHum = schedule.scheduleJob(" */15 * * * * ", () => {
  // const gestionHum = schedule.scheduleJob(' */10 * * * * ', () => {
  var childProcess = require("child_process");

  function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    // execute the callback once the process has finished running
    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  //* Now we can run a script and invoke a callback when complete, e.g.
  // runScript(
  //   "/home/pi/Desktop/champiBack_V4/api/src/services/gestionHumidite/gestionHumidite.js",
  //   function (err) {
  //     if (err) throw err;
  //     console.log(
  //       bleu,
  //       '[ GESTION HUM CRON TAB  ] GESTION HUMIDITÉ finished running some-script.js'
  //     );
  //   }
  // );

  runScript(
    path.join(__dirname, 'services/gestionHumidite/gestionHumidite.js'),
    function (err) {
        if (err) throw err;
    }
);


});

//? -------------------------------------------------

//*! 3) Gestion Co2

//? Calculs.

const gestionCo2 = schedule.scheduleJob(" 01 * * * * ", () => {
  var childProcess = require("child_process");

  function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    // execute the callback once the process has finished running
    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  //* Now we can run a script and invoke a callback when complete, e.g.
  // runScript(
  //   "/home/pi/Desktop/champiBack_V4/api/src/services/gestionCo2/gestionCo2.js",
  //   function (err) {
  //     if (err) throw err;
  //     console.log(
  //       cyan,
  //       '[ GESTION CO2 CRON TAB  ] GESTION CO2 finished running some-script.js'
  //     );
  //   }
  // );

  runScript(
    path.join(__dirname, 'services/gestionCo2/gestionCo2.js'),
    function (err) {
        if (err) throw err;
        console.log(
            cyan,
            '[ GESTION CO2 CRON TAB  ] GESTION CO2 finished running some-script.js'
        );
    }
);
});

//? -------------------------------------------------
