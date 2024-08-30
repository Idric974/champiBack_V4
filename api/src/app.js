const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

//? Utilisation de cors pour les connexions

app.use(cors());
app.use(express.json());

//? --------------------------------------------------

//? Header pour les Cross Origine.

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//? --------------------------------------------------

//? Module de connexion à la base de données.

const db = require("./models");
db.sequelize.sync({
  force: false,
});

//? --------------------------------------------------

//? Utilisation de body parser

app.use(bodyParser.json({ type: "application/json; charset=utf-8" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    type: "application/x-www-form-urlencoded; charset=utf-8",
  })
);

//? --------------------------------------------------

//? Les images.

app.use(
  "/images",
  express.static("/home/pi/Desktop/champiBack_V4/frontend/images")
);
//? --------------------------------------------------

//? Le CSS.

app.use(
  "/styles",
  express.static("/home/pi/Desktop/champiBack_V4/frontend/styles")
);

//? --------------------------------------------------

//? Les scripts des pages.

//* Gestion des boutons et des onglets.

app.use(
  "/gestionBoutonsEtOnglets",
  express.static(
    "/home/pi/Desktop/champiBack_V4/frontend/services/gestionBoutonsEtOnglets"
  )
);

//* Accueil.

app.use(
  "/pageAccueil",
  express.static("/home/pi/Desktop/champiBack_V4/frontend/services/pageAccueil")
);

//* Relays.

app.use(
  "/pageRelays",
  express.static("/home/pi/Desktop/champiBack_V4/frontend/services/pageRelays")
);

//* Courbes.

app.use(
  "/pageCourbes",
  express.static("/home/pi/Desktop/champiBack_V4/frontend/services/pageCourbes")
);

//? --------------------------------------------------

//? Fichier pour les graphiques.

app.use(
  "/dist",
  express.static("/home/pi/Desktop/champiBack_V4/node_modules/chart.js/dist")
);

//? --------------------------------------------------

//? Liste des routes.

//* Page accueil.

// Gestion Air.
const gestionAirGetFrondendRouteHandler = require("./routes/frontendRoutes/gestionAirRoutesFrontend");
app.use("/gestionAirRoutesFront", gestionAirGetFrondendRouteHandler);

// Gestion humidité.
const gestionHumiditeGetFrondendRouteHandler = require("./routes/frontendRoutes/gestionHumiditeRoutesFrontend");
app.use("/gestionHumiditeRoutesFront", gestionHumiditeGetFrondendRouteHandler);

// Gestion Co2.
const gestionCo2GetFrondendRouteHandler = require("./routes/frontendRoutes/gestionCo2RoutesFrontend");
app.use("/gestionCo2RoutesFront", gestionCo2GetFrondendRouteHandler);

// Gestion des courbes.
const gestionCourbesFrondendRouteHandler = require("./routes/frontendRoutes/gestionCourbesRoutesFrontend");
app.use("/gestionCourbesRoutesFront", gestionCourbesFrondendRouteHandler);

// Gestion des Relais.
const gestionRelaisFrondendRouteHandler = require("./routes/frontendRoutes/gestionRelayFrontend");
app.use("/gestionRelaysRoutesFront", gestionRelaisFrondendRouteHandler);

//* API.

// Gestion Air.
const gestionAirGetApiRouteHandler = require("./routes/apiRoutes/gestionAirRoutesApi");
app.use("/gestionAirRoutesApi", gestionAirGetApiRouteHandler);

// Gestion humidité.
const gestionHumiditeGetApiRouteHandler = require("./routes/apiRoutes/gestionHumiditeRoutesApi");
app.use("/gestionHumiditeRoutesApi", gestionHumiditeGetApiRouteHandler);

// Gestion des relais
// const gestionRelayApiRouteHandler = require("./routes/apiRoutes/gestionRelayApiRoutes");
// app.use("/gestionRelayApiRoutes", gestionRelayApiRouteHandler);

//? --------------------------------------------------

//? Génération des pages html.

const genererModele = require("/home/pi/Desktop/champiBack_V4/frontend/pages/indexGet.js");

app.get("/", async (req, res) => {
  const indexHtml = await genererModele("indexPage/index");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(indexHtml);
});

app.get("/relay", async (req, res) => {
  const relayHtml = await genererModele("relayPages/relay");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(relayHtml);
});

app.get("/courbe", async (req, res) => {
  const courbeHtml = await genererModele("courbesPages/courbe");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(courbeHtml);
});

//? --------------------------------------------------

module.exports = app;
