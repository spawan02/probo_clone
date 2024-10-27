"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessage = void 0;
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
const publishMessage = (mes) => {
    const mesJson = JSON.stringify(mes);
    client.publish("message", mesJson);
    console.log("message published");
};
exports.publishMessage = publishMessage;
