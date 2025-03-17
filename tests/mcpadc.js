const mcpadc = require('mcp-spi-adc');
const mcpChannel = 2;
const multiple = 40;
let airReadings = [];


//* Ouvre la communication SPI
const tempSensor = mcpadc.open(mcpChannel, { speedHz: 20000 }, (err) => {
  if (err) {
    console.error('Erreur lors de l’ouverture du SPI :', err);
    return;
  }

  //* Fonction qui lit la valeur et l’ajoute à airReadings
  const readSensor = () => {
    tempSensor.read((err, reading) => {
      if (err) {
        console.error('Erreur lors de la lecture :', err);
        return;
      }

      //* Convertit de 0-1 à une échelle 0-40 (hypothétique)
      let readingValues = reading.value * multiple; 
      airReadings.push(readingValues);

      console.log('[GESTION AIR] Valeurs mesurées :', airReadings);
    });
  };

  //* Lit toutes les secondes
  setInterval(readSensor, 1000);
});
