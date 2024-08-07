const express = require("express");
const router = express.Router();
const gestionHumiditeRoutesFrontendHandler = require("../../controllers/frontendControllers/frondendControllersGestionHumidite");

router.get(
  "/getTauxHumidite",
  gestionHumiditeRoutesFrontendHandler.getTauxHumidite
);

router.get(
  "/getConsigneHumidite",
  gestionHumiditeRoutesFrontendHandler.getConsigneHumidite
);

router.post(
  "/postConsigneHumidite",
  gestionHumiditeRoutesFrontendHandler.postConsigneHumidite
);

router.post(
  "/postPasetObjectifHumidite",
  gestionHumiditeRoutesFrontendHandler.postPasetObjectifHumidite
);

module.exports = router;
