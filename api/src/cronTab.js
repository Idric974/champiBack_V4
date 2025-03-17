const schedule = require("node-schedule");
const childProcess = require("child_process");
const path = require("path");

/**
 * Exécute un script via `child_process.fork` et appelle un callback à la fin.
 * @param {string} scriptPath - Chemin vers le script à exécuter.
 * @param {Function} callback - Fonction appelée à la fin (err en premier param).
 */


function runScript(scriptPath, callback) {
  let invoked = false;
  const proc = childProcess.fork(scriptPath);

  //* Gestion des erreurs : si le process plante avant l'exit
  proc.on("error", (err) => {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  //* Gestion de la fin du process : on déclenche callback si pas déjà fait
  proc.on("exit", (code) => {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error(`exit code ${code}`);
    callback(err);
  });
}

//? 1) Gestion Air (toutes les 5 minutes)

schedule.scheduleJob("*/5 * * * *", () => {
  runScript(path.join(__dirname, "services/gestionAir/gestionAir.js"), (err) => {
    if (err) {
      console.error("[ERREUR] Gestion Air :", err);
      return;
    }
    console.log("[CRON] Gestion Air : script terminé avec succès.");
  });
});

//? 2) Gestion Humidité (toutes les 15 minutes)

schedule.scheduleJob("*/15 * * * *", () => {
  runScript(
    path.join(__dirname, "services/gestionHumidite/gestionHumidite.js"),
    (err) => {
      if (err) {
        console.error("[ERREUR] Gestion Humidité :", err);
        return;
      }
      console.log("[CRON] Gestion Humidité : script terminé avec succès.");
    }
  );
});

//? 3) Gestion Co2 (à chaque heure, minute 01)

schedule.scheduleJob("1 * * * *", () => {
  runScript(path.join(__dirname, "services/gestionCo2/gestionCo2.js"), (err) => {
    if (err) {
      console.error("[ERREUR] Gestion Co2 :", err);
      return;
    }
    console.log("[CRON] Gestion Co2 : script terminé avec succès.");
  });
});
