let definitionDesActions = () => {
  return new Promise((resolve, reject) => {
    try {
      //* Le delta est suppérieur à 3.

      if (delta >= 3) {
        console.log(
          "✅ SUCCÈS | Gestion Air | ALERTE le delta est supérieur à 3°C."
        );

        sendSMS("Attention : le delta est supérieur à 3°C");

        console.log(
          "✅ SUCCÈS | Gestion Air | Delta >= 3° | Action = Ouverture vanne pendant : " +
            duree15Seconde +
            " secondes"
        );

        gpioActionOn(ouvertureVanne);

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 100;
        }

        miseAjourEtatRelay(etatRelay, (actionRelay = 1));

        setTimeout(() => {
          gpioActionOff(ouvertureVanne);
          miseAjourEtatRelay(etatRelay, (actionRelay = 0));
          resolve();
        }, duree15Seconde);
      }
    } catch (error) {
      console.log(
        "❌ ERREUR | Gestion Air | Enregistrement des datas dans la base",
        error
      );

      reject();
    }
  });
};
