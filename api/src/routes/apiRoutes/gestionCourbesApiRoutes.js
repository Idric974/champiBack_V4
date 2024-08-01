const express = require("express");
const router = express.Router();
const gestionCourbesRoutesApisHandler = require("../../controllers/apiControllers/gestionCourbesApiControllers");

//? Gestion Air.

router.get(
  "/getDateDemarrageCycle",
  gestionCourbesRoutesApisHandler.getDateDemarrageCycle
);

router.get(
  "/getTemperatureAirCourbe",
  gestionCourbesRoutesApisHandler.getTemperatureAirCourbe
);

router.post(
  "/dateDemarrageCycle",
  gestionCourbesRoutesApisHandler.dateDemarrageCycle
);

//? -------------------------------------------------

module.exports = router;
