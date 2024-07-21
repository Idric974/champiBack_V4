const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

//? Utilisation de cors pour les connexions

app.use(cors());

//? --------------------------------------------------

//? Header pour les Cross Origine

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
    type: "application/x-www-form-urlencoded; charset=UTF-8",
  })
);

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

//? Liste des routes.

//* Frontend.

const gestionAirGetFrondendRouteHandler = require("./routes/frontendRoutes/gestionAirRoutesFrontend");
app.use("/gestionAirRoutesFront", gestionAirGetFrondendRouteHandler);

//* API.

const gestionAirGetApiRouteHandler = require("./routes/apiRoutes/gestionAirRoutesApi");
app.use("/gestionAirRoutesApi", gestionAirGetApiRouteHandler);

const gestionRelayApiRouteHandler = require("./routes/apiRoutes/gestionRelayApiRoutes");
app.use("/gestionRelayApiRoutes", gestionRelayApiRouteHandler);

//? --------------------------------------------------

module.exports = app;
