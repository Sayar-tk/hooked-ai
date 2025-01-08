console.log("Starting server.js...");

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
const bodyParser = require("body-parser");

// Parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cashfree Route
const cashfreeRoute = require("./routes/cashfree/cashfreeRoute");
app.use("/api", cashfreeRoute);

// Starting Server
app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});
