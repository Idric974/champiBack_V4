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
    ).innerHTML = `Vanne ouverte à : ${etatRelay} %`;

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

//? Récupération de l'état du relais eau au sol.

let etatRelayEauAuSol;

let getEtatRelaisEauAuSol = async () => {
  try {
    const url =
      "http://localhost:3003/gestionRelaysRoutesFront/getEtatRelaisEauAuSol/";

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
    // console.log(
    //   "⭐ DATA BRUTE | Récupération de l'état du relais eau au sol : ",
    //   data
    // );

    const { etatRelayEauAuSolFront } = data;
    etatRelayEauAuSol = etatRelayEauAuSolFront;
    // console.log("DATA : ", { etatRelayEauAuSol });
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

getEtatRelaisEauAuSol();

//? -------------------------------------------------

//? Recupération de la vanne à utiliser.

let vanneActivRelay;
let ouvertureVanneRelay;
let fermetureVanneRelay;

const getVanneActive = async () => {
  try {
    const url = "http://localhost:3003/gestionAirRoutesFront/getVanneActive/";

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
    // console.log(
    //   "⭐ DATA BRUTE | Récupération de l'état du relais eau au sol : ",
    //   data
    // );

    const { dataVanneActive } = data;
    vanneActivRelay = dataVanneActive.vanneActive;
    // console.log("Vanne Active : ", { vanneActivRelay });

    if (vanneActivRelay === "vanneHum") {
      ouvertureVanneRelay = "23";
      fermetureVanneRelay = "22";
      console.log(
        "✅ SUCCÈS | Gestion Relais | La vanne utilisée est = ",
        vanneActivRelay
      );
    }

    if (vanneActivRelay === "vanneSec") {
      ouvertureVanneRelay = "25";
      fermetureVanneRelay = "24";
      console.log(
        "✅ SUCCÈS | Gestion Relais | La vanne utilisée est = ",
        vanneActivRelay
      );
    }
  } catch (error) {
    console.error(
      "🔴 ERROR | Erreur lors de la récupération des données :",
      error
    );
    console.error("🔴 ERROR | Erreur JSON :", JSON.stringify(error));
  }
};

getVanneActive();

//? --------------------------------------------------

// ? Clic sur le bouton eau au sol.

(async function nomDeLaFonction() {
  await getEtatRelaisEauAuSol();
  if (etatRelayEauAuSol === 1) {
    const butonEauAuSol = document.getElementById("btnRelayEauSol");
    butonEauAuSol.innerHTML = "Eau au sol activée";
    butonEauAuSol.classList.remove("demarrerCycleButton");
    butonEauAuSol.classList.add("boutonDeactivation");
    console.log("??Eau au sol déjà activée");
  }
})();

document
  .getElementById("btnRelayEauSol")
  .addEventListener("click", function () {
    butonEauAuSol = document.getElementById("btnRelayEauSol");
    butonEauAuSol.innerHTML = "Eau au sol activée";
    butonEauAuSol.classList.remove("demarrerCycleButton");
    butonEauAuSol.classList.add("boutonDeactivation");
    console.log("Eau au sol activée");
    clicSurLeBoutonEauAuSolHandle();
  });

const clicSurLeBoutonEauAuSol = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (etatRelayEauAuSol === 1) {
        alert("ATTENTION, L'EAU AU SOL EST DÉJÀ ACTIVÉE");
        reject(etatRelayEauAuSol);
      }

      if (etatRelayEauAuSol === 0) {
        // console.log("butonEauAuSol === 0");

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
        // console.log("⭐ DATA BRUTE | Clic sur le bouton eau au sol : ", data);

        if (response.ok) {
          butonEauAuSol.innerHTML = "Activation";
          butonEauAuSol.classList.add("demarrerCycleButton");
          butonEauAuSol.classList.remove("boutonDeactivation");
          resolve(console.log("OK"));
        }
      }
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my error :", error));
    }
  });
};

