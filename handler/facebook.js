const api = require("../api/facebook");

// Handles messages events (quick_replies after send the message)
const message = (senderPsid, receivedMessage) => {
  let response;

  // Checks if the message contains text
  if (receivedMessage) {
    // Create the payload for a basic text message, which
    // will be added to the body of your request to the Send API
    response = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': [{
            'title': 'Hello Msg 👋',
            'subtitle': 'first login to your account',
            'buttons': [
              {
                'type': 'account_link',
                'url': 'https://ssm-front.onrender.com/',
                'title': 'Login',
                'payload': 'login',
              }
            ],
          }]
        }
      }
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
};

// Handles messanger setup profile request
const setupProfile = (request) => {
  request.body = request.body || {
    "get_started": {
      "payload": "GET_STARTED"
    },
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": true,
        "call_to_actions": [
          {
            "type": "postback",
            "title": "Talk to an agent",
            "payload": "TALK_AGENT"
          },
          {
            "type": "postback",
            "title": "Restart this conversation",
            "payload": "RESTART_CONVERSATION"
          },
          {
            "type": "postback",
            "title": "More info",
            "payload": "MORE_INFO",
            "call_to_actions": [
              {
                "type": "web_url",
                "title": "View Facebook Fan Page",
                "url": "https://www.facebook.com/haryphamdev",
                "webview_height_ratio": "full"
              },
              {
                "type": "web_url",
                "title": "View Youtube channel",
                "url": "https://bit.ly/subscribe-haryphamdev",
                "webview_height_ratio": "full"
              },
            ]
          }
        ]
      }
    ],
    "whitelisted_domains": [
      "https://www.facebook.com/",
    ]
  };

  // Send the setupProfile to setup messenger profile
  api.send.setupProfile(request);
};

module.exports = { message, postback, setupProfile };
