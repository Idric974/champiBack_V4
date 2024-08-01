// ** 🟢 CLIC SUR LE BOUTON EAU AU SOL 🟢

document
  .getElementById("btnRelayEauSol")
  .addEventListener("click", function () {
    let element = document.getElementById("btnRelayEauSol");
    element.style.backgroundColor = "red";
    element.innerHTML = "Eau au sol activée";
    console.log("Eau au sol activée");

    fetch("http://localhost:3003/gestionRelayApiRoutes/activerRelayEauAuSol/")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        window.location.reload();
      })
      .catch(function (error) {
        console.log("Fetch error: ", error);
      });
  });

// ** 🟢 GESTION VENTILATEUR HUMIDITÉ 🟢

let ventilateurHumidite;

//? Ventilateur ON.
document
  .getElementById("ventilateurHumiditeOn")
  .addEventListener("click", function () {
    fetch("http://localhost:3003/gestionRelayApiRoutes/relayVentilo/", {
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
    fetch("http://localhost:3003/gestionRelayApiRoutes/relayVentilo/", {
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

// ** 🟢 AFFICHAGE DE L'ÉTAT DE LA VANNE FROID 🟢

let etatRelay;
let etatRelayBrute;
let etatRelayLocalStorage;

let afficheEtatRelay = () => {
  fetch("http://localhost:3003/gestionAirRoutesFront/getTemperatureAir/")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(function (data) {
      etatRelayBrute = data.temperatureAir.etatRelay;
      // console.log("etatRelayBrute ==> ", etatRelayBrute);
      etatRelayLocalStorage = etatRelayBrute;
    })
    .then(() => {
      etatRelay = JSON.stringify(etatRelayLocalStorage);
      localStorage.setItem("Etat relay : ", etatRelay);
      document.getElementById("etatRelay").innerHTML =
        "Etat Vanne froid à : " + etatRelay + "%";
    })
    .catch(function (error) {
      console.log("Fetch error: ", error);
    });
};

afficheEtatRelay();

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
        valeurEtatVanne = data.temperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          afficheEtatRelay();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute >= 100) {
          alert("VANNE DEJA OUVERTE À 100%");
          return;
        } else {
          let etatVanne = "ON";

          fetch(
            "http://localhost:3003/gestionRelayApiRoutes/relayVanneFroid5Secondes/",
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
      afficheEtatRelay();
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
        valeurEtatVanne = data.temperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          afficheEtatRelay();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute <= 0) {
          alert("VANNE DEJA FERMÉE");
          return;
        } else {
          let etatVanne = "OFF";

          fetch(
            "http://localhost:3003/gestionRelayApiRoutes/relayVanneFroid5Secondes/",
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
      afficheEtatRelay();
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
        valeurEtatVanne = data.temperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          afficheEtatRelay();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute >= 100) {
          alert("VANNE DEJA OUVERTE À 100%");
          return;
        } else {
          let etatVanne = "ON";

          fetch(
            "http://localhost:3003/gestionRelayApiRoutes/relayVanneFroid40Secondes/",
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
      afficheEtatRelay();
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
        valeurEtatVanne = data.temperatureAir.actionRelay;
        console.log("Valeur Etat Vanne ===> ", valeurEtatVanne);
      })
      .then(() => {
        if (valeurEtatVanne == 1) {
          afficheEtatRelay();
          alert("ATTENTION!! ACTION VANNE EN COURS");
          return;
        } else if (etatRelayBrute <= 0) {
          alert("VANNE DEJA FERMÉE");
          return;
        } else {
          let etatVanne = "OFF";

          fetch(
            "http://localhost:3003/gestionRelayApiRoutes/relayVanneFroid40Secondes/",
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
      afficheEtatRelay();
    }, 6000);
  });

//! -------------------------------------------------
