//? Récupération Temperature Humidite.

let dataCourbeHumidite;

const getValeursTemperatureHumidite = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionCourbesRoutesFront/getTauxHumiditeCourbe/",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("⭐ DATA BRUTE | getValeursTemperatureHumidite: ", data);

    const { tauxHumiditeCourbe } = data;
    dataCourbeHumidite = tauxHumiditeCourbe;
    let tailleTableau = tauxHumiditeCourbe.length;

    console.log("🟢 SUCCESS |  Étape 1 OK | Data courbes récupérées : ", {
      dataCourbeHumidite,
      tailleTableau,
    });
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Stockage des valeurs température air dans un tableau.

let tableauValeursTauxHumidite = [];

const stockerValeursTauxHumidite = async () => {
  try {
    tableauValeursTauxHumidite = dataCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.tauxHumidite,
    }));

    console.log(
      "🟢 SUCCESS | Étape 2 OK | Valeurs température air stockées dans le tableau :",
      tableauValeursTauxHumidite
    );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs température air dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Récupération consigne Humidite.

let consigneHumidite;

const getConsigneHumiditeCourbe = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionCourbesRoutesFront/getConsigneHumiditeCourbe/",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `🔴 ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("⭐ DATA BRUTE | get Consigne HumiditeCourbe: ", data);

    const { consigneHumiditeCourbeCourbe } = data;
    consigneHumidite = consigneHumiditeCourbeCourbe;
    let tailleTableau = consigneHumiditeCourbeCourbe.length;

    console.log("🟢 SUCCESS |  Étape 1 OK | Data courbes récupérées : ", {
      consigneHumidite,
      tailleTableau,
    });
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
    tableauValeursConsigneHumidite = consigneCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.consigneHum,
    }));

    console.log(
      "🟢 SUCCESS | Étape 4 OK | Valeurs consigne stockées dans le tableau :",
      tableauValeursConsigneHumidite
    );
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
    const ctxAir = await document.getElementById("myChartHum").getContext("2d");

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

    const optionsAir = {
      animation: {
        duration: 0,
      },
    };

    const configCo2 = {
      type: "line",
      data,
      options: optionsAir,
    };

    await new Chart(ctxAir, configCo2);

    // console.log("🟢 SUCCESS |  Étape 5 OK | Construction graphique.");
  } catch (error) {
    console.log("🔴 ERREUR | Étape 5 | Construction graphique :", error);
  }
};

//? -------------------------------------------------

//? Lancer la construction du graphique courbe air.

(async function constructionCourbeHumidite() {
  try {
    await getValeursTemperatureHumidite();
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
