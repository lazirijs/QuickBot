const api = require("../api/facebook");

// Handles messages events (quick_replies after send the message)
const message = (senderPsid, receivedMessage) => {
  let response;

  // Checks if the message contains text
  if (receivedMessage) {
    // Create the payload for a basic text message, which
    // will be added to the body of your request to the Send API
    response = {
      text: "Hello 👋 \nWhat can I do to help you today?",
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

  // Send the response message
  api.send.msg(senderPsid, response);
};

// Handles messaging_postbacks events (quick_replies before send the message)
const postback = (senderPsid, receivedPostback) => {
  let response;

  // Get the payload for the postback
  let payload = receivedPostback.payload;
  console.log("receivedPostback =>");
  console.log(receivedPostback);

  // Set the response based on the postback payload
  if (receivedPostback.title) {
    response = {
      text: "Hello 👋! \nWhat can I do to help you today?",
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
};

module.exports = { message, postback };