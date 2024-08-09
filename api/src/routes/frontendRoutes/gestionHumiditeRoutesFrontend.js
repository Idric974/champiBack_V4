const express = require("express");
const router = express.Router();
const gestionHumiditeRoutesFrontendHandler = require("../../controllers/frontendControllers/frondendControllersGestionHumidite");

router.get(
  "/getTauxHumidite",
  gestionHumiditeRoutesFrontendHandler.getTauxHumidite
);

router.get(
  "/getDatasHumidite",
  gestionHumiditeRoutesFrontendHandler.getDatasHumidite
);

router.post(
  "/postConsigneHumidite",
  gestionHumiditeRoutesFrontendHandler.postConsigneHumidite
);

router.post(
  "/postDatasHumidite",
  gestionHumiditeRoutesFrontendHandler.postDatasHumidite
);

module.exports = router;
