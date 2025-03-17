const sequelize = require("sequelize");
const fs = require('fs');
const currentTime = new Date().toLocaleTimeString();
const db = require("../../models");
const {
  sendSMS,
  miseAjourEtatRelay,
  gpioActionOn,
  gpioActionOff,
} = require("../../utils/functions/myfunctions");

console.log(`🟢 SUCCÈS | Gestion Air | Démarrage du script à ${currentTime}`);

//? Recupération de la vanne à utiliser.

let vanneActive;
let ouvertureVanne;
let fermetureVanne;

const gestionAirVannesModels = db.gestionAirVannes;

const recuperationDeLaVanneActive = () => {
  return new Promise((resolve, reject) => {
    gestionAirVannesModels
      .findOne({
        attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
        raw: true,
      })
      .then((maxIdResult) => {
        if (!maxIdResult) {
          throw new Error("No max ID found");
        }
        return gestionAirVannesModels.findOne({
          where: { id: maxIdResult.maxid },
        });
      })
      .then((result) => {
        if (!result) {
          throw new Error("No vanne found with max ID");
        }
        vanneActive = result.vanneActive;
        // console.log("vanneActive =====> ", vanneActive);

        if (vanneActive === "vanneHum") {
          ouvertureVanne = "23";
          fermetureVanne = "22";
          console.log(
            "✅ SUCCÈS | Gestion Air | La vanne utilisée est = ",
            vanneActive
          );

          resolve({ ouvertureVanne, fermetureVanne });
        } else if (vanneActive === "vanneSec") {
          ouvertureVanne = "25";
          fermetureVanne = "24";
          console.log(
            "✅ SUCCÈS | Gestion Air | La vanne utilisée est = ",
            vanneActive
          );
          resolve({ ouvertureVanne, fermetureVanne });
        } else {
          reject(console.log(`Unknown vanneActive value: ${vanneActive}`));
          throw new Error(`Unknown vanneActive value: ${vanneActive}`);
        }
      })
      .catch((error) => {
        console.error(
          "? %c ERREUR ==> gestions Air ==> Récupération de l'étalonage",
          "color: orange",
          error
        );
        reject(error);
      });
  });
};

//? --------------------------------------------------

//? Récupération de la consigne.

let consigne;
let pas;
let objectif;

const gestionAirsDataModels = db.gestionAirData;

const recupérationDeLaConsigne = () => {
  return new Promise((resolve, reject) => {
    gestionAirsDataModels
      .findOne({
        attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
        raw: true,
      })
      .then((maxIdResult) => {
        if (!maxIdResult) {
          throw new Error("No max ID found");
        }
        return gestionAirsDataModels.findOne({
          where: { id: maxIdResult.maxid },
        });
      })
      .then((result) => {
        if (!result) {
          throw new Error("No data found with max ID");
        }

        consigne = result.consigneAir;
        pas = result.pasAir;
        objectif = result.objectifAir;

        console.log(
          "✅ SUCCÈS | Gestion Air | Récupération de la Consigne Air =",
          consigne
        );
        console.log("✅ SUCCÈS | Gestion Air | Récupération du Pas Air =", pas);
        console.log(
          "✅ SUCCÈS | Gestion Air | Récupération de l'Objectif Air =",
          objectif
        );

        resolve({ consigne, pas, objectif });
      })
      .catch((error) => {
        console.error(
          "❌ ERREUR ==> gestions Air ==> Récupération de la consigne",
          "color: orange",
          error
        );
        reject(error);
      });
  });
};

//? --------------------------------------------------

//? Récupération de l'étalonage.

let etalonnage;

const gestionAirEtalonnageModels = db.etalonnageAir;

