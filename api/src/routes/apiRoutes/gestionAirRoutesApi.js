const express = require("express");
const router = express.Router();
const gestionAirRoutesApisHandler = require("../../controllers/apiControllers/apiControllersGestionAir");

//? Gestion Air.

router.get("/getTemperatureAir", gestionAirRoutesApisHandler.getTemperatureAir);
router.post("/gpioActionOn", gestionAirRoutesApisHandler.gpioActionOn);
router.post("/gpioActionOff", gestionAirRoutesApisHandler.gpioActionOff);
//? -------------------------------------------------

module.exports = router;
