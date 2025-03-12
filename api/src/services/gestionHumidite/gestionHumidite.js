const sequelize = require("sequelize");
const mcpadc = require("mcp-spi-adc");
const db = require("../../models");
const tableauCorrespondanceHumidite = require("../../utils/functions/tableauDeCorrespondancesHumidite");
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
const gestionCourbesModels = db.gestionCourbes;
const gestionSecEtallonnageModels = db.etalonnageSec;
const gestionHumEtallonnageModels = db.etalonnageHum;
const {
  gpioActionOn,
  gpioActionOff,
} = require("../../utils/functions/myfunctions");

//? Récupération des datas humidité.

let consigne;
let pas;
let objectif;

let recuperationDesDatasHumidite = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionHumDataModels
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          if (!id || !id.maxid) {
            throw new Error("L'id max n'a pas pu être récupéré.");
          }

          return gestionHumDataModels.findOne({
            where: { id: id.maxid },
          });
        })
        .then((result) => {
          if (result) {
            consigne = result.consigneHum;
            pas = result.pasHum;
            objectif = result.objectifHum;

            console.log(
              "✅ SUCCÈS | Gestion Humidité 1 | Récupération des datas :",
              {
                consigne,
                pas,
                objectif,
              }
            );

            resolve({ consigne, pas, objectif });
          } else {
            throw new Error("Aucun résultat trouvé pour l'id max.");
          }
        })
        .catch((error) => {
          console.log(
            "🔴 ERROR | Gestion Humidité | Récupération de la consigne humidité",
            error
          );
          reject(error);
        });
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Récupération de la consigne humidité",
        error
      );
      reject(error);
    }
  });
};

//? -------------------------------------------------

//? Construction de la valeur de l'axe x.

let dateDemarrageCycle;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

let constructionDeLaValeurDeLaxeX = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionCourbesModels
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          if (!id) {
            throw new Error("No max ID found");
          }

          return gestionCourbesModels.findOne({
            where: { id: id.maxid },
          });
        })
        .then((result) => {
          if (!result) {
            throw new Error("No record found with max ID");
          }

          dateDemarrageCycle = new Date(result.dateDemarrageCycle);

          console.log(
            "✅ SUCCÈS | Gestion Humidité 2 | Date de démarrage du cycle :",
            dateDemarrageCycle
          );

          const nbJourBrut =
            new Date().getTime() - dateDemarrageCycle.getTime();
          jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;
          heureDuCycle = new Date().getHours();
          minuteDuCycle = new Date().getMinutes();

          if (minuteDuCycle < 10) {
            minuteDuCycle = `0${minuteDuCycle}`;
          }

          heureMinute = `${heureDuCycle}h${minuteDuCycle}`;
          valeurAxeX = `Jour ${jourDuCycle} - ${heureMinute}`;

          console.log(
            "✅ SUCCÈS | Gestion Humidité 3 | Construction de la valeur de l'axe X : ",
            valeurAxeX
          );

          resolve(valeurAxeX);
        })
        .catch((error) => {
          console.log(
            "🔴 ERROR | Gestion Humidité | Construction de la valeur de l'axe X",
            error
          );
          reject(error);
        });
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Construction de la valeur de l'axe X",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Récupération de l'étalonnage Sec.

let etalonnageSec;

let recuperationDeEtalonageSec = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionSecEtallonnageModels
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          if (!id) {
            throw new Error("No max ID found");
          }

          return gestionSecEtallonnageModels.findOne({
            where: { id: id.maxid },
          });
        })
        .then((result) => {
          if (!result) {
            throw new Error("No record found with max ID");
          }

          etalonnageSec = result.etalonnageSec;

          console.log(
            "✅ SUCCÈS | Gestion Humidité 4 | Récupération de l'étalonage Sec :",
            etalonnageSec
          );

          resolve(etalonnageSec);
        })
        .catch((error) => {
          console.log(
            "🔴 ERROR | Gestion Humidité | Récupération de l'étalonage Sec",
            error
          );
          reject(error);
        });
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Récupération de l'étalonage Sec",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Mesure de la température moyenne Sec.

let mcpBrocheSec = 0;
let listValSecHumidite = [];

