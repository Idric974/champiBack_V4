const { exec } = require("child_process");

//? Mise à jour de l'état des relay.

let miseAjourEtatRelay = (etatRelay) => {
  fetch("http://localhost:3003/api/functionsRoutes/majEtatRelay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ etatRelay }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

//? --------------------------------------------------

//? Activation du relais Gestion Air.

const gpioActionOn = (pin) => {
  // console.log("⭐ gpioActionOn ==> ", { pin });

  fetch("http://localhost:3003/gestionAirRoutesApi/gpioActionOn/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }), // Encapsuler `pin` dans un objet
  })
    .then(async (response) => {
      if (!response.ok) {
        // Si la réponse n'est pas correcte (par exemple, une erreur 404 ou 500)
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }
      return response.json(); // Traiter la réponse JSON
    })
    .then((data) => {
      console.log("✅ SUCCÈS | Gestion Air | ", data);
    })
    .catch((error) => {
      console.error("🔴 Error | Functions | gpioAction : ", error);
    });
};

//? --------------------------------------------------

//? Déactivation du relais Gestion Air.

const gpioActionOff = (pin) => {
  // console.log("⭐ gpioActionOn ==> ", { pin });

  fetch("http://localhost:3003/gestionAirRoutesApi/gpioActionOff/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
  })
    .then(async (response) => {
      if (!response.ok) {
        // Si la réponse n'est pas correcte (par exemple, une erreur 404 ou 500)
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }
      return response.json(); // Traiter la réponse JSON
    })
    .then((data) => {
      console.log("✅ SUCCÈS | Gestion Air | ", data);
    })
    .catch((error) => {
      console.error("🔴 Error | Functions | gpioAction : ", error);
    });
};

//? --------------------------------------------------

//? Envoyer un SMS d’alerte.

const numSalle = require("../../utils/numSalle/configNumSalle");

const sendSMS = (temperatureDuMessage) => {
  console.log("temperatureDuMessage :", temperatureDuMessage);

  //! Url de la master.
  const url = "http://192.168.1.10:5000/api/postSms/postSms";

  let date1 = new Date();

  let dateLocale = date1.toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  let message = `ALERTE : Salle ${numSalle} | ${temperatureDuMessage} | ${dateLocale}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Reponse de SMS808 : ", data);
    })
    .catch((error) => {
      console.error("🔴 Error | Functions | sendSMS : ", error);
    });
};

//? --------------------------------------------------

module.exports = {
  sendSMS,
  miseAjourEtatRelay,
  gpioActionOn,
  gpioActionOff,
};
