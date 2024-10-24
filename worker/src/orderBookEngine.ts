import { getJsonStringifyData } from "./config";
import { ORDERBOOK } from "./db/order";
import { client } from "./redis";

export const getOrderbook =async(data:any)=>{
    const {type, symbol} = JSON.parse(data)
    
    switch (type){
        case "stockSymbol":
            const orders = ORDERBOOK[symbol];
            await client.publish('orderBook', getJsonStringifyData(orders))
        break;
        case "orderBook":
            await client.publish('orderBook', getJsonStringifyData(ORDERBOOK))
        break;
        }
}