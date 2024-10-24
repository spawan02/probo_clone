import { INR_BALANCES, STOCK_BALANCES } from "./db/order";
import { client } from "./redis";

export const doMint=(data:any)=>{
    const {userId, stockSymbol, quantity} = JSON.parse(data)
    const stock = STOCK_BALANCES[userId][stockSymbol]
    // const user  = INR_BALANCES[userId];
    // console.log(stockSymbol)
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
    // res.json(userId)
    STOCK_BALANCES[userId][stockSymbol]["yes"]={
        "quantity": quantity,
        "locked":0
    }
    STOCK_BALANCES[userId][stockSymbol]["no"] ={
        "quantity": quantity,
        "locked":0
    }
    message = `Minted ${quantity} 'yes' and 'no' tokens for ${userId}`
    client.publish('mint', JSON.stringify(message))
} 

