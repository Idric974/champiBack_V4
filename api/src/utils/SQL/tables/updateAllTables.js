require("dotenv").config();
const db = require("../../../models");
const Sequelize = require("sequelize");

async function updateTables() {
  try {
    //! Gestion Air

    //* Valeurs.
    const updateGestionAir = db.gestionAir.create({
      temperatureAir: 25,
      deltaAir: 10,
      days: 0,
      heures: 0,
      actionRelay: 0,
      etatRelay: 0,
      consigne: 15,
      valeurAxeX: "0",
      jourDuCycle: "1",
    });

    //* Data.
    const updateGestionAirData = db.gestionAirData.create({
      consigneAir: 18,
      pasAir: 15,
      objectifAir: 11,
    });

    //! Gestion Humidité

    //* Valeurs.
    const updateGestionHum = db.gestionHum.create({
      tauxHumidite: 0,
      deltaHum: 0,
      valeursMesureSec180: 0,
      valeursMesureHum90: 0,
      daysHum: 0,
      heuresHum: 0,
      consigne: "0",
      valeurAxeX: "0",
      jourDuCycle: "0",
    });

    //* Data.
    const updateGestionHumData = db.gestionHumData.create({
      consigneHum: 0,
      pasHum: 0,
      objectifHum: 0,
    });

    //! Gestion Co2

    //* Valeurs.
    const updateGestionCo2 = db.gestionCo2.create({
      tauxCo2: 1300,
      deltaCo2: 500,
      daysCo2: 2,
      heuresCo2: 40,
      consigne: "1100",
      valeurAxeX: "jour 1 - 10h30",
      jourDuCycle: "1",
    });

    //* Data.
    const updateGestionCo2Data = db.gestionCo2Data.create({
      consigneCo2: 0,
      pasCo2: 0,
      objectifCo2: 0,
    });

    //! Etalonnage Air.
    const updateEtalonnageAir = db.etalonnageAir.create({
      etalonnageAir: 0,
    });

    //! Etalonnage Hum Sec.
    const updateEtalonnageHumSec = db.etalonnageSec.create({
      etalonnageSec: 0,
    });

    //! Etalonnage Hum Hum.
    const updateEtalonnageHumHum = db.etalonnageHum.create({
      etalonnageHum: 0,
    });

    //! Etat relay.
    const lastId = await db.gestionAir
      .findOne({
        attributes: [[Sequelize.fn("max", Sequelize.col("id")), "maxid"]],
        raw: true,
      })
      .then((id) => id.maxid);

    const updateEtatRelay = db.gestionAir.create(
      { etatRelay: 0 },
      { where: { id: lastId } }
    );

    //! Courbes.
    const updateCourbe = db.gestionCourbes.create({
      dateDemarrageCycle: 0,
    });

    //! Etat Bouton Eau Sol.
    const updateEtatEauAuSol = db.gestionEtatBoutonRelayEauAuSol.create({
      etatRelayEauAuSol: 0,
    });

    //! Gestion Substrat.
    //* Valeurs.
    const updateSubstrat = db.gestionSubstrat.create({
      temperatureSubstrat: 0,
      days: 0,
      heures: 0,
      actionRelay: 0,
      etatRelay: 0,
      valeurAxeX: "0",
      jourDuCycle: "1",
    });

    //* Data.
    const updateGestionSubstratData = db.gestionSubstratData.create({
      consigneMaxDataSubstrat: 0,
      consigneMinDataSubstrat: 0,
    });

    //! Vannes.
    const updateVannes = db.gestionAirVannes.create({
      vanneActive: "a",
    });

    // Attendre que toutes les opérations soient terminées
    await Promise.all([
      updateGestionAir,
      updateGestionAirData,
      updateGestionHum,
      updateGestionHumData,
      updateGestionCo2,
      updateGestionCo2Data,
      updateEtalonnageAir,
      updateEtalonnageHumSec,
      updateEtalonnageHumHum,
      updateEtatRelay,
      updateCourbe,
      updateEtatEauAuSol,
      updateSubstrat,
      updateGestionSubstratData,
      updateVannes,
    ]);

    console.log("Toutes les tables ont été mises à jour avec succès");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la mise à jour des tables :",
      error
    );
  }
}

updateTables();
