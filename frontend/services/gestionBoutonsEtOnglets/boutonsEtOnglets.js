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

//? AFFICHAGE DATE DÉMARRAGE CYCLE + NOMBRE DE JOUR DU CYCLE.

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
      console.log("Fetch error: ", JSON.stringify(error));
    });
})();

//? -------------------------------------------------

//? BOUTON CRÉATION DE LA DATE DE DÉBUT DU CYCLE AIR.

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
