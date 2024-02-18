const { Router } = require("express");
const handler = require("../handler/facebook");
const app = Router();

// Creates the endpoint for your setup profile
app.post("/", (req, res) => {
  handler.setupProfile(req);
  res.status(200).send("End point 'POST /set-up-profile' fired successfully, check your server log.");
});

module.exports = app; 