"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doReset = void 0;
const order_1 = require("./db/order");
const doReset = () => {
    (0, order_1.resetInrbalance)();
    (0, order_1.resetStockbalance)();
    (0, order_1.resetOrderbook)();
    const response = 'Reset successfull';
    return ({ error: false, msg: response });
};
exports.doReset = doReset;
