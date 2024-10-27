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
exports.doUserCreate = void 0;
const order_1 = require("./db/order");
const doUserCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = JSON.parse(data);
    if (!(order_1.INR_BALANCES[userId])) {
        order_1.INR_BALANCES[userId] = {
            balance: 0,
            locked: 0
        };
        order_1.STOCK_BALANCES[userId] = {};
        return ({ error: false, msg: `user created successfull`, balance: order_1.INR_BALANCES[userId] });
    }
    else {
        return ({ error: true, msg: `User ${userId} already exists` });
    }
});
exports.doUserCreate = doUserCreate;
