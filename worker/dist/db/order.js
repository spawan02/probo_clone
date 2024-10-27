"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK_BALANCES = exports.resetOrderbook = exports.resetStockbalance = exports.ORDERBOOK = exports.INR_BALANCES = void 0;
exports.resetInrbalance = resetInrbalance;
exports.INR_BALANCES = {};
exports.ORDERBOOK = {
    "BTC_USDT_10_Oct_2024_9_30": {
        "yes": {
            "9.5": {
                "total": 20,
                orders: {
                    "user1": {
                        quantity: 10,
                        type: 'sell'
                    },
                    "user2": {
                        'quantity': 10,
                        type: 'sell'
                    }
                }
            },
            "8.5": {
                "total": 10,
                "orders": {
                    "user1": {
                        'quantity': 10,
                        type: 'sell'
                    }
                }
            },
        },
        "no": {}
    }
};
const resetStockbalance = () => {
    // console.log('hi')
    exports.STOCK_BALANCES = {};
};
exports.resetStockbalance = resetStockbalance;
function resetInrbalance() {
    // console.log('reset reached in')
    exports.INR_BALANCES = {};
}
const resetOrderbook = () => {
    exports.ORDERBOOK = {};
};
exports.resetOrderbook = resetOrderbook;
exports.STOCK_BALANCES = {};
1;
