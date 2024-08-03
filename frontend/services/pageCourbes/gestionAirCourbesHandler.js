//? LOGIQUE POUR LA GESTION DES ONGLETS.

const onglets = Array.from(document.querySelectorAll(".onglets"));
const contenu = Array.from(document.querySelectorAll(".contenu"));

onglets.forEach((onglet) => {
  onglet.addEventListener("click", tabsAnimation);
});

let index = 0;

function tabsAnimation(e) {
  const el = e.target;

  onglets[index].classList.remove("active");
  contenu[index].classList.remove("active-contenu");

  index = onglets.indexOf(el);

  onglets[index].classList.add("active");
  contenu[index].classList.add("active-contenu");
}

//? AFFICHAGE DATE DÉMARRAGE CYCLE + NOMBRE DE JOUR DU CYCLE

let dateDemarrageDuCycle;
let jourDuCycle;
let dateDemarrageDuCycleStorage;

(function getDataCycle() {
  fetch(
    "http://localhost:3003/gestionCourbesRoutesFront/getDateDemarrageCycle/"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // console.log("🖐 DATA BRUTE getDateDemarrageDuCycle: ", data);

      //* Date démarrage cycle
      dateDemarrageDuCycle = data.myDateDemarrageCycle;
      localStorage.setItem("Date démarrage cycle : ", dateDemarrageDuCycle);
      dateDemarrageDuCycleStorage = localStorage.getItem(
        "Date démarrage cycle : "
      );
      document.getElementById("dateDemarrageCycle").innerHTML =
        "Date démarrage cycle : " + dateDemarrageDuCycleStorage;

      //* Nombre de jour du cycle.
      jourDuCycle = data.nombreDeJourDuCycle;
      localStorage.setItem("Jour du cycle : ", jourDuCycle);
      let jourDuCycleLocalStorage = localStorage.getItem("Jour du cycle : ");

      document.getElementById("jourDuCycle").innerHTML =
        "Jour : " + jourDuCycleLocalStorage;
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
      console.log(JSON.stringify(error));
    });
})();

//? -------------------------------------------------

//? BOUTON CRÉATION DE LA DATE DE DÉBUT DU CYCLE AIR

document.addEventListener("DOMContentLoaded", () => {
  const btnAir = document.getElementById("btnAir");

  btnAir.addEventListener("click", async () => {
    if (confirm("Êtes-vous sûr de vouloir démarrer un cycle ?")) {
      try {
        const dateDemarrageCycle = new Date();

        const response = await fetch(
          "http://localhost:3003/gestionCourbesRoutesFront/dateDemarrageCycle/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dateDemarrageCycle: dateDemarrageCycle,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();
        // console.log("🖐 DATA BRUTE | création du nouveau cycle : ", data);

        afficherInfoEtRafraichir();
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    } else {
      console.log("You canceled!");
    }
  });

  function afficherInfoEtRafraichir() {
    const infoSmall = document.getElementById("infoSmallId");
    infoSmall.classList.remove("infoSmallDisplay");

    setTimeout(() => {
      infoSmall.classList.add("infoSmallDisplay");
      location.reload();
    }, 5000);
  }
});

//?  CONSTRUCTION DE LA COURBE

//? -------------------------------------------------

//* Récupération des data température air.

let dataCourbeAir;

const getValeurs = async () => {
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

    console.log("🟢 SUCCESS |  Étape 1 OK | Data courbes récupérées : ", {
      dataCourbeAir,
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

//* -------------------------------------------------

//* Stockage des valeurs température air dans un tableau.

let tableauValeurs = [];

const stockerValeursDansTableau = async () => {
  try {
    tableauValeurs = dataCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.temperatureAir,
    }));

    console.log(
      "🟢 SUCCESS | Étape 2 OK | Valeurs température air stockées dans le tableau :",
      tableauValeurs
    );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs température air dans le tableau :",
      error
    );
  }
};

//* -------------------------------------------------

//* Récupération des consignes température air.

let consigneCourbeAir;

const getValeursConsigne = async () => {
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

    console.log(
      "🟢 SUCCESS |  Étape 3 OK |  Valeurs data consigne récupérées : ",
      {
        consigneCourbeAir,
        tailleTableau,
      }
    );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération de valeurs data consigne :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

//* -------------------------------------------------

//* Stockage des valeurs consignes air dans un tableau.

let tableauValeursConsigne = [];

const stockerValeursConsigneDansTableau = async () => {
  try {
    tableauValeursConsigne = consigneCourbeAir.map((item) => ({
      x: item.valeurAxeX,
      y: item.consigneAir,
    }));

    console.log(
      "🟢 SUCCESS | Étape 4 OK | Valeurs consigne stockées dans le tableau :",
      tableauValeursConsigne
    );
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors du stockage des valeurs dans le tableau :",
      error
    );
  }
};

//* -------------------------------------------------

//* Construction du graphique temperature air.

let constructionDuGraphique = () => {
  return new Promise((resolve, reject) => {
    try {
      const ctxAir = document.getElementById("myChartAir").getContext("2d");

      const myLabelsAir = [];

      const data = {
        labels: myLabelsAir,

        datasets: [
          //* Courbe taux humidité
          {
            label: "Température Air",
            data: tableauValeurs,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis1',
          },

          //* Courbe consigne air.
          {
            label: "Consigne Air.",
            data: tableauValeursConsigne,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis2',
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

      console.log("🟢 SUCCESS AIR 5/5 ==> Construction graphique.");

      resolve();
    } catch (error) {
      console.log("🔴 ERREUR AIR 5/5 ==> Construction graphique :", error);

      reject();
    }
  });
};

//* -------------------------------------------------

const handleMyPromise = async () => {
  try {
    await getValeurs();
    await stockerValeursDansTableau();
    await getValeursConsigne();
    await stockerValeursConsigneDansTableau();
    await constructionDuGraphique();
  } catch (err) {
    console.log("🔺 ERREUR ==> Resolve promise", err);
  }
};

handleMyPromise();