let mesureDeLaTemperatureMoyenneSec = () => {
  return new Promise((resolve, reject) => {
    try {
      let temps = 0;
      let conteur;

      let count = () => {
        temps++;

        if (temps === 39) {
          clearInterval(conteur);
        }

        const tempSensor = mcpadc.open(
          mcpBrocheSec,
          { speedHz: 20000 },
          (err) => {
            if (err) {
              clearInterval(conteur);
              reject(err);
              return;
            }

            tempSensor.read((err, reading) => {
              if (err) {
                clearInterval(conteur);
                reject(err);
                return;
              }

              listValSecHumidite.push(reading.value * 40);

              let lastIndex = listValSecHumidite.length;
              console.log(
                "✅ SUCCÈS | Gestion Humidité 5 | Mesure " +
                  lastIndex +
                  "/40 de la température Sec : " +
                  reading.value
              );

              if (listValSecHumidite.length >= 39) {
                clearInterval(conteur);
                resolve(listValSecHumidite);
              }
            });
          }
        );
      };

      conteur = setInterval(count, 1000);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Mesure de la température Sec : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température moyenne Sec.

let temperatureMoyenneSec;

let calculeDeLaTemperatureMoyenneSec = () => {
  return new Promise((resolve, reject) => {
    try {
      let arrayLength = listValSecHumidite.length;

      if (arrayLength === 0) {
        throw new Error("La liste des valeurs de température Sec est vide.");
      }

      const sumlistVal = listValSecHumidite.reduce(
        (accumulator, curr) => accumulator + curr,
        0
      );
      temperatureMoyenneSec = sumlistVal / arrayLength;

      console.log(
        "✅ SUCCÈS | Gestion Humidité 6 | Temperature moyenne Sec Brute : ",
        temperatureMoyenneSec
      );

      resolve(temperatureMoyenneSec);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Temperature moyenne Humidité : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température corrigée Sec.

let temperatureCorrigeeSec;

let calculeDeLaTempératureCorrigeeSec = () => {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof temperatureMoyenneSec === "undefined" ||
        typeof etalonnageSec === "undefined"
      ) {
        throw new Error(
          "Les valeurs nécessaires pour calculer la température corrigée ne sont pas définies."
        );
      }

      temperatureCorrigeeSec = parseFloat(
        (temperatureMoyenneSec + etalonnageSec).toFixed(1)
      );

      console.log(
        "✅ SUCCÈS | Gestion Humidité 7 | Calcule de la température corrigée Sec : ",
        temperatureCorrigeeSec
      );

      resolve(temperatureCorrigeeSec);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Calcule de la température corrigée Sec : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Tableau de correspondance.

// let temperatureCorrigeeSecTest = 10.5;
let correspondancePressions;

const getCorrespondanceSec = () => {
  return new Promise((resolve, reject) => {
    try {
      // Appel direct de la fonction car elle retourne une valeur synchrone
      correspondancePressions = tableauCorrespondanceHumidite(
        temperatureCorrigeeSec
      );

      if (correspondancePressions !== undefined) {
        console.log(
          "✅ SUCCÈS | Gestion Humidité 8 | Correspondance Sec : ",
          correspondancePressions
        );
        resolve(correspondancePressions);
      } else {
        throw new Error(
          "🔴 ERROR | Correspondance Sec non trouvée pour la température donnée."
        );
      }
    } catch (error) {
      console.log("🔴 ERROR | gestions Humidité | Correspondance Sec", error);
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Récupération de l'étalonnage Humide.

let etalonnageHum;

let recuperationDeEtalonageHumide = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionHumEtallonnageModels
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          if (!id) {
            throw new Error("No max ID found");
          }

          return gestionHumEtallonnageModels.findOne({
            where: { id: id.maxid },
          });
        })
        .then((result) => {
          if (!result) {
            throw new Error("No record found with max ID");
          }

          etalonnageHum = result.etalonnageHum;

          console.log(
            "✅ SUCCÈS | Gestion Humidité 9 | Récupération de l'étalonage Humidité :",
            etalonnageHum
          );

          resolve(etalonnageHum);
        })
        .catch((error) => {
          console.log(
            "🔴 ERROR | Gestion Humidité | Récupération de l'étalonage Humidité",
            error
          );
          reject(error);
        });
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Récupération de l'étalonage Humidité",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Mesure de la température moyenne Humide.

let mcpBrocheHum = 1;
let listValHumHumidite = [];

let mesureDeLaTemperatureMoyenneHumidite = () => {
  return new Promise((resolve, reject) => {
    try {
      let temps = 0;
      let conteur;

      let count = () => {
        temps++;

        if (temps === 39) {
          clearInterval(conteur);
        }

        const tempSensor = mcpadc.open(
          mcpBrocheHum,
          { speedHz: 20000 },
          (err) => {
            if (err) {
              clearInterval(conteur);
              reject(err);
              return;
            }

            tempSensor.read((err, reading) => {
              if (err) {
                clearInterval(conteur);
                reject(err);
                return;
              }

              listValHumHumidite.push(reading.value * 40);

              let lastIndex = listValHumHumidite.length;
              console.log(
                "✅ SUCCÈS | Gestion Humidité 10 | Mesure " +
                  lastIndex +
                  "/40 de la température Hum : " +
                  reading.value
              );

              if (listValHumHumidite.length >= 39) {
                clearInterval(conteur);
                resolve(listValHumHumidite);
              }
            });
          }
        );
      };

      conteur = setInterval(count, 1000);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Mesure de la température Sec : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température moyenne Humidité.

let temperatureMoyenneHumidite;

let calculeDeLaTemperatureMoyenneHumidite = () => {
  return new Promise((resolve, reject) => {
    try {
      let arrayLength = listValHumHumidite.length;

      if (arrayLength === 0) {
        throw new Error(
          "La liste des valeurs de température Humidité est vide."
        );
      }

      const sumlistVal = listValHumHumidite.reduce(
        (accumulator, curr) => accumulator + curr,
        0
      );
      temperatureMoyenneHumidite = sumlistVal / arrayLength;

      console.log(
        "✅ SUCCÈS | Gestion Humidité 11 | Temperature moyenne Humidité Brute : ",
        temperatureMoyenneHumidite
      );

      resolve(temperatureMoyenneHumidite);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Temperature moyenne Humidité : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température corrigée Humidité.

let temperatureCorrigeeHumide;

let calculeDeLaTemperatureCorrigeeHumide = () => {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof temperatureMoyenneHumidite === "undefined" ||
        typeof etalonnageHum === "undefined"
      ) {
        throw new Error(
          "Les valeurs nécessaires pour calculer la température corrigée humidité ne sont pas définies."
        );
      }

      temperatureCorrigeeHumide = parseFloat(
        (temperatureMoyenneHumidite + etalonnageHum).toFixed(1)
      );

      console.log(
        "✅ SUCCÈS | Gestion Humidité 12 | Calcule de la température corrigée Humidité : ",
        temperatureCorrigeeHumide
      );

      resolve(temperatureCorrigeeHumide);
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Humidité | Calcule de la température corrigée Humidité : ",
        error
      );

      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Tableau de correspondance humidité.

let temperatureCorrigeeHumiditeTest = 11;
let correspondancePressionsHumidite;

const getCorrespondanceHumidite = () => {
  return new Promise((resolve, reject) => {
    try {
      // Appel direct de la fonction car elle retourne une valeur synchrone
      correspondancePressionsHumidite = tableauCorrespondanceHumidite(
        temperatureCorrigeeHumide
      );

      if (correspondancePressionsHumidite !== undefined) {
        console.log(
          "✅ SUCCÈS | Gestion Humidité 13 | Correspondance humidité : ",
          correspondancePressionsHumidite
        );
        resolve(correspondancePressionsHumidite);
      } else {
        throw new Error(
          "🔴 THROWED ERROR | Correspondance humidité non trouvée pour la température donnée."
        );
      }
    } catch (error) {
      console.log(
        "🔴 ERROR | gestions Humidité | Correspondance humidité",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Calcule du taux d'humidité.

let tauxHumidite;
let deltaHum;

let calculeTauxHumidite = () => {
  return new Promise((resolve, reject) => {
    try {
      // Calcul du taux d'humidité
      tauxHumidite = parseFloat(
        (
          ((correspondancePressionsHumidite -
            1013 *
              0.000662 *
              (temperatureCorrigeeSec - temperatureCorrigeeHumide)) /
            correspondancePressions) *
          100
        ).toFixed(2)
      );

      console.log(
        "✅ SUCCÈS | Gestion Humidité 14 | Taux Humidite",
        tauxHumidite
      );

      // Calcul du delta entre la consigne et le taux d'humidité
      deltaHum = parseFloat((tauxHumidite - consigne).toFixed(1));

      console.log(
        "✅ SUCCÈS | Gestion Humidité 15 | Delta humidité : ",
        deltaHum
      );

      // Résolution de la promesse avec les valeurs calculées
      resolve({ tauxHumidite, deltaHum });
    } catch (error) {
      console.log(
        "🔴 ERROR | gestions Humidité | Calcule du taux d'humidité",

        error
      );

      // Rejet de la promesse en cas d'erreur
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Action après le calcule du delta.

let actionApresCalculeDelta = () => {
  return new Promise((resolve, reject) => {
    try {
      if (deltaHum > 2) {
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | DeltaHum >  2 | On ne fait rien"
          )
        );
      }

      if (deltaHum <= 2 && deltaHum >= -2) {
        //* Pas d'action car interval entre 2% et -2%"
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | deltaHum <= 2 && deltaHum >= -2 | Pas d'action car interval entre 2% et -2%"
          )
        );
      }

      if (deltaHum >= -5 && deltaHum < -2) {
        //* Activation de l'eau au sol.
        gpioActionOn(16);
        console.log(
          "✅ SUCCÈS | Gestion Humidité 16 | deltaHum >= -5 && deltaHum < -2 | Activation de l'eau au sol"
        );

        //* Déactivation de l'eau au sol.
        setTimeout(() => {
          gpioActionOff(16);

          resolve(
            console.log(
              "✅ SUCCÈS | Gestion Humidité 16 | Déactivation de l'eau au sol."
            )
          );
        }, 10000);
      }

      if (deltaHum >= -10 && deltaHum < -5) {
        //* Activation de l'eau au sol.
        gpioActionOn(16);
        console.log(
          "✅ SUCCÈS | Gestion Humidité 16 | deltaHum >= -10 && deltaHum < -5 | Activation de l'eau au sol"
        );

        //* Déactivation de l'eau au sol.
        setTimeout(() => {
          gpioActionOff(16);

          resolve(
            console.log(
              "✅ SUCCÈS | Gestion Humidité 16 | Déactivation de l'eau au sol."
            )
          );
        }, 10000);
      }

      if (deltaHum < -10) {
        //* Activation de l'eau au sol.
        gpioActionOn(16);
        console.log(
          "✅ SUCCÈS | Gestion Humidité 16 | deltaHum < -10 | Activation de l'eau au sol"
        );

        //* Déactivation de l'eau au sol.
        setTimeout(() => {
          gpioActionOff(16);

          resolve(
            console.log(
              "✅ SUCCÈS | Gestion Humidité 16 | Déactivation de l'eau au sol."
            )
          );
        }, 10000);
      }
    } catch (error) {
      reject();
      console.log("ERREUR calcul action delta :", error);
    }
  });
};

//? --------------------------------------------------

//? Enregistrement des données dans la BD.

let enregistrementDesDonnees = () => {
  return new Promise((resolve, reject) => {
    gestionHumModels
      .create({
        tauxHumidite: tauxHumidite,
        deltaHum: deltaHum,
        valeursMesureSec180: temperatureCorrigeeSec,
        valeursMesureHum90: temperatureCorrigeeHumide,
        consigne: consigne,
        valeurAxeX: valeurAxeX,
        jourDuCycle: jourDuCycle,
      })

      .then((result) => {
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | Enregistrement des données dans la BD sous l'ID : ",
            result.dataValues.id
          )
        );
      })
      .catch((error) => {
        reject(
          console.log(
            "🔴 ERROR | gestions Humidité | Enregistrement des données dans la BD : ",
            error
          )
        );
      });
  });
};

//? --------------------------------------------------

//? Exécution du script gestion humidité.
(async function gestionHumiditeHandler() {
  try {
    await recuperationDesDatasHumidite();
    await constructionDeLaValeurDeLaxeX();
    await recuperationDeEtalonageSec();
    await mesureDeLaTemperatureMoyenneSec();
    await calculeDeLaTemperatureMoyenneSec();
    await calculeDeLaTempératureCorrigeeSec();
    await getCorrespondanceSec();
    await recuperationDeEtalonageHumide();
    await mesureDeLaTemperatureMoyenneHumidite();
    await calculeDeLaTemperatureMoyenneHumidite();
    await calculeDeLaTemperatureCorrigeeHumide();
    await getCorrespondanceHumidite();
    await calculeTauxHumidite();
    await actionApresCalculeDelta();
    await enregistrementDesDonnees();
  } catch (error) {
    console.error(
      "🟠 Erreur dans le processus d'exécution du script gestion humidité",
      JSON.stringify(error)
    );
  }
})();
