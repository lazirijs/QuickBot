const { Router } = require("express");
const handler = require("../handler/facebook");
const app = Router();

// Creates the endpoint for your setup profile
app.post("/", handler.setupProfile());

module.exports = app; 