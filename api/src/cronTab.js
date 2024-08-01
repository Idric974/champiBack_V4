const schedule = require("node-schedule");
const childProcess = require("child_process");

//*! 1) Gestion Air.

//? Calcules.

//const gestionAir = schedule.scheduleJob(" * * * * * ", () => {
const gestionAir = schedule.scheduleJob(" */10 * * * * ", () => {
  function runScript(scriptPath, callback) {
    //* keep track of whether callback has been invoked to prevent multiple invocations
    let invoked = false;

    let process = childProcess.fork(scriptPath);

    //* listen for errors as they may prevent the exit event from firing
    process.on("error", function (err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    //* execute the callback once the process has finished running
    process.on("exit", function (code) {
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  //* Now we can run a script and invoke a callback when complete, e.g.
  runScript(
    "/home/pi/Desktop/champiBack_V4/api/src/services/gestionAir/gestionAir.js",
    function (err) {
      if (err) throw err;
      console.log(`🔴 SUCCÈS | Gestions Air | fin du script`);
    }
  );
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
