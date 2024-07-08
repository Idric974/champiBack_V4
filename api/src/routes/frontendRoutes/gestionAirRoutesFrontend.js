const express = require("express");
const router = express.Router();
const gestionAirRoutesFrontendHandler = require("../../controllers/frontendControllers/frondendControllersGestionAir");

//? Gestion Air.

router.get(
  "/getTemperatureAir",
  gestionAirRoutesFrontendHandler.getTemperatureAir
);

router.get("/getDataAir", gestionAirRoutesFrontendHandler.getDataAir);

router.post(
  "/postConsigneAir",
  gestionAirRoutesFrontendHandler.postConsigneAir
);
router.post(
  "/postPasEtObjectifAir",
  gestionAirRoutesFrontendHandler.postPasEtObjectifAir
);

//? -------------------------------------------------

module.exports = router;
