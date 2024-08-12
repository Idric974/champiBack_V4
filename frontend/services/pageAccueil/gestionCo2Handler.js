//? Récupération du taux de CO2.

let tauxCo2;
let tauxCo2LocalStorage;

const getTauxCo2 = async () => {
  try {
    const url = "http://localhost:3003/gestionCo2RoutesFront/getTauxCo2/";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Taux CO2 : ", data);

    const { dataCo2 } = data;

    //* Taux Co2.

    tauxCo2 = dataCo2.tauxCo2;
    // console.log("🟢 SUCCESS | Taux Co2 : ", tauxCo2);

    localStorage.setItem("Gestion Co2 | Taux Co2", tauxCo2);

    const tauxCo2LocalStorage = localStorage.getItem("Gestion Co2 | Taux Co2");

    document.getElementById("tauxCo2").innerHTML = tauxCo2LocalStorage + " %";

    //* -------------------------------------------------
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
  }
};

getTauxCo2();

//? -------------------------------------------------

//? Récupération des datas Co2.

let consigneCo2;
let consigneCo2Historique;
let pasCo2Historique;
let objectifHistorique;

const getDatasCo2 = async () => {
  try {
    const url = "http://localhost:3003/gestionCo2RoutesFront/getDatasCo2";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion Co2 | Récupération des datas Co2 : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Récupération des datas Co2 : ", data);

    const { dataCo2 } = data;

    //* Consigne Co2 à afficher.

    consigneCo2 = dataCo2.consigneCo2;
    // console.log("🟢 SUCCESS | Consigne Co2 : ", consigneCo2);

    document.getElementById("consigneCo2").innerHTML = consigneCo2 + "%";

    //* -------------------------------------------------

    //* Historique Consigne Co2.

    consigneCo2Historique = localStorage.getItem(
      "Gestion Co2 | Derniere Consigne"
    );
    // console.log("consigneHumiditeHistorique =", consigneCo2Historique);

    document.getElementById("dernierConsigneCo2Entree").innerHTML =
      consigneCo2Historique;

    //* -------------------------------------------------
    //* Historique Pas Humide.

    pasCo2Historique = localStorage.getItem("Gestion Co2 | Dernier Pas");
    // console.log("pasCo2Historique =", pasCo2Historique);
    document.getElementById("dernierPasCo2Entree").innerHTML = pasCo2Historique;

    //* -------------------------------------------------

    //* Historique Objectif Co2.

    objectifHistorique = localStorage.getItem("Gestion Co2 | Dernier Objectif");
    // console.log("objectifHistorique =", objectifHistorique);
    document.getElementById("dernierObjectifCo2Entree").innerHTML =
      objectifHistorique;
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des datas humidité :",
      JSON.stringify(error)
    );
  }
};

getDatasCo2();

//? -------------------------------------------------

//? Calcule du delta Co2 - Consigne.

let deltaCo2;
const calculeDuDeltaCo2Consigne = async () => {
  await getTauxCo2();
  await getDatasCo2();

  deltaCo2 = tauxCo2 - consigneCo2;
  // console.log("Delta Co2 - Consigne :", deltaCo2);

  localStorage.setItem("Gestion Co2 | Delta Co2", deltaCo2);

  const deltaCo2Historique = localStorage.getItem("Gestion Co2 | Delta Co2");

  document.getElementById("deltaCo2").innerHTML = deltaCo2Historique + "°C";
};

calculeDuDeltaCo2Consigne();

//? -------------------------------------------------

//? Calcule du la durée de la descente Co2.

let nbJourCo2;
let nbHeureCo2;
let dureeDescenteCo2;

const calculeDuLaDureeDeLaDescenteCo2 = async () => {
  await getTauxCo2();
  await getDatasCo2();

  if (
    consigneCo2 == 0 ||
    consigneCo2 == "" ||
    consigneCo2 == null ||
    pasCo2Historique == 0 ||
    pasCo2Historique == "" ||
    pasCo2Historique == null ||
    objectifHistorique == 0 ||
    objectifHistorique == "" ||
    objectifHistorique == null
  ) {
    // console.log("Pas de paramètre pas de calcule des jours Hum");

    return;
  } else {
    let dureeDescenteCo2 =
      ((consigneCo2 - objectifHistorique) / pasCo2Historique) * 12;

    console.log("Durée Descente Co2", dureeDescenteCo2);

    nbJourCo2 = Math.floor(dureeDescenteCo2 / 24);

    dureeDescenteCo2 %= 360;

    nbHeureCo2 = Math.floor(dureeDescenteCo2 / 36);

    console.log(
      "La durée de la descente Air est de  : " +
        nbJourCo2 +
        " Jours " +
        nbHeureCo2 +
        " Heures "
    );
  }

  localStorage.setItem("Gestion Co2 | Nombre de jour", nbJourCo2);
  let nombreDeJour = localStorage.getItem("Gestion Co2 | Nombre de jour");

  localStorage.setItem("Gestion Co2 | Nombre de heure", nbHeureCo2);
  let nombreDeHeure = localStorage.getItem("Gestion Co2 | Nombre de heure");

  document.getElementById("descenteCo2").innerHTML =
    nombreDeJour +
    " " +
    (nombreDeJour <= 1 ? "Jour" : "Jours") +
    " et " +
    nombreDeHeure +
    " " +
    (nombreDeHeure <= 1 ? "Heure" : "Heures");
};

calculeDuLaDureeDeLaDescenteCo2();

//? -------------------------------------------------

//? Post consigne Co2.

document
  .getElementById("validationConsigneCo2")
  .addEventListener("click", function (event) {
    // event.preventDefault();
    postConsigneCo2();
  });

const postConsigneCo2 = async () => {
  try {
    const consigneCo2Form = document.getElementById("consigneCo2Form").value;

    const url = "http://localhost:3003/gestionCo2RoutesFront/postConsigneCo2";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consigneCo2: consigneCo2Form,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion Co2 | Post consigne humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("Consigne Co2 : ", data);

    localStorage.setItem("Gestion Co2 | Derniere Consigne", data.consigneCo2);
  } catch (error) {
    console.log("Erreur lors du post consigne Co2 : ", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Post des datas humidité.

document
  .getElementById("validationdataCo2")
  .addEventListener("click", function (event) {
    // event.preventDefault();
    postDatasCo2();
  });

const postDatasCo2 = async () => {
  try {
    const pasCo2Form = document.getElementById("pasCo2Form").value;
    const objectifCo2Form = document.getElementById("objectifCo2Form").value;

    const url = "http://localhost:3003/gestionCo2RoutesFront/postDatasCo2";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pasCo2: pasCo2Form,
        objectifCo2: objectifCo2Form,
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 THROWED ERROR | Gestion Co2 | Post datas humidité : ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("Post des datas Co2 ====> : ", data);

    localStorage.setItem("Gestion Co2 | Dernier Pas", data.pasCo2);

    localStorage.setItem("Gestion Co2 | Dernier Objectif", data.objectifCo2);
  } catch (error) {
    console.log("Erreur lors post des datas humidité", JSON.stringify(error));
  }
};

//? -------------------------------------------------
