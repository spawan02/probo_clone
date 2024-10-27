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
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const redis_1 = require("../redis");
const router = express_1.default.Router();
router.post('/buy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, quantity, price, stockType } = req.body;
    const stockSymbol = req.body.stockSymbol;
    const actualPrice = price / 100;
    const orderObj = {
        requestType: "order",
        type: "buyOrderOption",
        userId,
        quantity,
        actualPrice,
        stockType,
        stockSymbol
    };
    yield redis_1.client.lPush("taskQueue", (0, config_1.getJsonStringifyData)(orderObj));
    yield redis_1.subscriber.subscribe('order', (message) => {
        res.status(200).json({ msg: JSON.parse(message) });
        redis_1.subscriber.unsubscribe();
    });
}));
router.post('/sell', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, stockSymbol, quantity, price, stockType } = req.body;
    const actualPrice = price / 100;
    const sellObj = {
        requestType: 'order',
        type: "sellOrderOption",
        userId,
        quantity,
        actualPrice,
        stockSymbol,
        stockType
    };
    yield redis_1.subscriber.subscribe('order', (message) => {
        res.status(200).json({ msg: JSON.parse(message) });
        redis_1.subscriber.unsubscribe();
    });
    yield redis_1.client.lPush("taskQueue", (0, config_1.getJsonStringifyData)(sellObj));
}));
exports.default = router;
