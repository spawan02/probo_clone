"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSymbolCreate = void 0;
const config_1 = require("./config");
const order_1 = require("./db/order");
const doSymbolCreate = (data) => {
    const { symbol } = JSON.parse(data);
    console.log(symbol);
    order_1.ORDERBOOK[symbol] = { yes: {}, no: {} };
    Object.keys(order_1.STOCK_BALANCES).forEach((userId) => {
        order_1.STOCK_BALANCES[userId][symbol] = {
            yes: {
                quantity: 0,
                locked: 0,
            },
            no: {
                quantity: 0,
                locked: 0,
            },
        };
    });
    const response = (0, config_1.getJsonStringifyData)(order_1.ORDERBOOK[symbol]);
    return { error: false, msg: `Symbol ${symbol} created successfully` };
};
exports.doSymbolCreate = doSymbolCreate;
