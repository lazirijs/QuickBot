// Imports dependencies and set up http server
const express = require("express");
const { urlencoded, json } = require("body-parser");
const app = express();

// Use dotenv to read .env vars into Node
const dotenv = require("dotenv");
dotenv.config();

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

// The page access token we have generated in your app settings
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const api = {
  send: {
    msg: (senderPsid, response) => {

      // Construct the message body
      let requestBody = {
        recipient: {
          id: senderPsid,
        },
        message: response,
      };

      // Send the HTTP request to the Messenger Platform
      request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: requestBody,
      },
        (err, _res, _body) => {
          if (!err) {
            console.log(`--- new Message sent ---`);
          } else {
            console.error("Unable to send message : " + err);
          }
        });
    }
  }
}

const handler = {
  message: (senderPsid, receivedMessage) => {
    let response;

    // Checks if the message contains text
    if (receivedMessage) {
      // Create the payload for a basic text message, which
      // will be added to the body of your request to the Send API
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": "Connect Facebook to continue",
            "buttons": [
              {
                "type": "account_link",
                "url": "https://quickbot-1c1m.onrender.com/account/login"
              }
            ]
          }
        }
      };
    }

    // Send the response message
    api.send.msg(senderPsid, response);
  },

  // Handles messaging_postbacks events (quick_replies before send the message)
  postback: (senderPsid, receivedPostback) => {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    if (receivedPostback.title) {
      response = {
        text: "Hello Post Back 👋 \nWhat can I do to help you today?",
        quick_replies: [{
          content_type: "text",
          title: "Categories",
          payload: "CATEGORIES",
        },
        {
          content_type: "text",
          title: "Lookup Order",
          payload: "LOOKUP_ORDER",
        },
        {
          content_type: "text",
          title: "Talk to an agent",
          payload: "TALK_AGENT",
        },
        ],
        //'text': `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`
      };
    }
    // Send the message to acknowledge the postback
    api.send.msg(senderPsid, response);
  }
}
// Respond with 'Hello World' when a GET request is made to the homepage
app.get("/", (req, res) => res.send("Hello World"));

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode == "subscribe" && token == VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      //console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for your webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks if this is an event from a page subscription
  if (body.object == "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach((entry) => {
      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];

      console.log("webhook Event : ", webhookEvent);
      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;
      //console.log('Sender PSID: ' + senderPsid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        handler.message(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handler.postback(senderPsid, webhookEvent.postback);
      }
      // Check for Account Linking event
      else if (webhookEvent.account_linking) {
        const status = webhookEvent.account_linking.status;

        if (status === 'linked') {
          // User account successfully linked
          console.log(`User ${senderPsid} linked their account.`);
        } else if (status === 'unlinked') {
          // User account unlinked
          console.log(`User ${senderPsid} unlinked their account.`);
        }
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get('/account/login', (req, res) => {
  const userId = req.query['account_linking_token'];
  const status = req.query['status'];
  console.log('link request query : ', req.query);

  // Implement logic to verify user identity and link accounts
  // ...
  console.log(`Account Linking ${status} for user ${userId}`);
  // Respond to Facebook with the result of the Account Linking process
  res.status(200).send(`Account Linking ${status} for user ${userId}`);
});

app.get('/account/logout', (req, res) => {
  console.log(`Account Logged out \n`, 'request query : ', req.query);
  res.status(200).send(`Account Logged out`);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
