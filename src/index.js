"use strict";

const Alexa = require("alexa-sdk");

const STATES = {
    NewCoffeeLog: "_NEWCOFFEELOG",
    InputRoaster: "_INPUTROASTER",
    InputBrewMethod: "_INPUTBREWMETHOD",
    InputCoffeeWeight: "_INPUTCOFFEEWEIGHT",
    InputWaterWeight: "_INPUTWATERWEIGHT",
    InputRating: "_INPUTRATING",
    SaveAndClose: "_SAVEANDCLOSE"
};

const ATTRIBUTES = {
    roaster: "roaster",
    brewMethod: "brewmethod",
    coffeeWeight: "coffeeweight",
    waterWeight: "waterweight",
    rating: "rating"
};

const baseHandlers = {
    "StartNewLogIntent": function NewCoffeeLogIntent() {
        console.log("[Base] Start new log intent");
        const intentSlots = this.event.request.intent.slots;
        const roasterName = intentSlots && intentSlots.CoffeeRoaster && intentSlots.CoffeeRoaster.value;
        console.log(`Roaster name: ${roasterName}`);

        if (roasterName) {
            this.handler.state = STATES.InputBrewMethod;
            this.emit(":ask", "What brew method did you use?");
        } else {
            this.handler.state = STATES.InputRoaster;
            this.emit(":ask", "What is the coffee roaster's name?");
        }
    },
    "SaveAndClose": function BaseSaveAndClose() {
        // TODO: save to Google Sheet
        const roasterName = this.attributes[ATTRIBUTES.roaster];
        const brewMethod = this.attributes[ATTRIBUTES.brewMethod];
        const rating = this.rating[ATTRIBUTES.rating];
        this.emit(":tell", `Coffee log saved for roaster ${roasterName} with brew method ${brewMethod} and a rating of ${rating}.`);
    },
    "NewSession": function BaseNewSession() {
        console.log("[Base] New session");
        this.handler.state = STATES.NewCoffeeLog;
        this.emit(":ask", "Welcome to Coffee Log. Would you like start a new log?", "Say yes to start a new log or no to cancel.");
    },
    "AMAZON.StopIntent": function BaseStopIntent() {
        console.log("[Base] Stop intent");
        this.emit(":tell", "Goodbye!");
    },
    "AMAZON.CancelIntent": function BaseCancelIntent() {
        console.log("[Base] Cancel intent");
        this.emit(":tell", "Goodbye!");
    },
    "SessionEndedRequest": function BaseSessionEndedRequest() {
        console.log("[Base] Session ended");
        this.emit(":tell", "Goodbye!");
    },
    "Unhandled": function BaseUnhandled() {
        console.warn(
            `UNHANDLED INTENT: `
            + `\nCurrent State: ${this.handler.state} `
            + `\nRequest: ${JSON.stringify(this.event)}`
        );
        this.emit(":tell", "Unhandled event. Exiting.");
    }
};

/**
 * Creates a handler object that extends the baseHandlers object, with the provided
 * handler object overriding any properties that are shared between the two objects.
 * 
 * @param {string} state The state the provided handler should handle.
 * @param {Object} handlerObject The handler object whose keys should be events from Alexa.
 * @return An Alexa SDK state handler.
 */
function createStateHandler(state, handlerObject) {
    const finalHandler = {};

    // First shallow copy the base handler
    Object.keys(baseHandlers).forEach((key) => {
        finalHandler[key] = baseHandlers[key];
    });

    // Now copy over the provided handlerObject, overriding the base handler
    Object.keys(handlerObject).forEach((key) => {
        finalHandler[key] = handlerObject[key];
    });

    return Alexa.CreateStateHandler(state, finalHandler);
}

/**
 * NewCoffeeLog State Handlers.
 */
const newCoffeeLogHandlers = createStateHandler(STATES.NewCoffeeLog, {
    "AMAZON.YesIntent": function NewCoffeeLogYesIntent() {
        console.log("[New Coffee Log] Yes intent");
        this.handler.state = STATES.InputRoaster;
        this.emit(":ask", "Okay! What is the coffee roaster's name?", "Say the name of the coffee roaster. For example: 'Olympia Coffee'");
    },
    "AMAZON.NoIntent": function NewCoffeeLogNoIntent() {
        console.log("[New Coffee Log] No intent");
        this.emit(":tell", "Fine, be that way!");
    }
});

/**
 * InputRoaster State Handlers.
 */
const inputRoasterHandlers = createStateHandler(STATES.InputRoaster, {
    "InputRoasterIntent": function InputRoasterIntent() {
        console.log("[Input Roaster] Intent");
        const roasterSlot = this.event.request.intent.slots.CoffeeRoaster;
        const roasterName = roasterSlot && roasterSlot.value;
        console.log(`Roaster name: ${roasterName}`);

        // TODO: reprompt if roasterName is undefined
        this.attributes[ATTRIBUTES.roaster] = roasterName;

        this.handler.state = STATES.InputBrewMethod;
        this.emit(":ask", "Got it. What brew method did you use?", "Say the name of your brew method. For example: 'aeropress'");
    }
});

/**
 * InputBrewMethod State Handlers.
 */
const inputBrewMethodHandlers = createStateHandler(STATES.InputBrewMethod, {
    "InputBrewMethodIntent": function InputBrewMethodIntent() {
        console.log("[Input Brew Method] Intent");
        const brewMethodSlot = this.event.request.intent.slots.BrewMethod;
        const brewMethod = brewMethodSlot && brewMethodSlot.value;
        console.log(`Brew method: ${brewMethod}`);

        // TODO: reprompt if brewMethod is undefined
        this.attributes[ATTRIBUTES.brewMethod] = brewMethod;

        this.handler.state = STATES.InputRating;
        this.emit(":ask", "From one to ten, how would you rate the coffee?", "");
    }
});

/**
 * InputRating State Handlers.
 */
const inputRatingHandlers = createStateHandler(STATES.InputRating, {
    "InputRatingIntent": function InputRatingIntent() {
        console.log("[Input Rating] Intent");
        const ratingSlot = this.event.request.intent.slots.Rating;
        const rating = ratingSlot && ratingSlot.value;
        console.log(`Rating: ${rating}`);

        // TODO: reprompt if rating is undefined
        this.attributes[ATTRIBUTES.rating] = rating;

        this.emit("SaveAndClose");
    }
});

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.68ae1a01-c9b1-4953-9804-b2dc353daa6e";
    alexa.registerHandlers(
        baseHandlers,
        newCoffeeLogHandlers,
        inputRoasterHandlers,
        inputBrewMethodHandlers,
        inputRatingHandlers
    );
    alexa.execute();
};