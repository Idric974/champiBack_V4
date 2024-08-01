// ** 🟢 RÉCUPÉRATION DE LA TEMPÉRATURE DE L’AIR 🟢
let temperatureAir;
let temperatureAirLocalStorage;
let deltaAirLocalStorage;

const getTemperatureAir = () => {
  fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // console.log("DATA BRUTE : temperatureAir =>",data);

      temperatureAir = data.temperatureAir.temperatureAir;
      // console.log("ðŸ‘‰ temperatureAir =>", temperatureAir);
      // console.log("ðŸ‘‰ temperatureAir typeof =>", typeof temperatureAir);

      localStorage.setItem("gestionAir ==> TempÃ¨rature Air:", temperatureAir);

      let temperatureAirLocalStorage = localStorage.getItem(
        "gestionAir ==> TempÃ¨rature Air:"
      );

      document.getElementById("temperatureAir").innerHTML =
        temperatureAirLocalStorage + "Â°C";
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getTemperatureAir();

setInterval(() => {
  getTemperatureAir();
  //console.log('rÃ©cup tempAir');
}, 10000);

//** 🟢 RÉCUPÉRATION DES DATAS DE LA TEMPÉRATURE DE L’AIR 🟢

let consigneAir;
let consigneAirLocalStorage;
let objectifAir;
let pasAir;
let nbJourAir;
let nbHeureAir;
let getDernierConsigneAirEntree;
let getdernierPasAirEntree;
let getDernierObjectifAirEntree;
let deltaAir;

let getConsigneAir = () => {
  fetch(
    "http://localhost:3003/gestionAirRoutesFront/getPasEtConsigneTemperatureAir/",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      //* Consigne Air.
      //console.log("DATA BRUTE : Consigne Air =>",data);

      consigneAir = data.datatemperatureAir.consigneAir;
      // console.log("ðŸ‘‰ consigneAir =>", consigneAir);
      // console.log("ðŸ‘‰ consigneAir typeof =>", typeof consigneAir);

      localStorage.setItem("gestionAir ==> Consigne :", consigneAir);

      consigneAirLocalStorage = localStorage.getItem(
        "gestionAir ==> Consigne :"
      );

      document.getElementById("consigneAir").innerHTML =
        consigneAirLocalStorage + "Â°C";

      //* -------------------------------------------------

      //* Affichage historique Consigne.
      getDernierConsigneAirEntree = localStorage.getItem(
        "gestionAir ==> Dernier consigne:"
      );

      document.getElementById("dernierConsigneAirEntree").innerHTML =
        getDernierConsigneAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Pas.
      getdernierPasAirEntree = localStorage.getItem(
        "gestionAir ==> Dernier Pas:"
      );

      document.getElementById("dernierPasAirEntree").innerHTML =
        getdernierPasAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Objectif.
      getDernierObjectifAirEntree = localStorage.getItem(
        "gestionAir ==> Dernier Objectif:"
      );

      document.getElementById("dernierObjectifAirEntree").innerHTML =
        getDernierObjectifAirEntree;

      //* -------------------------------------------------
    })
    .then(() => {
      let CalculeNombreJour = () => {
        if (
          consigneAir == 0 ||
          consigneAir == "" ||
          consigneAir == null ||
          getDernierObjectifAirEntree == 0 ||
          getDernierObjectifAirEntree == "" ||
          getDernierObjectifAirEntree == null ||
          getdernierPasAirEntree == 0 ||
          getdernierPasAirEntree == "" ||
          getdernierPasAirEntree == null
        ) {
          //  console.log('Pas de paramÃ¨tre pas de calcule des jours');
          return;
        } else {
          let dureeDescenteAir =
            ((consigneAir - getDernierObjectifAirEntree) /
              getdernierPasAirEntree) *
            12;

          // console.log('DurÃ©e Descente Air', dureeDescenteAir);

          let totalHeures = dureeDescenteAir;

          nbJourAir = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureAir = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durÃ©e de la descente Air est de  : ' +
          //   nbJourAir +
          //   ' Jours ' +
          //   nbHeureAir +
          //   ' Heures '
          // );
        }

        localStorage.setItem("gestionAir ==> Nombre de jour:", nbJourAir);
        nbJourAirLocalStorage = localStorage.getItem("Valeure nbJour Air : ");

        let nombreDeJour = localStorage.getItem(
          "gestionAir ==> Nombre de jour:"
        );

        localStorage.setItem("gestionAir ==> Nombre de heure:", nbHeureAir);

        let nombreDeHeure = localStorage.getItem(
          "gestionAir ==> Nombre de heure:"
        );

        document.getElementById("descenteAir").innerHTML =
          nombreDeJour +
          " " +
          "Jours et" +
          " " +
          nombreDeHeure +
          " " +
          "Heures";
      };

      CalculeNombreJour();

      setInterval(() => {
        CalculeNombreJour();
      }, 120000);
    })
    .then(() => {
      console.log("temperatureAir ==> ", temperatureAir);
      console.log("consigneAir ==> ", consigneAir);

      deltaAir = temperatureAir - consigneAir;

      console.log("ðŸ‘‰ delta Air =>", deltaAir);
      //console.log("ðŸ‘‰ delta Air typeof =>",typeof deltaAir);

      localStorage.setItem("Valeure delta Air : ", deltaAir);

      deltaAirLocalStorage = localStorage.getItem("Valeure delta Air : ");

      document.getElementById("deltaAir").innerHTML =
        deltaAirLocalStorage + "Â°C";
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getConsigneAir();

setInterval(() => {
  getConsigneAir();
  // console.log('rÃ©cup consigneAir');
}, 15000);

//**🟢 POST DE LA CONSIGNE AIR 🟢

document
  .getElementById("validationConsigneAir")
  .addEventListener("click", function () {
    // console.log("Clic sur bouton validation consigne air ");

    let consigneAirForm = document.getElementById("consigneAirForm").value;
    console.log("consigneAirForm", consigneAirForm);

    const postConsigneTemperatureAir = () => {
      console.log("Envoi de la requête fetch...");
      fetch(
        "http://localhost:3003/gestionAirRoutesFront/postConsigneTemperatureAir/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            consigneAir: consigneAirForm,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Post Consigne Temperature Air : ", data);
          localStorage.setItem(
            "gestionAir ==> Dernier consigne:",
            consigneAirForm
          );
        })
        .catch((error) => {
          console.log("Erreur lors de l'envoi de la requête fetch :", error);
        });
    };

    postConsigneTemperatureAir();
  });

//** 🟢 POST DES DATAS AIR 🟢

document
  .getElementById("validationdataAir")
  .addEventListener("click", function () {
    // console.log("Clic sur bouton validation Etal Hum");

    //* Pas Air.
    let pasAirForm = document.getElementById("pasAirForm").value;
    console.log("pasAirForm", pasAirForm);

    //* Objectif Air.
    let objectiAirForm = document.getElementById("objectiAirForm").value;
    console.log("objectiAirForm", objectiAirForm);

    const postPasEtConsigneTemperatureAir = () => {
      console.log("Envoi de la requête fetch...");
      fetch(
        "http://localhost:3003/gestionAirRoutesFront/postPasEtConsigneTemperatureAir/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pasAir: pasAirForm,
            objectifAir: objectiAirForm,
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Post Pas Et Consigne Temperature Air :", data);
          localStorage.setItem("gestionAir ==> Dernier Pas:", pasAirForm);
          localStorage.setItem(
            "gestionAir ==> Dernier Objectif:",
            objectiAirForm
          );
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    };

    postPasEtConsigneTemperatureAir(); // Appel de la fonction pour envoyer les données
  });
