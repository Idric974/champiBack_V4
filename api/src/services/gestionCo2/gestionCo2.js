require("dotenv").config();
const http = require("http");
const { resolve } = require("path");
const sequelize = require("sequelize");
const db = require("../../models");
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
const numSalle = require("../../utils/numSalle/configNumSalle");

//? Switch entre le mode développement et le mode production.

let masterURL;

const switchEntreDeveloppementEtProduction = () => {
  return new Promise((resolve, reject) => {
    try {
      if (process.env.CHAMPIBACK_STATUS === "developpement") {
        masterURL = "http://192.168.1.9:5000/getCo2/" + numSalle;
        resolve(console.log("MODE DÉVELOPPEMENT ACTIF"));
      }

      if (process.env.CHAMPIBACK_STATUS === "production") {
        masterURL = "http://192.168.0.10:5000/getCO2/" + numSalle;
        resolve(console.log("MODE PRODUCTION ACTIF"));
      }
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

//? -------------------------------------------------

//? Demande de mesure à la master.

let tauxCo2;

const demandeDeMesureMaster = () => {
  return new Promise((resolve, reject) => {
    let data = "";
    try {
      http
        .get(masterURL, (resp) => {
          resp.on("data", (chunk) => {
            data += chunk;
            console.log(
              "✅ SUCCÈS | Gestion CO2 1 Demande de mesure à la master | RESP.ON DATA : ",
              data
            );
          });

          resp.on("end", () => {
            try {
              tauxCo2 = parseFloat(data.split('undefined"')[1]);
              console.log(
                "✅ SUCCÈS | Gestion CO2 1 Demande de mesure à la master | RESP.ON END : ",
                tauxCo2
              );

              // console.log("DATA", data);

              resolve(tauxCo2);
            } catch (error) {
              reject(
                "🔴 ERROR | Gestion CO2 1 Demande de mesure à la master | Parsing error : " +
                  error.message
              );
            }
          });
        })
        .on("response", function (resp) {
          if (resp.statusCode !== 200) {
            reject(
              "🔴 ERROR | Gestion CO2 2 Demande de mesure à la master | Status Code | RESP.ON RESPONSE " +
                resp.statusCode
            );
          }
        })
        .on("error", (err) => {
          reject(
            "🔴 ERROR | Gestion CO2 2 Demande de mesure à la master | RESP.ON ERROR : " +
              err.message
          );
        });
    } catch (error) {
      reject(
        "🟠 TRY CATCH ERROR : Demande de mesure à la master : " + error.message
      );
    }
  });
};

//? -----------------------------------------------------------

//? Récupération de la consigne Co2.

let consigneCo2;
let pasCo2;
let objectifCo2;

const recuperationDeLaConsigneCo2 = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionCo2DataModels
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);
          gestionCo2DataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log("DATA Brute" + result);
              lastId = result.id;

              consigneCo2 = result.consigneCo2;
              // console.log("La consigne est : ", consigneCo2);

              pasCo2 = result.pasCo2;
              // console.log("Pas :      ", pasCo2);

              objectifCo2 = result.objectifCo2;
              // console.log("Objectif : ", objectifCo2);

              resolve({ consigneCo2, pasCo2, objectifCo2 });
            });
        });
    } catch (error) {
      reject(
        console.log(
          "🟠 TRY CATCH ERROR : Récupération de la consigne Co2 :",
          error
        )
      );
    }
  });
};

//? -----------------------------------------------------------

//? Calcule du delta Co2.

let deltaCo2;

const calculeDuDeltaCo2 = () => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof tauxCo2 !== "number" || typeof consigne !== "number") {
        console.error("Erreur : tauxCo2 ou consigne ne sont pas des nombres.");
      } else {
        deltaCo2 = tauxCo2 - consigne;
        resolve(console.log("deltaCo2 :", deltaCo2));
      }
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : Calcule du delta Co2 :", error));
    }
  });
};

//? -----------------------------------------------------------

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
      gestionCo2Models
        .findOne({
          attributes: [[sequelize.fn("max", sequelize.col("id")), "maxid"]],
          raw: true,
        })
        .then((id) => {
          if (!id) {
            throw new Error("No max ID found");
          }

          return gestionCo2Models.findOne({
            where: { id: id.maxid },
          });
        })
        .then((result) => {
          if (!result) {
            throw new Error("No record found with max ID");
          }

          dateDemarrageCycle = new Date(result.dateDemarrageCycle);

          console.log(
            "✅ SUCCÈS | Gestion Co2 2 | Date de démarrage du cycle :",
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
            "✅ SUCCÈS | Gestion Co2 3 | Construction de la valeur de l'axe X : ",
            valeurAxeX
          );

          resolve(valeurAxeX);
        })
        .catch((error) => {
          console.log(
            "🔴 ERROR | Gestion Co2 | Construction de la valeur de l'axe X",
            error
          );
          reject(error);
        });
    } catch (error) {
      console.log(
        "🔴 ERROR | Gestion Co2 | Construction de la valeur de l'axe X",
        error
      );
      reject(error);
    }
  });
};

//? --------------------------------------------------

//? Enregistrement en base de donnes.

const enregistrementEnBaseDeDonnes = () => {
  return new Promise((resolve, reject) => {
    gestionCo2Models
      .create({
        tauxCo2: tauxCo2,
        deltaCo2: deltaCo2,
        daysCo2: daysCo2,
        heuresCo2: heuresCo2,
        consigne: consigneCo2,
        valeurAxeX: valeurAxeX,
        jourDuCycle: jourDuCycle,
      })
      .then(() => {
        console.log("Données transférées à la base de données gestion_co2s.");
      })
      .catch((error) => {
        console.log(
          cyan,
          "[ GESTION CO2 CALCULES  ] Erreur dans le processus d’enregistrement dans la base gestion_co2s",
          error
        );
      });

    try {
      resolve(console.log("🟢 SUCCESS : my resolve"));
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

//? --------------------------------------------------

//? Exécution du script gestion Co2.
(async function gestionHumiditeHandler() {
  try {
    await switchEntreDeveloppementEtProduction();
    await demandeDeMesureMaster();
    await recuperationDeLaConsigneCo2();
    await calculeDuDeltaCo2();
    await constructionDeLaValeurDeLaxeX();
    await enregistrementEnBaseDeDonnes();
  } catch (error) {
    console.error(
      "🟠 Erreur dans le processus d'exécution du script gestion Co2",
      JSON.stringify(error)
    );
  }
})();