const clicSurLeBoutonEauAuSolHandle = async () => {
  try {
    await getEtatRelaisEauAuSol();
    await clicSurLeBoutonEauAuSol();
  } catch (err) {
    console.log("🟠 CATCH ERROR : Résolution des promesses :", err);
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

//? Clic sur le bouton ouverture vanne pendant 5 secondes.

document
  .getElementById("vanneFroid5SesoncdesOn")
  .addEventListener("click", function () {
    clicBoutonOuvertureVanne5SecondesOnHandle();
  });

const clicBoutonOuvertureVanne5Secondes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (actionRelay === 1) {
        getTemperatureAir();
        alert("ATTENTION!! ACTION VANNE EN COURS");
        return;
      }

      if (etatRelay >= 100) {
        getTemperatureAir();
        alert("VANNE DEJA OUVERTE À 100%");
        return;
      }

      const url =
        "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid5Secondes/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          etatRelay: "ON",
          ouvertureVanneRelay,
        }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `🔴 THROWED ERROR | Gestion humidité | Clic sur le bouton ouverture vanne pendant 5 secondes : ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("MESSAGE | ", data);
      location.reload();
      resolve();
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

const clicBoutonOuvertureVanne5SecondesOnHandle = async () => {
  try {
    await getTemperatureAir();
    await clicBoutonOuvertureVanne5Secondes();
  } catch (err) {
    console.log("🟠 CATCH ERROR : Résolution des promesses :", err);
  }
};

//? -------------------------------------------------

//? Clic sur le bouton Fermeture vanne pendant 5 secondes.

document
  .getElementById("vanneFroid5SesoncdesOff")
  .addEventListener("click", function () {
    clicBoutonFermetureVanne5SecondesOffHandle();
  });

const clicBoutonFermetureVanne5SecondesOff = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (actionRelay === 1) {
        getTemperatureAir();
        alert("ATTENTION!! ACTION VANNE EN COURS");
        return;
      }

      if (etatRelay <= 0) {
        getTemperatureAir();
        alert("VANNE DEJA FERMÉE");
        return;
      }

      const url =
        "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid5Secondes/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          etatRelay: "OFF",
          fermetureVanneRelay,
        }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `🔴 THROWED ERROR | Gestion humidité | Clic sur le bouton ouverture vanne pendant 5 secondes : ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("MESSAGE | ", data);
      location.reload();
      resolve();
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

const clicBoutonFermetureVanne5SecondesOffHandle = async () => {
  try {
    await getTemperatureAir();
    await clicBoutonFermetureVanne5SecondesOff();
  } catch (err) {
    console.log("🟠 CATCH ERROR : Résolution des promesses :", err);
  }
};

//? -------------------------------------------------

//? Clic sur le bouton ouverture vanne pendant 40 secondes.

document
  .getElementById("vanneFroid40SesoncdesOn")
  .addEventListener("click", function () {
    clicBoutonOuvertureVanne40SecondesOnHandle();
  });

const clicBoutonOuvertureVanne40SecondesOn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (actionRelay === 1) {
        getTemperatureAir();
        alert("ATTENTION!! ACTION VANNE EN COURS");
        return;
      }

      if (etatRelay >= 100) {
        getTemperatureAir();
        alert("VANNE DEJA OUVERTE À 100%");
        return;
      }

      const url =
        "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid40Secondes/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          etatRelay: "ON",
          ouvertureVanneRelay,
        }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `🔴 THROWED ERROR | Gestion humidité | Clic sur le bouton ouverture vanne pendant 5 secondes : ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("MESSAGE | ", data);
      location.reload();
      resolve();
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

const clicBoutonOuvertureVanne40SecondesOnHandle = async () => {
  try {
    await getTemperatureAir();
    await clicBoutonOuvertureVanne40SecondesOn();
  } catch (err) {
    console.log("🟠 CATCH ERROR : Résolution des promesses :", err);
  }
};

//? -------------------------------------------------

//? Clic sur le bouton Fermeture vanne pendant 40 secondes.

document
  .getElementById("vanneFroid40SesoncdesOff")
  .addEventListener("click", function () {
    clicBoutonFermetureVanne40SecondesOffHandle();
  });

const clicBoutonFermetureVanne40SecondesOff = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (actionRelay == 1) {
        getTemperatureAir();
        alert("ATTENTION!! ACTION VANNE EN COURS");
        return;
      }

      if (etatRelay <= 0) {
        getTemperatureAir();
        alert("VANNE DEJA FERMÉE");
        return;
      }
      const url =
        "http://localhost:3003/gestionRelaysRoutesFront/relayVanneFroid40Secondes/";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          etatRelay: "OFF",
          fermetureVanneRelay,
        }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(
          `🔴 THROWED ERROR | Gestion humidité | Clic sur le bouton ouverture vanne pendant 5 secondes : ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("MESSAGE | ", data);
      location.reload();
      resolve();
    } catch (error) {
      reject(console.log("🟠 TRY CATCH ERROR : my reject :", error));
    }
  });
};

const clicBoutonFermetureVanne40SecondesOffHandle = async () => {
  try {
    await getTemperatureAir();
    await clicBoutonFermetureVanne40SecondesOff();
  } catch (err) {
    console.log("🟠 CATCH ERROR : Résolution des promesses :", err);
  }
};

//? -------------------------------------------------
