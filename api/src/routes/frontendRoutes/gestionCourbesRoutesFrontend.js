const express = require("express");
const router = express.Router();
const gestionAirRoutesFrontendHandler = require("../../controllers/frontendControllers/fontendGestionCourbesControllers");

//? Gestion Air.

router.get(
  "/getDateDemarrageCycle",
  gestionAirRoutesFrontendHandler.getDateDemarrageCycle
);

router.get(
  "/getTemperatureAirCourbe",
  gestionAirRoutesFrontendHandler.getTemperatureAirCourbe
);

router.get(
  "/getConsigneAirCourbe",
  gestionAirRoutesFrontendHandler.getConsigneAirCourbe
);

router.post(
  "/dateDemarrageCycle",
  gestionAirRoutesFrontendHandler.dateDemarrageCycle
);

//? -------------------------------------------------

module.exports = router;
