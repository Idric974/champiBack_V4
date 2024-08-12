const express = require("express");
const router = express.Router();
const gestionAirRoutesFrontendHandler = require("../../controllers/frontendControllers/fontendGestionCourbesControllers");

//? Gestion Air.

//* Gestion des datas à afficher.
router.get(
  "/getDateDemarrageCycle",
  gestionAirRoutesFrontendHandler.getDateDemarrageCycle
);

router.post(
  "/dateDemarrageCycle",
  gestionAirRoutesFrontendHandler.dateDemarrageCycle
);

//* Gestion Air.

router.get(
  "/getTemperatureAirCourbe",
  gestionAirRoutesFrontendHandler.getTemperatureAirCourbe
);

router.get(
  "/getConsigneAirCourbe",
  gestionAirRoutesFrontendHandler.getConsigneAirCourbe
);

//* Gestion Humidité.
router.get(
  "/getTauxHumiditeCourbe",
  gestionAirRoutesFrontendHandler.getTauxHumiditeCourbe
);

router.get(
  "/getConsigneHumiditeCourbe",
  gestionAirRoutesFrontendHandler.getConsigneHumiditeCourbe
);

//* Gestion Co2.
router.get(
  "/getTauxCo2Courbe",
  gestionAirRoutesFrontendHandler.getTauxCo2Courbe
);

router.get(
  "/getDataCo2Courbe",
  gestionAirRoutesFrontendHandler.getDataCo2Courbe
);

//? -------------------------------------------------

module.exports = router;
