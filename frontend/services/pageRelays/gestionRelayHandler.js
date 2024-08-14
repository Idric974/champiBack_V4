//? Récupération des données Température Air.

let temperatureAir;
let actionRelay;
let etatRelay;
let etatRelayBrute;
let etatRelayLocalStorage;

let getTemperatureAir = async () => {
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
      throw new Error(
        `🔴 ERROR | La réponse du réseau n'était pas correcte: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("⭐ DATA BRUTE | Get Temperature Air : ", data);

    const { dataTemperatureAir } = data;
    temperatureAir = dataTemperatureAir.temperatureAir;
    actionRelay = dataTemperatureAir.actionRelay;
    etatRelay = dataTemperatureAir.etatRelay;

    document.getElementById(
      "etatRelay"
    ).innerHTML = `Etat relai à = ${etatRelay} %`;

    // console.log("DATA : ", { temperatureAir, actionRelay, etatRelay });
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

getTemperatureAir();

//? -------------------------------------------------

// ? Clic sur le bouton eau au sol.

let butonEauAuSol;
let checkButonEauAuSol = 0;

document
  .getElementById("btnRelayEauSol")
  .addEventListener("click", function () {
    butonEauAuSol = document.getElementById("btnRelayEauSol");
    butonEauAuSol.innerHTML = "Eau au sol activée";
    butonEauAuSol.classList.remove("demarrerCycleButton");
    butonEauAuSol.classList.add("boutonDeactivation");
    console.log("Eau au sol activée");
    clicSurLeBoutonEauAuSol();
  });

const clicSurLeBoutonEauAuSol = async () => {
  try {
    const url =
      "http://localhost:3003/gestionRelaysRoutesFront/activerRelayEauAuSol/";

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
    console.log("⭐ DATA BRUTE | Clic sur le bouton eau au sol : ", data);

    if (response.ok) {
      butonEauAuSol.innerHTML = "Activation";
      butonEauAuSol.classList.add("demarrerCycleButton");
      butonEauAuSol.classList.remove("boutonDeactivation");
    }
  } catch (error) {
    console.error(
      "🔴 ERROR | Clic sur le bouton eau au sol :",
      JSON.stringify(error)
    );
  }
};

//? -----------------------------------------------

// ? Gestion ventilateur humidité.

let ventilateurHumidite;

//? Ventilateur ON.
document
  .getElementById("ventilateurHumiditeOn")
  .addEventListener("click", function () {
    fetch("http://localhost:3003/gestionRelaysRoutesFront/relayVentilo/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        relayVentilo: 1,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });
  });

//? -------------------------------------------------

//? Ventilateur OFF.
document
  .getElementById("ventilateurHumiditeOff")
  .addEventListener("click", function () {
    fetch("http://localhost:3003/gestionRelaysRoutesFront/relayVentilo/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        relayVentilo: 0,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });
  });

//? -------------------------------------------------

// ** 🟢 GESTION DE VANNE FROID À 5 SECONDES ON 🟢

document
  .getElementById("vanneFroid5SesoncdesOn")
  .addEventListener("click", function () {
    let valeurEtatVanne;

    fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        valeurEtatVanne = data.dataTemperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          getTemperatureAir();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute >= 100) {
          alert("VANNE DEJA OUVERTE À 100%");
          return;
        } else {
          let etatVanne = "ON";

          fetch(
            "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid5Secondes/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                etatRelay: etatVanne,
              }),
            }
          )
            .then(function (response) {
              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                );
              }
              return response.json();
            })
            .then(function (data) {
              console.log(data);
            })
            .catch(function (error) {
              console.log("Fetch error: ", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });

    setTimeout(() => {
      getTemperatureAir();
    }, 6000);
  });

//! -------------------------------------------------

// ** 🟢 GESTION DE VANNE FROID À 5 SECONDES OFF 🟢

document
  .getElementById("vanneFroid5SesoncdesOff")
  .addEventListener("click", function () {
    let valeurEtatVanne;

    fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        valeurEtatVanne = data.dataTemperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          getTemperatureAir();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute <= 0) {
          alert("VANNE DEJA FERMÉE");
          return;
        } else {
          let etatVanne = "OFF";

          fetch(
            "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid5Secondes/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                etatRelay: etatVanne,
              }),
            }
          )
            .then(function (response) {
              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                );
              }
              return response.json();
            })
            .then(function (data) {
              console.log(data);
            })
            .catch(function (error) {
              console.log("Fetch error: ", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });

    setTimeout(() => {
      getTemperatureAir();
    }, 6000);
  });

//! -------------------------------------------------

// ** 🟢 GESTION DE VANNE FROID À 40 SECONDES ON 🟢

document
  .getElementById("vanneFroid40SesoncdesOn")
  .addEventListener("click", function () {
    let valeurEtatVanne;

    fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        valeurEtatVanne = data.dataTemperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          getTemperatureAir();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute >= 100) {
          alert("VANNE DEJA OUVERTE À 100%");
          return;
        } else {
          let etatVanne = "ON";

          fetch(
            "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid40Secondes/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                etatRelay: etatVanne,
              }),
            }
          )
            .then(function (response) {
              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                );
              }
              return response.json();
            })
            .then(function (data) {
              console.log(data);
            })
            .catch(function (error) {
              console.log("Fetch error: ", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });

    setTimeout(() => {
      getTemperatureAir();
    }, 6000);
  });

//! -------------------------------------------------

// ** 🟢 GESTION DE VANNE FROID À 40 SECONDES OFF 🟢

document
  .getElementById("vanneFroid40SesoncdesOff")
  .addEventListener("click", function () {
    let valeurEtatVanne;

    fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        valeurEtatVanne = data.dataTemperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          getTemperatureAir();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute <= 0) {
          alert("VANNE DEJA FERMÉE");
          return;
        } else {
          let etatVanne = "OFF";

          fetch(
            "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid40Secondes/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                etatRelay: etatVanne,
              }),
            }
          )
            .then(function (response) {
              if (!response.ok) {
                throw new Error(
                  "Network response was not ok " + response.statusText
                );
              }
              return response.json();
            })
            .then(function (data) {
              console.log(data);
            })
            .catch(function (error) {
              console.log("Fetch error: ", error);
            });
        }
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });

    setTimeout(() => {
      getTemperatureAir();
    }, 6000);
  });

//! -------------------------------------------------
