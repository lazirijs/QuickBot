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
    // Construct the message body
    let url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}&v=15.0`;

    // Send the HTTP request to the Messenger Platform
    request({
      uri: url,
      method: "POST",
      json: requestBody,
    },
    (err, res, body) => {
      if (!err) {
          console.log(body);
          resolve("Done!")
      } else {
          reject("Unable to send message:" + err);
      }
    });
  },
};

module.exports = { send };