const express = require("express");
const router = express.Router();
const gestionRelayApiRoutesHandler = require("../../controllers/apiControllers/gestionRelayApiControllers");

//? Gestion Relay.

router.post("/postRelayAction", gestionRelayApiRoutesHandler.postRelayAction);

//? -------------------------------------------------

module.exports = router;
