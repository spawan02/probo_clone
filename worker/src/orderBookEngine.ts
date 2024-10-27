import { getJsonStringifyData } from "./config";
import { ORDERBOOK } from "./db/order";

export const getOrderbook =async(data:any)=>{
    const {type, symbol} = JSON.parse(data)
    
    switch (type){
        case "stockSymbol":
            const orders = ORDERBOOK[symbol];
            if(!orders){
                return({error: true, msg: "Orderbook with provided stock symbol not found"})
            }
            return({error:false, msg: orders })

        break;
        case "orderBook":
            return ({error: false, msg: ORDERBOOK})
        break;
        }
}