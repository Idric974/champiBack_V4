const { join } = require("path");

const { readFile } = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(readFile);

const READ_OPTIONS = { encoding: "UTF-8" };
const HTML_URL = "/home/pi/Desktop/champiBack_V4/frontend/html";

const lireFichierHtml = (file) =>
  readFileAsync(join(HTML_URL, file), READ_OPTIONS);

module.exports = async (nomPage) => {
  //* Récupérer le contenu des fichiers

  const [modeleHtml, enteteIndexHtml, bodyIndexHtml] = await Promise.all([
    lireFichierHtml("modele.html"),
    lireFichierHtml(`${nomPage}.header.html`),
    lireFichierHtml(`${nomPage}.body.html`),
  ]);

  //* Remplace les éléments spécifiques à la page dans le modèle
  const accueilHtml = modeleHtml
    .replace("{{EN-TETE}}", enteteIndexHtml)
    .replace("{{CORPS}}", bodyIndexHtml);

  //* Retourner la page HTML
  return accueilHtml;
};
