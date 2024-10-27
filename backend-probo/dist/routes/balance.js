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
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/inr/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const balanceObj = {
        type: "getBalance",
        requestType: "balance",
        userId,
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(balanceObj));
    yield redis_1.subscriber.subscribe('balance', (message) => {
        res.status(200).json({
            msg: JSON.parse(message)
        });
        redis_1.subscriber.unsubscribe();
    });
    //first push in queue
}));
router.get('/inr', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inrBalanceObj = {
        type: "getInrBalance",
        requestType: "balance",
    };
    // res.json('ji')
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(inrBalanceObj));
    // res.status(200).json(INR_BALANCES)
    yield redis_1.subscriber.subscribe('balance', (message) => {
        if (message) {
            res.status(200).json({
                msg: JSON.parse(message)
            });
            redis_1.subscriber.unsubscribe();
        }
    });
}));
router.get('/stock', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stockBalanceObject = {
        type: "getStockBalance",
        requestType: "balance",
    };
    const pubSub = (0, utils_1.handlePubSubWithTimeout)('balance', 5000);
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(stockBalanceObject));
    const response = yield pubSub;
    (0, utils_1.sendResponse)(res, response);
    // await subscriber.subscribe('balance',(message)=>{
    //     if(message) {
    //         res.status(200).json({msg:JSON.parse(message)})
    //         subscriber.unsubscribe() 
    //     }
    // })
    // res.status(200).json(STOCK_BALANCES)
}));
router.get('/stock/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const userStockBalanceObj = {
        type: 'getUserStockBalance',
        requestType: "balance",
        userId
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(userStockBalanceObj));
    yield redis_1.subscriber.subscribe('balance', (message) => {
        res.status(200).json({ msg: JSON.parse(message) });
        redis_1.subscriber.unsubscribe();
    });
    // res.json({
    //     stock: stockBalance
    // })
}));
exports.default = router;
