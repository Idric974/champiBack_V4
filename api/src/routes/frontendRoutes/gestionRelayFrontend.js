const express = require("express");
const router = express.Router();
const gestionRelaysRoutesFrontendHandler = require("../../controllers/frontendControllers/fontendGestionRelaysControllers");

//? Gestion Relay.

router.get(
  "/activerRelayEauAuSol",
  gestionRelaysRoutesFrontendHandler.activerRelayEauAuSol
);

router.get(
  "/getEtatRelaisEauAuSol",
  gestionRelaysRoutesFrontendHandler.getEtatRelaisEauAuSol
);

router.post(
  "/relayVanneFroid5Secondes",
  gestionRelaysRoutesFrontendHandler.relayVanneFroid5Secondes
);

router.post(
  "/relayVanneFroid40Secondes",
  gestionRelaysRoutesFrontendHandler.relayVanneFroid40Secondes
);

router.post("/relayVentilo", gestionRelaysRoutesFrontendHandler.relayVentilo);

//? -------------------------------------------------

module.exports = router;
