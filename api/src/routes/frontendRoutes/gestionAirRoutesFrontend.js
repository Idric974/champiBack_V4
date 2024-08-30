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
  "/postFermetureVanneAir",
  gestionAirRoutesFrontendHandler.postFermetureVanneAir
);

//? -------------------------------------------------

//? Vanne active.

router.get("/getVanneActive", gestionAirRoutesFrontendHandler.getVanneActive);

router.post(
  "/postVanneActiveAir",
  gestionAirRoutesFrontendHandler.postVanneActiveAir
);

//? -------------------------------------------------

module.exports = router;
