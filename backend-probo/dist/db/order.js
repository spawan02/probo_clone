"use strict";
// 
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK_BALANCES = exports.resetOrderbook = exports.resetStockbalance = exports.ORDERBOOK = exports.INR_BALANCES = void 0;
exports.resetInrbalance = resetInrbalance;
exports.INR_BALANCES = {
    "user1": {
        balance: 1000000,
        locked: 0
    },
};
exports.ORDERBOOK = {
    "BTC_USDT_10_Oct_2024_9_30": {
        "yes": {
            "9.5": {
                "total": 12,
                orders: {
                    "user1": 2,
                    "user2": 10
                }
            },
            "8.5": {
                "total": 12,
                "orders": {
                    "user1": 3,
                    "user2": 3,
                    "user3": 6
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
exports.STOCK_BALANCES = {
    user1: {
        "BTC_USDT_10_Oct_2024_9_30": {
            "yes": {
                "quantity": 1,
                "locked": 0
            }
        }
    },
};
1;
