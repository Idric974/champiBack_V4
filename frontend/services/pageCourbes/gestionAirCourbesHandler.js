console.log("gestionAirCourbesHandler");

//? ** 🟢 LOGIQUE POUR LA GESTION DES ONGLETS.

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

//?  ** 🟢 AFFICHAGE DATE DÉMARRAGE CYCLE + NOMBRE DE JOUR DU CYCLE 🟢

let dateDemarrageDuCycle;
let jourDuCycle;
let dateDemarrageDuCycleStorage;

(function getDataCycle() {
  fetch("http://localhost:3003/gestionCourbesApiRoutes/getDateDemarrageCycle/")
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

//?  ** 🟢 BOUTON CRÉATION DE LA DATE DE DÉBUT DU CYCLE AIR 🟢

document.addEventListener("DOMContentLoaded", () => {
  const btnAir = document.getElementById("btnAir");

  btnAir.addEventListener("click", async () => {
    if (confirm("Êtes-vous sûr de vouloir démarrer un cycle ?")) {
      try {
        const dateDemarrageCycle = new Date();

        const response = await fetch(
          "http://localhost:3003/gestionCourbesApiRoutes/dateDemarrageCycle/",
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

//?  ** 🟢 RÉCUPÉRATION DES DATA TEMPÉRATURE AIR 🟢

(async function getTemperatureAirCourbe() {
  try {
    const response = await fetch(
      "http://localhost:3003/gestionCourbesApiRoutes/getTemperatureAirCourbe/",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `? ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("?? DATA BRUTE | getDateDemarrageDuCycle: ", data);

    const { temperatureAirCourbe } = data;
    const dataCourbeAir = temperatureAirCourbe;
    let tailleTableau = temperatureAirCourbe.length;

    console.log("🟢 SUCCESS | Data courbes : ", {
      dataCourbeAir,
      tailleTableau,
    });

    console.log("🟢 SUCCESS AIR 1/5 | Chargement des datas.");
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
})();

//?  ** 🟢 CONSTRUCTION DE LA COURBE 🟢

const ctx = document.getElementById("myChartAir").getContext("2d");
const myChartAir = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
