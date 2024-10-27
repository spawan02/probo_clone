"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePubSubWithTimeout = handlePubSubWithTimeout;
exports.sendResponse = sendResponse;
const redis_1 = require("../redis");
function handlePubSubWithTimeout(channel, timeoutS) {
    return new Promise((resolve, reject) => {
        const timeOut = setTimeout(() => {
            redis_1.subscriber.unsubscribe(channel);
            reject(new Error("Response timed out"));
        }, timeoutS);
        redis_1.subscriber.subscribe(channel, (message) => {
            clearTimeout(timeOut);
            redis_1.subscriber.unsubscribe(channel);
            resolve(message);
        });
    });
}
function sendResponse(res, payload) {
    try {
        const { error, data } = JSON.parse(payload);
        if (error) {
            res.status(400).json(data);
        }
        else {
            res.status(200).json(data);
        }
    }
    catch (err) {
        res.status(500).json("Invalid response from the server");
    }
}
