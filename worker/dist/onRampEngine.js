"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doOnRamp = void 0;
const order_1 = require("./db/order");
const doOnRamp = (data) => {
    const { userId, amount } = JSON.parse(data);
    const user = order_1.INR_BALANCES[userId];
    if (!user) {
        return { error: true, msg: `User ${userId} doesn't exist` };
    }
    user.balance += amount;
    return { error: false, msg: user };
};
exports.doOnRamp = doOnRamp;
