const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.get("../frontend/index.html", (req, res) => {
  res.sendFile(__dirname + "../frontend/index.html");
});

app.get("/pageRelay.html", (req, res) => {
  res.sendFile(__dirname + "/pageRelay.html");
});

app.get("/pageCourbes.html", (req, res) => {
  res.sendFile(__dirname + "/pageCourbes.html");
});

app.get("/pageCourbes1.html", (req, res) => {
  res.sendFile(__dirname + "/pageCourbes1.html");
});

//? --------------------------------------------------

//? Les images.

app.use("/images", express.static("/home/pi/Desktop/champiBack_V3/images"));
//? --------------------------------------------------

//? Le CSS.

app.use("/styles", express.static("/home/pi/Desktop/champiBack_V3/styles"));
//? --------------------------------------------------

//? Le Javascript.

app.use("/", express.static("/home/pi/Desktop/champiBack_V3/"));
//? --------------------------------------------------

//? Liste des routes.

//* Frontend.

const gestionAirGetFrondendRouteHandler = require("./routes/frontendRoutes/gestionAirRoutesFrontend");
app.use("/gestionAirRoutesFront", gestionAirGetFrondendRouteHandler);

//* API.

const gestionAirGetApiRouteHandler = require("./routes/apiRoutes/gestionAirRoutesApi");
app.use("/gestionAirRoutesApi", gestionAirGetApiRouteHandler);

//? --------------------------------------------------

module.exports = app;
