"use strict";

var Alexa = require("alexa-sdk");
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

var states = {
    NewCoffeeLog: "_NEWCOFFEELOG",
    InputRoaster: "_INPUTROASTER",
    InputBrewMethod: "_INPUTBREWMETHOD",
    InputCoffeeWeight: "_INPUTCOFFEEWEIGHT",
    InputWaterWeight: "_INPUTWATERWEIGHT"
};

var attributes = {
    roaster: "roaster",
    brewMethod: "brewmethod",
    coffeeWeight: "coffeeweight",
    waterWeight: "waterweight"
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(
        baseHandlers,
        newCoffeeLogHandlers,
        inputRoasterHandlers
    );
    alexa.execute();
};

var baseHandlers = {
    "NewSession": function() {
        this.emit(":ask", "Welcome to Coffee Log. Would you like start start a new log?", "Say yes to start a new log or no to cancel.");
        this.handler.state = states.NewCoffeeLog;
    },
    "AMAZON.StopIntent": function() {
      this.emit(":tell", "Goodbye!");  
    },
    "AMAZON.CancelIntent": function() {
      this.emit(":tell", "Goodbye!");  
    },
    "SessionEndedRequest": function () {
        console.log("session ended!");
        //this.attributes["endedSessionCount"] += 1;
        this.emit(":tell", "Goodbye!");
    },
    "Unhandled": function() {
        this.emit(":tell", "I have no idea what you just said. Exiting.");
    }
};

var newCoffeeLogHandlers = Alexa.CreateStateHandler(states.NewCoffeeLog, {
    "AMAZON.YesIntent": function() {
        console.log("New coffee log");
        this.emit(":ask", "Okay! What is the coffee roaster's name?", "Say the name of the coffee roaster. For example: 'Olympia Coffee'");
        this.handler.state = states.InputRoaster;
    },
    "AMAZON.NoIntent": function() {
        console.log("New coffee log - cancel");
        this.emit(":tell", "Fine, be that way!");
    },
    "AMAZON.CancelIntent": function() {
        console.log("New coffee log - cancel");
        this.emit(":tell", "Fine, be that way!");
    }
});

var inputRoasterHandlers = Alexa.CreateStateHandler(states.InputRoaster, {
    "InputRoasterIntent": function() {
        var roasterSlot = this.event.request.intent.slots.CoffeeRoaster;
        var roasterName = roasterSlot && roasterSlot.value;
        console.log(`Roaster input: ${roasterName}`);
        this.emit(":tell", `The roaster you told me was ${roasterName}.`);
    }
});