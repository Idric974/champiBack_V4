//? Envoyer un SMS d’alerte.

const numSalle = require("../utils/numSalle/configNumSalle");
let myMessage = "Attention : le delta est inférieur à -3°C";

const sendSMS = (myMessage) => {
  console.log(`❤️ temperatureDuMessage :" ${myMessage} + numSalle ${numSalle}`);

  let masterURL;

  if (process.env.CHAMPIBACK_STATUS === "developpement") {
    masterURL = "http://192.168.1.11:5000/api/postSms/postSms" + numSalle;
    console.log("MODE DÉVELOPPEMENT ACTIF");
  }

  if (process.env.CHAMPIBACK_STATUS === "production") {
    masterURL = "http://192.168.0.10:5000/api/postSms/postSms" + numSalle;
    console.log("MODE PRODUCTION ACTIF");
  }

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

  let message = `ALERTE : Salle ${numSalle} | ${myMessage} | ${dateLocale}`;

  fetch(masterURL, {
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

sendSMS();

//? --------------------------------------------------
