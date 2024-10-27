"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doMint = void 0;
const order_1 = require("./db/order");
const doMint = (data) => {
    const { userId, stockSymbol, quantity } = JSON.parse(data);
    const stock = order_1.STOCK_BALANCES[userId][stockSymbol];
    let message;
    if (!stock) {
        order_1.STOCK_BALANCES[userId][stockSymbol] = {
            yes: {
                quantity: 0,
                locked: 0,
            },
            no: {
                quantity: 0,
                locked: 0,
            },
        };
    }
    order_1.STOCK_BALANCES[userId][stockSymbol]["yes"] = {
        "quantity": quantity,
        "locked": 0
    };
    order_1.STOCK_BALANCES[userId][stockSymbol]["no"] = {
        "quantity": quantity,
        "locked": 0
    };
    return { error: false, msg: order_1.STOCK_BALANCES[userId][stockSymbol] };
};
exports.doMint = doMint;
