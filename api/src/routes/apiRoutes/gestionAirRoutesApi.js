const express = require("express");
const router = express.Router();
const gestionAirRoutesApisHandler = require("../../controllers/apiControllers/apiControllersGestionAir");

//? Gestion Air.

router.get("/getTemperatureAir", gestionAirRoutesApisHandler.getTemperatureAir);
router.post("/postConsigneAir", gestionAirRoutesApisHandler.postConsigneAir);
router.post(
  "/postPasEtObjectifAir",
  gestionAirRoutesApisHandler.postPasEtObjectifAir
);
//? -------------------------------------------------

module.exports = router;
