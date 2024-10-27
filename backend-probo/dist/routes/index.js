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
exports.handlePubSubWithTimeout = handlePubSubWithTimeout;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const balance_1 = __importDefault(require("./balance"));
const symbol_1 = __importDefault(require("./symbol"));
const order_1 = __importDefault(require("./order"));
const trade_1 = __importDefault(require("./trade"));
const redis_1 = require("../redis");
const config_1 = require("../config");
// import { INR_BALANCES, resetInrbalance, resetOrderbook, resetStockbalance, STOCK_BALANCES } from "../db/order";
const router = express_1.default.Router();
router.use("/symbol", symbol_1.default);
router.use("/user", user_1.default);
router.use('/balances', balance_1.default);
router.use('/order', order_1.default);
router.use('/trade', trade_1.default);
router.post('/onramp/inr', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    const onRampObj = {
        requestType: 'onRamp',
        userId,
        amount
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(onRampObj));
    yield redis_1.subscriber.subscribe('onRamp', (message) => {
        res.status(200).json({
            msg: JSON.parse(message)
        });
        redis_1.subscriber.unsubscribe();
    });
}));
router.get('/orderbook/:stockSymbol', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbol = req.params.stockSymbol;
    const orderBookobj = {
        requestType: 'orderBook',
        type: 'stockSymbol',
        symbol
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(orderBookobj));
    yield redis_1.subscriber.subscribe('orderBook', (message) => {
        res.status(200).json({
            msg: JSON.parse(message)
        });
        redis_1.subscriber.unsubscribe();
    });
}));
router.post('/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = {
        requestType: "reset"
    };
    try {
        yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(obj));
        yield redis_1.subscriber.subscribe('reset', (message) => {
            res.status(200).json(JSON.parse(message));
            redis_1.subscriber.unsubscribe();
        });
    }
    catch (e) {
        console.log(e);
    }
}));
router.get('/orderbook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderBookObj = {
        requestType: 'orderBook',
        type: 'orderBook'
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(orderBookObj));
    yield redis_1.subscriber.subscribe('orderBook', (message) => {
        res.json(JSON.parse(message));
        redis_1.subscriber.unsubscribe();
    });
}));
// add the pub sub timeout  
function handlePubSubWithTimeout(channel, timeoutMs) {
    return new Promise((resolve, reject) => {
        const timeOut = setTimeout(() => {
            redis_1.subscriber.unsubscribe(channel);
            reject(new Error("Response timed out"));
        }, timeoutMs);
        redis_1.subscriber.subscribe(channel, (data) => {
            clearTimeout(timeOut);
            redis_1.subscriber.unsubscribe(channel);
            resolve(data);
        });
    });
}
exports.default = router;
