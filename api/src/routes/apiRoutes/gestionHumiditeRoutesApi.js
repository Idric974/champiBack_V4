const express = require("express");
const router = express.Router();
const gestionAirRoutesApisHandler = require("../../controllers/apiControllers/apiControllersHumidite");

//? Gestion Air.

router.get(
  "/getConsigneHumidite",
  gestionAirRoutesApisHandler.getConsigneHumidite
);

//? -------------------------------------------------

module.exports = router;
