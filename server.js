// Imports dependencies and set up http server
const express = require("express");
const { urlencoded, json } = require("body-parser");
const app = express();

// Use dotenv to read .env vars into Node
const dotenv = require("dotenv");
dotenv.config();

// Parse application/x-www-form-urlencoded
app.use( urlencoded({ extended: true }) );

// Parse application/json
app.use(json());

// Respond with 'Hello World' when a GET request is made to the homepage
app.get("/", (req, res) => res.send("Hello World") );

const webhook = require("./routes/webhook");
const setupProfile = require("./routes/setupProfile");
const account = require("./routes/account");

app.use("/webhook", webhook);
app.use("/set-up-profile", setupProfile);
app.use("/set-up-profile", account);

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});