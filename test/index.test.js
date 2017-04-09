"use strict";

const main = require("../src/index");

const event = {
    "session": {
        "new": true,
        "sessionId": "amzn1.echo-api.session.[unique-value-here]",
        "attributes": {},
        "user": {
            "userId": "amzn1.ask.account.[unique-value-here]"
        },
        "application": {
            "applicationId": "amzn1.ask.skill.68ae1a01-c9b1-4953-9804-b2dc353daa6e"
        }
    },
    "version": "1.0",
    "request": {
        "locale": "en-US",
        "timestamp": "2016-10-27T18:21:44Z",
        "type": "LaunchIntent",
        "requestId": "amzn1.echo-api.request.[unique-value-here]"
    },
    "context": {
        "AudioPlayer": {
            "playerActivity": "IDLE"
        },
        "System": {
            "device": {
                "supportedInterfaces": {
                    "AudioPlayer": {}
                }
            },
            "application": {
                "applicationId": "amzn1.ask.skill.68ae1a01-c9b1-4953-9804-b2dc353daa6e"
            },
            "user": {
                "userId": "amzn1.ask.account.[unique-value-here]"
            }
        }
    }
};

const context = {
    succeed: function(response) {
        console.log(`SUCCESS: \n${JSON.stringify(response, null, 4)}`);
    },
    fail: function(error) {
        console.error(`Failed`);
    }
};

main.handler(event, context);