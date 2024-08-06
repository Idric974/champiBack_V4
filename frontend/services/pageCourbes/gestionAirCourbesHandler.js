//? Récupération des data température air.

let dataCourbeAir;

const getValeursTemperatureAir = async () => {
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
    dataCourbeAir = temperatureAirCourbe;
    let tailleTableau = temperatureAirCourbe.length;

    // console.log("🟢 SUCCESS |  Étape 1 OK | Data courbes récupérées : ", {
    //   dataCourbeAir,
    //   tailleTableau,
    // });
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

let tableauValeursTemperatureAir = [];

const stockerValeursTemperatureAir = async () => {
  try {
    tableauValeursTemperatureAir = dataCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.temperatureAir,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 2 OK | Valeurs température air stockées dans le tableau :",
    //   tableauValeursTemperatureAir
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs température air dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Récupération des consignes température air.

let consigneCourbeAir;

const getValeursConsigneAir = async () => {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionCourbesRoutesFront/getConsigneAirCourbe/",
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
    // console.log("⭐ DATA BRUTE | getValeursConsigne: ", data);

    const { consigneAirCourbe } = data;
    consigneCourbeAir = consigneAirCourbe;
    let tailleTableau = consigneAirCourbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 3 OK |  Valeurs data consigne récupérées : ",
    //   {
    //     consigneCourbeAir,
    //     tailleTableau,
    //   }
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération de valeurs data consigne :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//? -------------------------------------------------

//? Stockage des valeurs consignes air dans un tableau.

let tableauValeursConsigneAir = [];

const stockerValeursConsigneAir = async () => {
  try {
    tableauValeursConsigneAir = consigneCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.consigneAir,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 4 OK | Valeurs consigne stockées dans le tableau :",
    //   tableauValeursConsigneAir
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

let constructionDuGraphique = () => {
  try {
    const ctxAir = document.getElementById("myChartAir").getContext("2d");

    const myLabelsAir = [];

    const data = {
      labels: myLabelsAir,

      datasets: [
        //? Courbe taux humidité
        {
          label: "Température Air",
          data: tableauValeursTemperatureAir,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          lineTension: 0.2,
          pointRadius: 0,
        },

        //? Courbe consigne air.
        {
          label: "Consigne Air.",
          data: tableauValeursConsigneAir,
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
      optionsAir,
    };

    new Chart(ctxAir, configCo2);

    // console.log("🟢 SUCCESS |  Étape 5 OK | Construction graphique.");
  } catch (error) {
    console.log("🔴 ERREUR | Étape 5 | Construction graphique :", error);
  }
};

//? -------------------------------------------------

//? Lancer la construction du graphique courbe air.

const constructionCourbeAir = async () => {
  try {
    await getValeursTemperatureAir();
    await stockerValeursTemperatureAir();
    await getValeursConsigneAir();
    await stockerValeursConsigneAir();
    await constructionDuGraphique();
  } catch (err) {
    console.log("🔺 ERREUR | Resolve promise | Construction courbe air", err);
  }
};

constructionCourbeAir();
