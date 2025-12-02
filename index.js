const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const database = require("./config/database");

database.connect();

const app = express();
const port = process.env.PORT;

const routesApiV1 = require("./api/v1/routes/index.route");

app.use(bodyParser.json());

routesApiV1(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});