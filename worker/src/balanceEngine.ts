import { createClient } from "redis";
import { INR_BALANCES, STOCK_BALANCES } from "./db/order";

const client = createClient()
client.connect()

export const doBalance = async(data:any)=>{
    const {type, userId} = JSON.parse(data)
    const user = INR_BALANCES[userId];
    switch (type){
        case "getBalance":
            const response = {balance:user.balance, locked:0}
            await client.publish('balance',JSON.stringify(response))
        break;
        case "getInrBalance":
            const inrResponse = INR_BALANCES
            await client.publish('balance', JSON.stringify(inrResponse))
        break;
        case "getStockBalance":
            const stockResponse = STOCK_BALANCES
            await client.publish('balance', JSON.stringify(stockResponse))
        break;
        case "getUserStockBalance":
            const userResponse = STOCK_BALANCES[userId]
            await client.publish('balance',JSON.stringify(userResponse))
        break;
    }
}
