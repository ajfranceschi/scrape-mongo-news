const express = require("express");
const handlebars = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
require('./config/connection');

const PORT = process.env.PORT || 3005;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//routes
require('./controllers/routes')(app);

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
