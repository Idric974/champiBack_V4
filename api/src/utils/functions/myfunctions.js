//? Mise à jour de l'état des relay.

const miseAjourEtatRelay = async (etatRelay, actionRelay) => {
  let url = "http://localhost:3003/gestionAirRoutesApi/majRelay";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ etatRelay, actionRelay }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`🔴 HTTP Error ! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ SUCCÈS | Gestion Air | Relais mis a jour :", data);
  } catch (error) {
    console.log(
      `🔴 Catch Error | Une erreur s'est produite dans la requête mise à jour de l'état des relay : `,
      error.message
    );
  }
};

//? --------------------------------------------------

//? Activation du relais Gestion Air.

const gpioActionOn = async (pin) => {
  let url = "http://localhost:3003/gestionAirRoutesApi/gpioActionOn/";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`🔴 HTTP Error ! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(
      "✅ SUCCÈS | Gestion Air | Activation du relais Gestion Air : ",
      data
    );
  } catch (error) {
    console.log(
      `🔴 Catch Error | Une erreur s'est produite dans la requête activation du relais Gestion Air : `,
      error.message
    );
  }
};

//? --------------------------------------------------

//? Déactivation du relais Gestion Air.

const gpioActionOff = async (pin) => {
  let url = "http://localhost:3003/gestionAirRoutesApi/gpioActionOff/";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pin }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`🔴 HTTP Error ! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log(
      "✅ SUCCÈS | Gestion Air | Déactivation du relais Gestion Air : ",
      data
    );
  } catch (error) {
    console.log(
      `🔴 Catch Error | Une erreur s'est produite dans la requête déactivation du relais Gestion Air : `,
      error.message
    );
  }
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
