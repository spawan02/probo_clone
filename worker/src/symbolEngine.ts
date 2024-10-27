import { getJsonStringifyData } from "./config"
import { ORDERBOOK, STOCK_BALANCES } from "./db/order"

export const doSymbolCreate = (data:any)=>{
    const {symbol} = JSON.parse(data)
    console.log(symbol);
    
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
        return {error: false, msg: `Symbol ${symbol} created successfully`}

}