const recuperationDeEtalonage = () => {
  return new Promise((resolve, reject) => {
    gestionAirEtalonnageModels
      .findOne({
        attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
        raw: true,
      })
      .then((maxIdResult) => {
        if (!maxIdResult) {
          throw new Error("No max ID found");
        }
        return gestionAirEtalonnageModels.findOne({
          where: { id: maxIdResult.maxid },
        });
      })
      .then((result) => {
        if (!result) {
          throw new Error("No data found with max ID");
        }

        etalonnage = result.etalonnageAir;

        console.log(
          "✅ SUCCÈS | Gestion Air | Récupération de l'étalonage = ",
          etalonnage
        );

        resolve(etalonnage);
      })
      .catch((error) => {
        console.error(
          "❌ ERREUR ==> gestions Air ==> Récupération de l'étalonage",
          "color: orange",
          error
        );
        reject(error);
      });
  });
};

//? --------------------------------------------------

//? Récupération de l'état de la vanne froid.

let etatVanneBDD;
let deltaAirPrecedent;

const gestionAirModels = db.gestionAir;

const recuperationEtatVanneFroid = () => {
  return new Promise((resolve, reject) => {
    gestionAirModels
      .findOne({
        attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
        raw: true,
      })
      .then((maxIdResult) => {
        if (!maxIdResult) {
          throw new Error("No max ID found");
        }
        return gestionAirModels.findOne({ where: { id: maxIdResult.maxid } });
      })
      .then((result) => {
        if (!result) {
          throw new Error("No data found with max ID");
        }

        etatVanneBDD = result.etatRelay;
        deltaAirPrecedent = result.deltaAir;

        console.log(
          "✅ SUCCÈS | Gestion Air | Récupération de l'état de la vanne froid =",
          etatVanneBDD
        );
        console.log(
          "✅ SUCCÈS | Gestion Air | Récupération du delta Air =",
          deltaAirPrecedent
        );

        resolve({ etatVanneBDD, deltaAirPrecedent });
      })
      .catch((error) => {
        console.error(
          "❌ ERREUR ==> gestions Air ==> Récupération de l'état de la vanne froid",
          "color: orange",
          error
        );
        reject(error);
      });
  });
};

//? --------------------------------------------------

//? Construction de la valeur de l'axe x.

let dateDemarrageCycle;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

const gestionCourbesModels = db.gestionCourbes;

