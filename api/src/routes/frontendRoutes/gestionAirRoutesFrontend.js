const express = require("express");
const router = express.Router();
const gestionAirRoutesFrontendHandler = require("../../controllers/apiControllers/apiControllersGestionAir");

//? Gestion Air.

router.get(
  "/getTemperatureAir",
  gestionAirRoutesFrontendHandler.getTemperatureAir
);
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
