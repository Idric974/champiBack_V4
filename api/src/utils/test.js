let ouvertureVanne;
let fermetureVanne;

//? Action après le calcule du delta.

let deltaHum = 3;

let actionApresCalculeDelta = () => {
  return new Promise((resolve, reject) => {
    try {
      if (deltaHum > 2) {
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | DeltaHum >  2 | On ne fait rien"
          )
        );
      }

      if (deltaHum <= 2 && deltaHum >= -2) {
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | deltaHum <= 2 && deltaHum >= -2 | Pas d'action car interval entre 2% et -2%"
          )
        );
      }

      if (deltaHum >= -5 && deltaHum < -2) {
        resolve(
          console.log(
            "✅ SUCCÈS | Gestion Humidité 16 | deltaHum >= -5 && deltaHum < -2 | Activation de l'eau au sol"
          )
        );

        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, "out");

          console.log(
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, "in");

          console.log(
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );
          resolve();
        }, 10000);
      }

      if (deltaHum >= -10 && deltaHum < -5) {
        //

        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, "out");

          console.log(
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, "in");

          console.log(
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );

          resolve();
        }, 10000);
      }

      if (deltaHum < -10) {
        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, "out");

          console.log(
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, "in");

          console.log(
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );
          resolve();
        }, 10000);

        //! ----------------------------------------
      }
    } catch (error) {
      reject();

      console.log("ERREUR calcul action delta :", error);
    }
  });
};

actionApresCalculeDelta();

//? --------------------------------------------------
