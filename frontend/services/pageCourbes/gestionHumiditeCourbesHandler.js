//? Récupération du taux d'humidite.

let tauxHumidite;

const getValeursTauxHumidite = async () => {
  try {
    const url =
      "http://localhost:3003/gestionCourbesRoutesFront/getTauxHumiditeCourbe/";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Valeurs Taux Humidite : ", data);

    const { tauxHumiditeCourbe } = data;
    tauxHumidite = tauxHumiditeCourbe;
    let tailleTableau = tauxHumiditeCourbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 1 courbe humidité OK | Récupération du taux d'humidite : ",
    //   {
    //     tauxHumidite,
    //     tailleTableau,
    //   }
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Stockage du taux d'humidite dans un tableau.

let tableauValeursTauxHumidite = [];

const stockerValeursTauxHumidite = async () => {
  try {
    tableauValeursTauxHumidite = tauxHumidite.map((item) => ({
      x: item.valeurAxeX,
      y: item.tauxHumidite,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 2 courbe humidité OK | Stockage du taux d'humidite :",
    //   tableauValeursTauxHumidite
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs température air dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Récupération des Datas Humidite.

let consigneHumidite;

const getConsigneHumiditeCourbe = async () => {
  try {
    const url =
      "http://localhost:3003/gestionCourbesRoutesFront/getConsigneHumiditeCourbe/";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    //console.log("⭐ DATA BRUTE | get datas humidité : ", data);

    const { consigneHumiditeCourbeCourbe } = data;
    consigneHumidite = consigneHumiditeCourbeCourbe;
    let tailleTableau = consigneHumiditeCourbeCourbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 3 courbes humidité | Récupération des Datas Humidite : ",
    //   {
    //     consigneHumidite,
    //     tailleTableau,
    //   }
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Stockage des valeurs consignes air dans un tableau.

let tableauValeursConsigneHumidite = [];

const stockerValeursConsigneHumidite = async () => {
  try {
    tableauValeursConsigneHumidite = consigneHumidite.map((item) => ({
      x: item.valeurAxeX,
      y: item.consigneHum,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 4 courbe humidité OK | Stockage des datas humidite :",
    //   tableauValeursConsigneHumidite
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Construction du graphique temperature air.

let constructionDuGraphiqueHumidite = async () => {
  try {
    const ctxHumidite = await document
      .getElementById("myChartHum")
      .getContext("2d");

    const myLabelsAir = [];

    const data = {
      labels: myLabelsAir,

      datasets: [
        //? Courbe taux humidité
        {
          label: "Courbe Taux Humidité",
          data: tableauValeursTauxHumidite,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          lineTension: 0.2,
          pointRadius: 0,
        },
        {
          label: "Courbe Consigne humidité",
          data: tableauValeursConsigneHumidite,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          lineTension: 0.2,
          pointRadius: 0,
        },
      ],
    };

    const optionsHumidite = {
      animation: {
        duration: 0,
      },
    };

    const configHumidite = {
      type: "line",
      data,
      options: optionsHumidite,
    };

    await new Chart(ctxHumidite, configHumidite);

    // console.log("🟢 SUCCESS |  Étape 5 OK | Construction graphique.");
  } catch (error) {
    console.log("🔴 ERREUR | Étape 5 | Construction graphique :", error);
  }
};

//? -------------------------------------------------

//? Lancer la construction du graphique courbe air.

(async function constructionCourbeHumidite() {
  try {
    await getValeursTauxHumidite();
    await stockerValeursTauxHumidite();
    await getConsigneHumiditeCourbe();
    await stockerValeursConsigneHumidite();
    await constructionDuGraphiqueHumidite();
  } catch (error) {
    console.error(
      "🟠 Erreur dans le processus d'exécution du script gestion humidité",
      JSON.stringify(error)
    );
  }
})();
