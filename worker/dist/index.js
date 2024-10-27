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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const balanceEngine_1 = require("./balanceEngine");
const express_1 = __importDefault(require("express"));
const redis_1 = require("./redis");
const userEngine_1 = require("./userEngine");
const symbolEngine_1 = require("./symbolEngine");
const mintEngine_1 = require("./mintEngine");
const onRampEngine_1 = require("./onRampEngine");
const orderEngine_1 = require("./orderEngine");
const resetEngine_1 = require("./resetEngine");
const orderBookEngine_1 = require("./orderBookEngine");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.listen(3001);
const processTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let processedData;
    const { requestType } = JSON.parse(data);
    switch (requestType) {
        case "balance":
            processedData = yield (0, balanceEngine_1.doBalance)(data);
            redis_1.client.publish('balance', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "user":
            processedData = yield (0, userEngine_1.doUserCreate)(data);
            redis_1.client.publish('user', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "symbol":
            processedData = (0, symbolEngine_1.doSymbolCreate)(data);
            redis_1.client.publish('symbol', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "mint":
            processedData = (0, mintEngine_1.doMint)(data);
            redis_1.client.publish('mint', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "onRamp":
            processedData = (0, onRampEngine_1.doOnRamp)(data);
            redis_1.client.publish('onRamp', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "order":
            processedData = yield (0, orderEngine_1.doOrder)(data);
            redis_1.client.publish('order', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "reset":
            processedData = (0, resetEngine_1.doReset)();
            redis_1.client.publish('reset', (0, config_1.getJsonStringifyData)(processedData));
            break;
        case "orderBook":
            processedData = yield (0, orderBookEngine_1.getOrderbook)(data);
            redis_1.client.publish('orderBook', (0, config_1.getJsonStringifyData)(processedData));
            break;
    }
});
const worker = () => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        try {
            const data = yield redis_1.subscriber.brPop('taskQueue', 0);
            if (data) {
                yield processTask(data === null || data === void 0 ? void 0 : data.element);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
});
worker();
