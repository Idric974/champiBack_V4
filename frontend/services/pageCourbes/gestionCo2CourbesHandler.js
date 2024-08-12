//? Récupération du taux De Co2.

let tauxCo2;

const getValeursTauxCo2 = async () => {
  try {
    const url =
      "http://localhost:3003/gestionCourbesRoutesFront/getTauxCo2Courbe/";

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
    // console.log("⭐ DATA BRUTE | Valeurs Taux Co2 : ", data);

    const { tauxCo2Courbe } = data;
    tauxCo2 = tauxCo2Courbe;
    let tailleTableau = tauxCo2Courbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 1 courbe humidité OK | Récupération du taux d'Co2 : ",
    //   {
    //     tauxCo2,
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

//? Stockage du taux d'Co2 dans un tableau.

let tableauValeursTauxCo2 = [];

const stockerValeursTauxCo2 = async () => {
  try {
    tableauValeursTauxCo2 = tauxCo2.map((item) => ({
      x: item.valeurAxeX,
      y: item.tauxCo2,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 2 courbe humidité OK | Stockage du taux d'Co2 :",
    //   tableauValeursTauxCo2
    // );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs température air dans le tableau :",
      error
    );
  }
};

//? -------------------------------------------------

//? Récupération des Datas Co2.

let consigneCo2;

const getDataCo2Courbe = async () => {
  try {
    const url =
      "http://localhost:3003/gestionCourbesRoutesFront/getDataCo2Courbe/";

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

    const { consigneCo2Courbe } = data;
    consigneCo2 = consigneCo2Courbe;
    let tailleTableau = consigneCo2Courbe.length;

    // console.log(
    //   "🟢 SUCCESS |  Étape 3 courbes humidité | Récupération des Datas Co2 : ",
    //   {
    //     consigneCo2,
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

let tableauValeursConsigneCo2 = [];

const stockerValeursConsigneCo2 = async () => {
  try {
    tableauValeursConsigneCo2 = consigneCo2.map((item) => ({
      x: item.valeurAxeX,
      y: item.consigne,
    }));

    // console.log(
    //   "🟢 SUCCESS | Étape 4 courbe humidité OK | Stockage des datas Co2 :",
    //   tableauValeursConsigneCo2
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

let constructionDuGraphiqueCo2 = async () => {
  try {
    const ctxCo2 = await document.getElementById("myChartCo2").getContext("2d");

    const myLabelsAir = [];

    const data = {
      labels: myLabelsAir,

      datasets: [
        //? Courbe taux humidité
        {
          label: "Courbe Taux Co2",
          data: tableauValeursTauxCo2,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          lineTension: 0.2,
          pointRadius: 0,
        },
        {
          label: "Courbe Consigne Co2",
          data: tableauValeursConsigneCo2,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          lineTension: 0.2,
          pointRadius: 0,
        },
      ],
    };

    const optionsCo2 = {
      animation: {
        duration: 0,
      },
    };

    const configCo2 = {
      type: "line",
      data,
      options: optionsCo2,
    };

    await new Chart(ctxCo2, configCo2);

    // console.log("🟢 SUCCESS |  Étape 5 OK | Construction graphique.");
  } catch (error) {
    console.log("🔴 ERREUR | Étape 5 | Construction graphique :", error);
  }
};

//? -------------------------------------------------

//? Lancer la construction du graphique courbe air.

(async function constructionCourbeCo2() {
  try {
    await getValeursTauxCo2();
    await stockerValeursTauxCo2();
    await getDataCo2Courbe();
    await stockerValeursConsigneCo2();
    await constructionDuGraphiqueCo2();
  } catch (error) {
    console.error(
      "🟠 Erreur dans le processus d'exécution du script gestion Co2",
      JSON.stringify(error)
    );
  }
})();
