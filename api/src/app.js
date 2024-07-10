const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

//? Utilisation de cors pour les connexions

const cors = require("cors");
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

app.use(bodyParser.json());

//? --------------------------------------------------

//? Génération des pages html.

//! TEST

//! --------------------------------------------------

const genererModele = require("/home/pi/Desktop/champiBack_V4/frontend/pages/indexGet.js");

app.get("/", async (req, res) => {
  const indexHtml = await genererModele("index");
  res.send(indexHtml);
});

// app.use(express.static(path.join(__dirname, "../../frontend")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "index.html"));
// });

// app.get("/pageRelay.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "/pageRelay.html"));
// });

// app.get("/pageCourbes.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend", "/pageCourbes.html"));
// });

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
