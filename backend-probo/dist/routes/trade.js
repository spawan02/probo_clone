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
const redis_1 = require("../redis");
const config_1 = require("../config");
const router = express_1.default.Router();
router.post('/mint', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, stockSymbol, quantity } = req.body;
    const mintObject = {
        requestType: 'mint',
        userId,
        stockSymbol,
        quantity
    };
    yield redis_1.client.lPush('taskQueue', (0, config_1.getJsonStringifyData)(mintObject));
    yield redis_1.subscriber.subscribe('mint', (message) => {
        res.json(JSON.parse(message));
        redis_1.subscriber.unsubscribe();
    });
    // res.json({
    //     message: `Minted ${quantity} 'yes' and 'no' tokens for ${userId}, remaining balance is ${user.balance}`
    // })
}));
exports.default = router;
