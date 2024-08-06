console.log("TEST");

//? Récupération des data température air.

let dataCourbeVanne;

const getValeursTemperatureAirVanne = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionCourbesRoutesFront/getTemperatureAirCourbe/",
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
    // console.log("⭐ DATA BRUTE | getDateDemarrageDuCycle: ", data);

    const { temperatureAirCourbe } = data;
    dataCourbeVanne = temperatureAirCourbe;
    let tailleTableau = temperatureAirCourbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 1 OK | Data courbes vannes récupérées : ",
    //   {
    //     dataCourbeVanne,
    //     tailleTableau,
    //   }
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données data courbes vannes :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Stockage des valeurs vanne dans un tableau.

let tableauValeursVanne = [];

const stockerValeursVanne = async () => {
  try {
    tableauValeursVanne = dataCourbeVanne.map((item) => ({
      x: item.valeurAxeX,
      y: item.etatRelay,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 2 OK | Valeurs vanne stockées dans le tableau :",
    //   tableauValeursVanne
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs vanne dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Construction du graphique vanne.

let constructionDuGraphiqueVanne = () => {
  try {
    const ctxAir = document.getElementById("myChartAirVanne").getContext("2d");

    const myLabelsAir = [];

    const data = {
      labels: myLabelsAir,

      datasets: [
        {
          label: "Courbe Vanne Air",
          data: tableauValeursVanne,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
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
      optionsAir,
    };

    new Chart(ctxAir, configCo2);

    // console.log("🟢 SUCCESS |  Étape 3 OK | Construction graphique.");
  } catch (error) {
    console.log("🔴 ERREUR | Étape 5 | Construction graphique :", error);
  }
};

//? -------------------------------------------------

//? Lancer la construction du graphique courbe air.

const constructionCourbeVanne = async () => {
  try {
    await getValeursTemperatureAirVanne();
    await stockerValeursVanne();
    await constructionDuGraphiqueVanne();
  } catch (err) {
    console.log("🔺 ERREUR | Resolve promise | Construction courbe air", err);
  }
};

constructionCourbeVanne();
