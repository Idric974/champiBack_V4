const express = require("express");
const router = express.Router();
const gestionAirRoutesFrontendHandler = require("../../controllers/frontendControllers/frondendControllersGestionAir");

//? Gestion Air.

router.get(
  "/getTemperatureAir",
  gestionAirRoutesFrontendHandler.getTemperatureAir
);

router.get(
  "/getPasEtConsigneTemperatureAir",
  gestionAirRoutesFrontendHandler.getPasEtConsigneTemperatureAir
);

router.post(
  "/postConsigneTemperatureAir",
  gestionAirRoutesFrontendHandler.postConsigneTemperatureAir
);

router.post(
  "/postPasEtConsigneTemperatureAir",
  gestionAirRoutesFrontendHandler.postPasEtConsigneTemperatureAir
);

router.post(
  "/postVanneActiveAir",
  gestionAirRoutesFrontendHandler.postVanneActiveAir
);

router.post(
  "/postFermetureVanneAir",
  gestionAirRoutesFrontendHandler.postFermetureVanneAir
);

//? -------------------------------------------------

module.exports = router;
