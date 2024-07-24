const express = require("express");
const router = express.Router();
const gestionRelayApiRoutesHandler = require("../../controllers/apiControllers/gestionRelayApiControllers");

//? Gestion Relay.

router.get(
  "/activerRelayEauAuSol",
  gestionRelayApiRoutesHandler.activerRelayEauAuSol
);

router.post(
  "/relayVanneFroid5Secondes",
  gestionRelayApiRoutesHandler.relayVanneFroid5Secondes
);

router.post(
  "/relayVanneFroid40Secondes",
  gestionRelayApiRoutesHandler.relayVanneFroid40Secondes
);

router.post("/relayVentilo", gestionRelayApiRoutesHandler.relayVentilo);

//? -------------------------------------------------

module.exports = router;
