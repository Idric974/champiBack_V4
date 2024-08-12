//? Récupération du taux humidité.

let tauxHumidite;
let tauxHumiditeLocalStorage;
let temperatureSec;
let temperatureSecLocalStorage;
let temperatureHumide;
let temperatureHumideLocalStorage;

const getTauxHumidite = async () => {
  try {
    const url =
      "http://localhost:3003/gestionHumiditeRoutesFront/getTauxHumidite";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion humidité | Récupération du taux humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Taux humidite : ", data);

    const { dataTauxHumidite } = data;

    //* Taux humidité.

    tauxHumidite = dataTauxHumidite.tauxHumidite;
    // console.log("🟢 SUCCESS | Taux humidite : ", tauxHumidite);

    localStorage.setItem("Gestion Humidite | Taux humidite", tauxHumidite);

    const tauxHumiditeLocalStorage = localStorage.getItem(
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
      JSON.stringify(error)
    );
  }
};

getTauxHumidite();

//? -------------------------------------------------

//? Récupération des datas humidité.

let consigneHumidite;
let consigneHumiditeHisto;
let consigneHumiditeLocalStorage;
let pasHumidite;
let pasHumiditeLocalStorage;
let objectifHumidite;
let objectifHumiditeLocalStorage;

const getDatasHumidite = async () => {
  try {
    const url =
      "http://localhost:3003/gestionHumiditeRoutesFront/getDatasHumidite";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion humidité | Récupération des datas humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Récupération des datas humidité : ", data);

    const { dataConsigneHumidite } = data;

    //* Consigne Humidité à afficher.

    consigneHumidite = dataConsigneHumidite.consigneHum;
    // console.log("🟢 SUCCESS | Consigne Humidité : ", consigneHumidite);

    document.getElementById("consigneHumidite").innerHTML =
      consigneHumidite + "%";

    //* -------------------------------------------------

    //* Historique Consigne Humide.

    let consigneHumiditeHistorique = localStorage.getItem(
      "Gestion Humidite | Derniere Consigne"
    );
    // console.log("consigneHumiditeHistorique =", consigneHumiditeHistorique);

    document.getElementById("dernierConsigneHumEntree").innerHTML =
      consigneHumiditeHistorique;

    //* -------------------------------------------------
    //* Historique Pas Humide.

    let pasHumiditeHistorique = localStorage.getItem(
      "Gestion Humidite | Dernier Pas"
    );
    // console.log("pasHumiditeHistorique =", pasHumiditeHistorique);
    document.getElementById("dernierConsignePasEntree").innerHTML =
      pasHumiditeHistorique;

    //* -------------------------------------------------

    //* Historique Objectif Humide.

    let objectifHistorique = localStorage.getItem(
      "Gestion Humidite | Dernier Objectif"
    );
    // console.log("objectifHistorique =", objectifHistorique);
    document.getElementById("dernierConsigneObjectifEntree").innerHTML =
      objectifHistorique;
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des datas humidité :",
      JSON.stringify(error)
    );
  }
};

getDatasHumidite();

//? -------------------------------------------------

//? Calcule du delta Humidite - Consigne.

let delta;
const calculeDuDeltaHumiditeConsigne = async () => {
  await getTauxHumidite();
  await getDatasHumidite();

  delta = tauxHumidite - consigneHumidite;
  // console.log("Delta Humidite - Consigne ====> ", delta);

  localStorage.setItem("Gestion Humidite | Delta Humidite", delta);

  let deltaHumiditeHistorique = localStorage.getItem(
    "Gestion Humidite | Delta Humidite"
  );

  document.getElementById("deltaHumidite").innerHTML =
    deltaHumiditeHistorique + "°C";
};

calculeDuDeltaHumiditeConsigne();

//? -------------------------------------------------

//? Post consigne humidité.

document
  .getElementById("validationConsigneHum")
  .addEventListener("click", function (event) {
    // event.preventDefault();
    postConsigneHumidite();
  });

const postConsigneHumidite = async () => {
  try {
    const consigneHumForm = document.getElementById("consigneHumForm").value;

    const url =
      "http://localhost:3003/gestionHumiditeRoutesFront/postConsigneHumidite";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consigneHum: consigneHumForm,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion humidité | Post consigne humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("consigne humidité : ", data);

    localStorage.setItem(
      "Gestion Humidite | Derniere Consigne",
      data.consigneHum
    );
  } catch (error) {
    console.log(
      "Erreur lors du post consigne humidité : ",
      JSON.stringify(error)
    );
  }
};

//? -------------------------------------------------

//? Post des datas humidité.

document
  .getElementById("validationdataHum")
  .addEventListener("click", function (event) {
    //  event.preventDefault();
    postDatasHumidite();
  });

const postDatasHumidite = async () => {
  try {
    const pasHumForm = document.getElementById("pasHumForm").value;
    const objectifHumForm = document.getElementById("objectifHumForm").value;

    const url =
      "http://localhost:3003/gestionHumiditeRoutesFront/postDatasHumidite";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pasHum: pasHumForm,
        objectifHum: objectifHumForm,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion humidité | Post datas humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("Post des datas humidité : ", data);

    localStorage.setItem("Gestion Humidite | Dernier Pas", data.pasHum);
    localStorage.setItem(
      "Gestion Humidite | Dernier Objectif",
      data.objectifHum
    );
  } catch (error) {
    console.log("Erreur lors post des datas humidité", JSON.stringify(error));
  }
};

//? -------------------------------------------------
