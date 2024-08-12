const express = require("express");
const router = express.Router();
const gestionCo2RoutesFrontendHandler = require("../../controllers/frontendControllers/frondendControllersGestionCo2");

router.get("/getTauxCo2", gestionCo2RoutesFrontendHandler.getTauxCo2);

router.get("/getDatasCo2", gestionCo2RoutesFrontendHandler.getDatasCo2);

router.post(
  "/postConsigneCo2",
  gestionCo2RoutesFrontendHandler.postConsigneCo2
);

router.post("/postDatasCo2", gestionCo2RoutesFrontendHandler.postDatasCo2);

//? -------------------------------------------------

module.exports = router;
