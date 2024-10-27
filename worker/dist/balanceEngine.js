"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doBalance = void 0;
const redis_1 = require("redis");
const order_1 = require("./db/order");
const client = (0, redis_1.createClient)();
client.connect();
const doBalance = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, userId } = JSON.parse(data);
    const user = order_1.INR_BALANCES[userId];
    switch (type) {
        case "getBalance":
            const response = order_1.INR_BALANCES[userId];
            if (!response) {
                return { error: true, msg: `User ${userId} not found` };
            }
            return { error: false, msg: response };
        case "getInrBalance":
            const inrResponse = order_1.INR_BALANCES;
            return { error: false, msg: inrResponse };
        case "getStockBalance":
            const stockResponse = order_1.STOCK_BALANCES;
            return { error: false, msg: stockResponse };
        case "getUserStockBalance":
            const userResponse = order_1.STOCK_BALANCES[userId];
            if (!userResponse) {
                return { error: true, msg: "User not found or no stock balance available" };
            }
            return { error: false, msg: userResponse };
    }
});
exports.doBalance = doBalance;
