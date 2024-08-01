const spi = require("spi-device");

// Configuration du SPI
const bus = 0;
const device = 0;
const mcp3008 = spi.open(bus, device, (err) => {
  if (err) {
    console.log("Erreur lors de l'ouverture du périphérique SPI:", err);
    return;
  }

  console.log("Périphérique SPI ouvert avec succès");

  // Exemple de lecture des valeurs
  for (let channel = 0; channel < 8; channel++) {
    readAdc(channel, (value) => {
      console.log(`Valeur du canal ${channel}: ${value}`);
    });
  }
});

function readAdc(channel, callback) {
  if (channel < 0 || channel > 7) {
    throw new Error("Le canal doit être entre 0 et 7 inclus");
  }

  const message = [
    {
      sendBuffer: Buffer.from([1, (8 + channel) << 4, 0]),
      receiveBuffer: Buffer.alloc(3),
      byteLength: 3,
      speedHz: 1350000,
    },
  ];

  mcp3008.transfer(message, (err, message) => {
    if (err) {
      console.log("Erreur lors de la lecture du canal:", err);
      return;
    }

    const rawValue =
      ((message[0].receiveBuffer[1] & 3) << 8) + message[0].receiveBuffer[2];
    callback(rawValue);
  });
}
