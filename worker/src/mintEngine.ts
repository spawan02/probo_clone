import { STOCK_BALANCES } from "./db/order";

export const doMint=(data:any)=>{
    const {userId, stockSymbol, quantity} = JSON.parse(data)
    const stock = STOCK_BALANCES[userId][stockSymbol]
    
    let message;
    if(!stock){
        STOCK_BALANCES[userId][stockSymbol]={
            yes: {
                quantity: 0,
                locked: 0,
              },
              no: {
                quantity: 0,
                locked: 0,
              },
            };
    }
    STOCK_BALANCES[userId][stockSymbol]["yes"]={
        "quantity": quantity,
        "locked":0
    }
    STOCK_BALANCES[userId][stockSymbol]["no"] ={
        "quantity": quantity,
        "locked":0
    }
    return {error: false, msg: STOCK_BALANCES[userId][stockSymbol]}
} 

