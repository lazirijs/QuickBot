const { Router } = require("express");
const app = Router();

app.get('/login', (req, res) => {
  const userId = req.query['account_linking_token'];
  const status = req.query['status'];
  console.log('link request query : ', req.query);

  // Implement logic to verify user identity and link accounts
  // ...
  console.log(`Account Linking ${status} for user ${userId}`);
  // Respond to Facebook with the result of the Account Linking process
  res.status(200).send(`Account Linking ${status} for user ${userId}`);
});

module.exports = app; 
