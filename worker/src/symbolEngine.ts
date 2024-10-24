import { getJsonStringifyData } from "./config"
import { ORDERBOOK, STOCK_BALANCES } from "./db/order"
import { client } from "./redis"

export const doSymbolCreate = async(data:any)=>{
    const {symbol} = JSON.parse(data)
        ORDERBOOK[symbol]= {yes:{}, no:{}}
        Object.keys(STOCK_BALANCES).forEach((userId)=>{
          
          STOCK_BALANCES[userId][symbol]= {
                yes: {
                    quantity: 0,
                    locked: 0,
                  },
                  no: {
                    quantity: 0,
                    locked: 0,
                  },
                };
              })
        
        const response = getJsonStringifyData(ORDERBOOK[symbol])
        await client.publish('symbol', response)
    
}