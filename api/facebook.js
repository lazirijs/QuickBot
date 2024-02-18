// Sends response messages via the Send API
const request = require("request");

// The page access token we have generated in your app settings
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const send = {
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
  },
  setupProfile: (requestBody) => {
    console.log("set-up-profile");

    // Send the HTTP request to the Messenger Platform
    request({
      uri: "https://graph.facebook.com/v19.0/me/messenger_profile",
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
      },
      method: "POST",
      json: requestBody,
    },
    (err, res, body) => {
      if (!err) {
        console.log("Done !");
        console.log(body);
      } else {
        console.log("Unable to send message:" + err);
      }
    });
  },
};

module.exports = { send };