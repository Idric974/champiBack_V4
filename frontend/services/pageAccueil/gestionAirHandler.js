//? Récupération de la température de l’air.

let temperatureAir;
let temperatureAirLocalStorage;
let deltaAirLocalStorage;

const getTemperatureAir = async () => {
  try {
    const url =
      "http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/";

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

    const { dataTemperatureAir } = data;

    temperatureAir = dataTemperatureAir.temperatureAir;
    localStorage.setItem("gestionAir ==> Température Air:", temperatureAir);

    const temperatureAirLocalStorage = localStorage.getItem(
      "gestionAir ==> Température Air:"
    );

    document.getElementById("temperatureAir").innerHTML =
      temperatureAirLocalStorage + " °C";
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
  }
};

getTemperatureAir();

//? RÉCUPÉRATION DES DATAS DE LA TEMPÉRATURE DE L’AIR.

let consigneAirLocalStorage;
let nbJourAir;
let nbHeureAir;
let getDernierConsigneAirEntree;
let getdernierPasAirEntree;
let getDernierObjectifAirEntree;
let deltaAir;
let pasAirFromDb;
let objectifAirFromDb;
let newConsigne;

let getDataAir = async () => {
  fetch(
    "http://localhost:3003/gestionAirRoutesFront/getPasEtConsigneTemperatureAir/",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      //* Consigne Air.
      // console.log("DATA BRUTE : Consigne Air =>", data);

      consigneAir = data.datatemperatureAir.consigneAir;
      // console.log("ðŸ‘‰ consigneAir =>", consigneAir);
      localStorage.setItem("gestionAir ==> Consigne :", consigneAir);

      consigneAirLocalStorage = localStorage.getItem(
        "gestionAir ==> Consigne :"
      );

      document.getElementById("consigneAir").innerHTML =
        consigneAirLocalStorage + "°C";

      //* Affichage historique Consigne.
      getDernierConsigneAirEntree = localStorage.getItem(
        "gestionAir ==> Dernier consigne:"
      );

      document.getElementById("dernierConsigneAirEntree").innerHTML =
        getDernierConsigneAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Pas.
      getdernierPasAirEntree = localStorage.getItem(
        "Gestion Air | Dernier Pas"
      );

      document.getElementById("dernierPasAirEntree").innerHTML =
        getdernierPasAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Objectif.
      getDernierObjectifAirEntree = localStorage.getItem(
        "Gestion Air | Dernier Objectif"
      );

      document.getElementById("dernierObjectifAirEntree").innerHTML =
        getDernierObjectifAirEntree;

      //* -------------------------------------------------
    })
    .then(() => {
      const calculeNombreJour = () => {
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

      calculeNombreJour();
    })

    .then(() => {
      const gestionDeLaConsigne = () => {
        if (
          pasAirFromDb === 0 ||
          pasAirFromDb === "" ||
          pasAirFromDb === null ||
          objectifAirFromDb === 0 ||
          objectifAirFromDb === "" ||
          objectifAirFromDb === null
        ) {
          console.log(
            "Paramètre ===> Pas et Objectif non renseignés : GESTION CONSIGNE MANUELLE."
          );
          console.log("Gestion de la consigne : ", {
            pasAirFromDb,
            objectifAirFromDb,
          });
          const element = document.getElementById("consigneAutomatiqueId");
          element.classList.remove("consigneAutomatiqueOn");
          element.classList.add("consigneAutomatiqueOff");
        } else {
          console.log(
            "Paramètre ===> Pas et Objectif renseignés : GESTION CONSIGNE AUTOMATIQUE.",
            { pasAirFromDb, objectifAirFromDb }
          );
          const element = document.getElementById("consigneAutomatiqueId");
          element.classList.remove("consigneAutomatiqueOff");
          element.classList.add("consigneAutomatiqueOn");
        }
      };

      // gestionDeLaConsigne();
    })
    .then(() => {
      let palier;
      palier = Number(getdernierPasAirEntree) / 12;
      // console.log("palier ==>> ", palier);
      //  console.log("palier ==>> ", typeof palier);

      let dernierObjectif = Number(getDernierObjectifAirEntree);
      // console.log("dernierObjectif ==>> ", dernierObjectif);
      // console.log("dernierObjectif ==>> ", typeof dernierObjectif);

      const definitionCondition = async () => {
        //* Condition 1 : consigne = objectifAir.

        if (consigneAir === dernierObjectif) {
          newConsigne = dernierObjectif;

          console.log(
            "Consigne automatique | Consigne = objectifAir | On ne fait rien : ",
            newConsigne
          );

          //* Condition 2 : consigne <= objectifAir.
        } else if (consigneAir <= dernierObjectif) {
          newConsigne = dernierObjectif + palier;

          console.log(
            "Consigne automatique | Consigne <= objectifAir | Nouvelle consigne ➕ : ",
            newConsigne
          );
        }

        //* Condition 3 : consigne > objectifAir.
        else if (consigneAir > dernierObjectif) {
          newConsigne = dernierObjectif - palier;

          console.log(
            "Consigne automatique | Consigne > objectifAir | Nouvelle consigne ➖ :",
            newConsigne
          );
        } else {
          console.log("🔴 ERROR : Définition de la condition");
        }
      };

      // definitionCondition();
    })
    .then(() => {
      const miseAjourConsigne = async () => {
        consigneAir = newConsigne;
        fetch(
          "http://localhost:3003/gestionAirRoutesFront/postConsigneTemperatureAir/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              consigneAir: newConsigne,
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

      // miseAjourConsigne();
    })
    .catch((error) => {
      console.log(
        "Erreur dans le traitement des Data température Air :",
        JSON.stringify(error)
      );
    });
};

getDataAir();

//? Calcule du delta Humidite - Consigne.

//? -------------------------------------------------

const calculeDuDeltaTemperatureAirConsigne = async () => {
  await getTemperatureAir();
  await getDataAir();

  deltaAir = temperatureAir - consigneAir;
  // console.log("Delta Humidite - Consigne ====> ", deltaAir);

  localStorage.setItem("Valeure delta Air : ", deltaAir);

  deltaAirLocalStorage = localStorage.getItem("Valeure delta Air : ");

  document.getElementById("deltaAir").innerHTML = deltaAirLocalStorage + "°C";
};

calculeDuDeltaTemperatureAirConsigne();

//? -------------------------------------------------

//? POST DE LA CONSIGNE AIR.

let consigneAir;
let consigneAirForm;

document
  .getElementById("validationConsigneAir")
  .addEventListener("click", function () {
    // console.log("Clic sur bouton validation consigne air ");

    consigneAirForm = document.getElementById("consigneAirForm").value;
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

//? POST DES DATAS AIR ET GESTION DE LA CONSIGNE AUTOMATIQUE.

let pasAir;
let pasAirForm;
let dernierPas;
let objectifAir;

let objectiAirForm;

document
  .getElementById("validationdataAir")
  .addEventListener("click", async function (event) {
    // event.preventDefault();
    await postPasEtConsigneTemperatureAir();
  });

const postPasEtConsigneTemperatureAir = async () => {
  //* Pas Air.
  pasAirForm = document.getElementById("pasAirForm").value;
  console.log("DATA 🔥 | pasAirForm : ", pasAirForm);

  //* Objectif Air.
  objectiAirForm = document.getElementById("objectiAirForm").value;
  console.log("DATA 🔥 | objectiAirForm : ", objectiAirForm);

  try {
    console.log("Envoi de la requête fetch...");

    const response = await fetch(
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
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log("DATA 🔥 | postPasEtConsigneTemperatureAir : ", data);

    localStorage.setItem("Gestion Air | Dernier Pas", pasAirForm);
    localStorage.setItem("Gestion Air | Dernier Objectif", objectiAirForm);
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
};