let constructionAxeX = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = await gestionCourbesModels.findOne({
        attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
        raw: true,
      });

      if (!id) {
        throw new Error("No max ID found");
      }

      const result = await gestionCourbesModels.findOne({
        where: { id: id.maxid },
      });

      if (!result) {
        throw new Error("No record found with max ID");
      }

      dateDemarrageCycle = new Date(result.dateDemarrageCycle);

      console.log(
        "✅ SUCCÈS | Gestion Air | Date de démarrage du cycle = ",
        dateDemarrageCycle
      );

      nbJourBrut = new Date().getTime() - dateDemarrageCycle.getTime();
      jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;
      heureDuCycle = new Date().getHours();
      minuteDuCycle = new Date().getMinutes();
      if (minuteDuCycle < 10) {
        minuteDuCycle = `0${minuteDuCycle}`;
      }
      heureMinute = `${heureDuCycle}h${minuteDuCycle}`;

      valeurAxeX = `Jour ${jourDuCycle} - ${heureMinute}`;
      console.log(
        "✅ SUCCÈS | Gestion Air | Construction de la valeur de l'axe X = ",
        valeurAxeX
      );

      resolve(valeurAxeX);
    } catch (error) {
      console.error(
        "❌ %c ERREUR ==> gestions Air ==> Construction de la valeur de l'axe X",
        "color: orange",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Mesure de la température Air.

const mcpadc = require("mcp-spi-adc");
const mcpBroche = 2;
let valuesTable = [];
let temps = 0;

let getTemperatures = () => {
  return new Promise((resolve, reject) => {
    try {
      const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
        if (err) {
          console.error(
            "❌ ERREUR ==> gestions Air ==> Ouverture du capteur",
            err
          );
          return reject(err);
        }

        const count = () => {
          tempSensor.read((err, reading) => {
            if (err) {
              console.error(
                "❌ ERREUR ==> gestions Air ==> Lecture du capteur",
                "color: orange",
                err
              );
              clearInterval(conteur);
              return reject(err);
            }

            valuesTable.push(reading.value * 40);
            let lastIndex = valuesTable.length;
            console.log(
              "✅ SUCCÈS | Gestion Air | Mesure " +
                lastIndex +
                "/10 de la température Air : " +
                reading.value
            );

            if (valuesTable.length >= 10) {
              clearInterval(conteur);
              tempSensor.close((err) => {
                if (err) {
                  console.error(
                    "❌ ERREUR ==> gestions Air ==> Fermeture du capteur",
                    "color: orange",
                    err
                  );
                  return reject(err);
                }
                resolve();
              });
            }
          });

          temps++;
          if (temps === 10) {
            clearInterval(conteur);
          }
        };

        const conteur = setInterval(count, 1000);
      });
    } catch (error) {
      console.error(
        "❌ ERREUR ==> gestions Air ==> Mesure de la température Air",
        "color: orange",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température moyenne.

let temperatureMoyenneAir;

const calculeDeLaTemperatureMoyenne = () => {
  return new Promise((resolve, reject) => {
    try {
      const arrayLength = valuesTable.length;
      if (arrayLength === 0) {
        throw new Error("List of air values is empty");
      }

      const sumlistValAir = valuesTable.reduce(
        (accumulator, curr) => accumulator + curr,
        0
      );
      temperatureMoyenneAir =
        Math.round((sumlistValAir / arrayLength) * 100) / 100;

      console.log(
        "✅ SUCCÈS | Gestion Air | Temperature air moyenne = ",
        temperatureMoyenneAir
      );

      resolve(temperatureMoyenneAir);
    } catch (error) {
      console.error(
        "❌ ERREUR ==> gestions Air ==> Temperature air moyenne",
        "color: orange",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Définition de la température air corrigée.

let temperatureCorrigee;

let definitionTemperatureAirCorrigee = () => {
  return new Promise((resolve, reject) => {
    try {
      temperatureCorrigee =
        parseFloat(temperatureMoyenneAir.toFixed(1)) + etalonnage;

      console.log(
        "✅ SUCCÈS | Gestion Air | Définition de la température air corrigée = ",
        temperatureCorrigee
      );

      resolve();
    } catch (error) {
      console.log(
        "❌ %c ERREUR ==> gestions Air ==> Définition de la température air corrigée",
        "color: orange",
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Définition du delta.

let delta;

let definitionDuDelta = () => {
  return new Promise((resolve, reject) => {
    try {
      delta = parseFloat((temperatureCorrigee - consigne).toFixed(1));

      console.log("✅ SUCCÈS | Gestion Air | Définition du delta = ", delta);

      resolve();
    } catch (error) {
      console.log(
        "❌ %c ERREUR ==> gestions Air ==> Définition du delta",
        "color: orange"
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Définition des actions.

let duree1Seconde = 1000;
let duree2Seconde = 2000;
let duree5Seconde = 5000;
let duree15Seconde = 15000;

//* Test.
// let delta = 3; //* Condition 1 :  Le delta est supérieur ou égale à 3.
// let delta = 2.9; //* Condition 2 :  Le delta est supérieur à 1.5 °C et inférieur à 3 °C.
// let delta = 1.4; //* Condition 3 :  Le delta est supérieur à 1°C et inférieur ou égale à 1.5°C.
// let delta = 0.9; //* Condition 4 :  Le delta est supérieur à 0.5°C et inférieur ou égale à 1°C.
// let delta = 0.5; //* Condition 5 :  Le delta est supérieur à 0.3°C et inférieur ou égale à 0.5°C.
// let delta = 0.3; //* Condition 6 :  Le delta est supérieur ou égale à -0.3°C et inférieur ou égale à 0.3°C.
// let delta = -0.4; //* Condition 7 :  Le delta est inférieur à -0.3°C et suppérieur ou égale à -0.5°C.
// let delta = -1; //* Condition 8 :  Le delta est inférieur à -0.5°C et suppérieur ou égale à -1°C.
// let delta = -1.5; //* Condition 9 :  Le delta est inférieur à -1°C et suppérieur ou égale à -1.5°C.
// let delta = -1.6; //* Condition 10 : Le delta est inférieur à -1.5°C et suppérieur à -3°C.
// let delta = 0.6; //* Condition 11 : Le delta est inférieur ou égaale à -3°C.
//* -------------------------------------------------

let definitionDesActions = () => {
  return new Promise((resolve, reject) => {
    try {
      //* Condition 1 ! Le delta est supérieur ou égale à 3.

      if (delta >= 3) {
        console.log(
          "❗❗ ALERTE | Gestion Air | ALERTE le delta est supérieur à 3°C."
        );

        sendSMS("Attention : le delta est supérieur à 3°C");

        console.log(
          "🖐  MESSAGE | Condition 1 | Gestion Air | Le delta est suppérieur ou égale à 3 | Action = Ouverture vanne pendant : " +
            duree15Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 100;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree15Seconde);
      }

      //* Condition 2 : Le delta est supérieur à 1.5 °C et inférieur à 3 °C.

      if (delta > 1.5 && delta < 3) {
        console.log(
          "🖐  MESSAGE | Condition 2 | Gestion Air | Le delta est supérieur à 1.5°C et inférieur à 3°C | Action = Ouverture vanne pendant : " +
            duree15Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 100;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree15Seconde);
      }

      //* Condition 3 : Le delta est supérieur à 1°C et inférieur ou égale à 1.5°C.

      if (delta > 1 && delta <= 1.5) {
        console.log(
          "🖐  MESSAGE | Condition 3 | Gestion Air | Le delta est supérieur à 1°C et inférieur ou égale à 1.5°C | Action = Ouverture vanne pendant : " +
            duree5Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = etatVanneBDD + 37.5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree5Seconde);
      }

      //* Condition 4 : Le delta est supérieur à 0.5°C et inférieur ou égale à 1°C.

      if (delta > 0.5 && delta <= 1) {
        console.log(
          "🖐  MESSAGE | Condition 4 | Gestion Air | Le delta est supérieur à 0.5°C et inférieur ou égale à 1°C | Action = Ouverture vanne pendant : " +
            duree2Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = etatVanneBDD + 12.5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree2Seconde);
      }

      //* Condition 5 : Le delta est supérieur à 0.3°C et inférieur ou égale à 0.5°C.

      if (delta > 0.3 && delta <= 0.5) {
        console.log(
          "🖐  MESSAGE | Condition 5 | Gestion Air | Le delta est supérieur à 0.3°C et inférieur ou égale à 0.5°C | Action = Ouverture vanne pendant : " +
            duree1Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = etatVanneBDD + 5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree1Seconde);
      }

      //! -------------------------------------------
      //* Condition 6 : Le delta est supérieur ou égale à -0.3°C et inférieur ou égale à 0.3°C donc pas d'action car interval entre -0.3 et 0.3.

      if (delta >= -0.3 && delta <= 0.3) {
        console.log(
          "🖐  MESSAGE | Condition 6 | Gestion Air | Delta >= 3° | Action = Pas d'action"
        );

        etatRelay = etatVanneBDD;
        miseAjourEtatRelay(etatRelay, (actionRelay = 0));
        resolve();
      }
      //! -------------------------------------------

      //* Condition 7 : Le delta est inférieur à -0.3°C et suppérieur ou égale à -0.5°C.

      if (delta < -0.3 && delta >= -0.5) {
        console.log(
          "🖐  MESSAGE | Condition 7 | Gestion Air | Le delta est inférieur à -0.3°C et suppérieur ou égale à -0.5°C | Action = Fermuture vanne pendant : " +
            duree1Seconde +
            " secondes"
        );

        gpioActionOn(fermetureVanne);

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = etatVanneBDD - 5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(fermetureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree1Seconde);
      }

      //* Condition 8 : Le delta est inférieur à -0.5°C et suppérieur ou égale à -1°C.

      if (delta < -0.5 && delta >= -1.4) {
        //
        console.log(
          "🖐  MESSAGE | Condition 8 | Gestion Air | Le delta est inférieur à -0.5°C et suppérieur ou égale à -1°C | Action = Fermuture vanne pendant : " +
            duree5Seconde +
            " secondes"
        );

        gpioActionOn(fermetureVanne);

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = etatVanneBDD - 12.5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(fermetureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree5Seconde);
      }

      //* Condition 9 : Le delta est inférieur à -1°C et suppérieur ou égale à -1.5°C.

      if (delta < -1 && delta >= -1.5) {
        console.log(
          "🖐  MESSAGE | Condition 9 | Gestion Air | Le delta est inférieur à -1°C et suppérieur ou égale à -1.5°C | Action = Fermuture vanne pendant : " +
            duree5Seconde +
            " secondes"
        );

        gpioActionOn(fermetureVanne);

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = etatVanneBDD - 37.5;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(fermetureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree5Seconde);
      }

      //* Condition 10 : Le delta est inférieur à -1.5°C et suppérieur à -3°C.

      if (delta < -1.5 && delta > -3) {
        console.log(
          "🖐  MESSAGE | Condition 10 | Gestion Air | Delta >= 3° | Action = Fermuture vanne pendant : " +
            duree15Seconde +
            " secondes"
        );

        gpioActionOn(fermetureVanne);

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = 0;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(fermetureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree15Seconde);
      }

      //* Condition 11 : Le delta est inférieur ou égaale à -3°C.

      if (delta <= -3) {
        console.log(
          "❗❗ ALERTE | Gestion Air | ALERTE le delta est inférieur à -3°C."
        );

        sendSMS("Attention : le delta est inférieur à -3°C");

        console.log(
          "🖐  MESSAGE | Condition 11 | Gestion Air | Le delta est inférieur ou égaale à -3°C | Action = Fermuture vanne pendant : " +
            duree15Seconde +
            " secondes"
        );

        gpioActionOn(fermetureVanne);

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = 0;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(fermetureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree15Seconde);
      }
    } catch (error) {
      console.log("🔴 Définition des actions :", error);
      reject();
    }
  });
};

//? --------------------------------------------------

//? Enregistrement des datas dans la base.

let enregistrementDatas = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionAirModels
        .create({
          temperatureAir: temperatureCorrigee,
          deltaAir: delta,
          actionRelay: actionRelay,
          etatRelay: etatRelay,
          consigne: consigne,
          valeurAxeX: valeurAxeX,
          jourDuCycle: jourDuCycle,
        })

        .then(function (result) {
          console.log(
            "✅ SUCCÈS | Gestion Air | Enregistrement des datas dans la base de données sous l'id :",
            result["dataValues"].id
          );
        })

        .then(() => {
          resolve();
        });
    } catch (error) {
      console.log(
        "❌ ERREUR | Gestion Air | Enregistrement des datas dans la base",
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//! Exécution des fonctions asynchrones.

let handleMyPromise = async () => {
  try {
    await recuperationDeLaVanneActive();
    await recupérationDeLaConsigne();
    await recuperationDeEtalonage();
    await recuperationEtatVanneFroid();
    await constructionAxeX();
    await getTemperatures();
    await calculeDeLaTemperatureMoyenne();
    await definitionTemperatureAirCorrigee();
    await definitionDuDelta();
    await definitionDesActions();
    await enregistrementDatas();
    await fs.appendFileSync('/home/pi/cron_execution.log', `Script exécuté à : ${new Date().toLocaleString()}\n`);
  } catch (err) {
    console.log("err finale :", err);
  }
};

handleMyPromise();
