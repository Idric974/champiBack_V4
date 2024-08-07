//? Récupération du taux humidité.

let tauxHumidite;
let tauxHumiditeLocalStorage;
let temperatureSec;
let temperatureSecLocalStorage;
let temperatureHumide;
let temperatureHumideLocalStorage;

const getTauxHumidite = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionHumiditeRoutesFront/getTauxHumidite",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | Gestion humidité | Récupération du taux humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Taux humidite : ", data);

    const { dataTauxHumidite } = data;

    //* Taux humidité.

    tauxHumidite = dataTauxHumidite.tauxHumidite;
    // console.log("🟢 SUCCESS | Taux humidite : ", tauxHumidite);

    localStorage.setItem("Gestion Humidite | Taux humidite", tauxHumidite);
    tauxHumiditeLocalStorage = localStorage.getItem(
      "Gestion Humidite | Taux humidite"
    );

    document.getElementById("tauxHumidite").innerHTML =
      tauxHumiditeLocalStorage + "%";

    //* -------------------------------------------------

    //* Temperature Sec.

    temperatureSec = dataTauxHumidite.valeursMesureSec180;
    // console.log("🟢 SUCCESS | Temperature Sec : ", temperatureSec);

    localStorage.setItem("Gestion Humidite | Temperature Sec", temperatureSec);
    temperatureSecLocalStorage = localStorage.getItem(
      "Gestion Humidite | Temperature Sec"
    );

    document.getElementById("temperatureSec").innerHTML =
      temperatureSecLocalStorage + "°C";

    //* -------------------------------------------------

    //* Temperature Humide.

    temperatureHumide = dataTauxHumidite.valeursMesureHum90;
    // console.log("🟢 SUCCESS | Temperature Humide : ", temperatureHumide);

    localStorage.setItem(
      "Gestion Humidite | Temperature Humide",
      temperatureHumide
    );
    temperatureHumideLocalStorage = localStorage.getItem(
      "Gestion Humidite | Temperature Humide"
    );

    document.getElementById("temperatureHum").innerHTML =
      temperatureHumideLocalStorage + "°C";

    //* -------------------------------------------------
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

getTauxHumidite();

//? -------------------------------------------------

//? Récupération de la consigne Humidité.

let consigneHumidite;
let consigneHumiditeHisto;
let consigneHumiditeLocalStorage;
let pasHumidite;
let pasHumiditeLocalStorage;
let objectifHumidite;
let objectifHumiditeLocalStorage;

const getConsigneHumidite = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionHumiditeRoutesFront/getConsigneHumidite",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | Gestion humidité | Récupération de la consigne Humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("⭐ DATA BRUTE | Consigne Humidité : ", data);

    const { dataConsigneHumidite } = data;

    //* Consigne Humidité à afficher.

    consigneHumidite = dataConsigneHumidite.consigneHum;
    console.log("🟢 SUCCESS | Consigne Humidité : ", consigneHumidite);

    document.getElementById("consigneHumidite").innerHTML =
      consigneHumidite + "%";

    //* -------------------------------------------------

    //* Consigne Humidité.

    consigneHumiditeHisto = dataConsigneHumidite.consigneHum;
    console.log("🟢 SUCCESS | Consigne Humidité : ", consigneHumiditeHisto);

    localStorage.setItem(
      "Gestion Humidite | Taux humidite",
      consigneHumiditeHisto
    );
    consigneHumiditeLocalStorage = localStorage.getItem(
      "Gestion Humidite | Taux humidite"
    );

    document.getElementById("dernierConsigneHumEntree").innerHTML =
      consigneHumiditeLocalStorage + "°C";

    //* -------------------------------------------------

    //* Pas Humidité.

    pasHumidite = dataConsigneHumidite.pasHum;
    console.log("🟢 SUCCESS | Pas Humidité : ", pasHumidite);

    localStorage.setItem("Gestion Humidite | Pas humidite", pasHumidite);
    pasHumiditeLocalStorage = localStorage.getItem(
      "Gestion Humidite | Pas humidite"
    );

    document.getElementById("dernierConsignePasEntree").innerHTML =
      pasHumiditeLocalStorage + "°C";

    //* -------------------------------------------------

    //* Objectif Humidité.

    objectifHumidite = dataConsigneHumidite.objectifHum;
    console.log("🟢 SUCCESS | Objectif Humidité : ", objectifHumidite);

    localStorage.setItem(
      "Gestion Humidite | Objectif humidite",
      objectifHumidite
    );
    objectifHumiditeLocalStorage = localStorage.getItem(
      "Gestion Humidite | Objectif humidite"
    );

    document.getElementById("dernierConsigneObjectifEntree").innerHTML =
      objectifHumiditeLocalStorage + "°C";

    //* -------------------------------------------------
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

getConsigneHumidite();

//? -------------------------------------------------

//? Post consigne humidité.

document
  .getElementById("validationConsigneHum")
  .addEventListener("click", function () {
    postConsigneHumidite();
  });

const postConsigneHumidite = async () => {
  try {
    const consigneHumForm = document.getElementById("consigneHumForm").value;

    const response = await fetch(
      "http://localhost:3003/gestionHumiditeRoutesFront/postConsigneHumidite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consigneHum: consigneHumForm,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log("consigne humidité : ", data);
  } catch (error) {
    console.log("Erreur lors de l'envoi de la requête fetch :", error);
  }
};

//? Post du pas et de l'objectif humidité.

document
  .getElementById("validationdataHum")
  .addEventListener("click", function () {
    postPasetObjectifHumidite();
  });

const postPasetObjectifHumidite = async () => {
  try {
    const pasHumForm = document.getElementById("pasHumForm").value;
    localStorage.setItem("gestionHum ==> Dernier Pas:", pasHumForm);

    const objectifHumForm = document.getElementById("objectifHumForm").value;
    localStorage.setItem("gestionHum ==> Dernier Objectif:", objectifHumForm);

    const response = await fetch(
      "http://localhost:3003/gestionHumiditeRoutesFront/postPasetObjectifHumidite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pasHum: pasHumForm,
          objectifHum: objectifHumForm,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log("consigne humidité : ", data);
  } catch (error) {
    console.log("Erreur lors de l'envoi de la requête fetch :", error);
  }
};
