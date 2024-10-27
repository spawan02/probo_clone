import express from "express";
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";
import { handlePubSubWithTimeout, sendResponse } from "../utils";
const router = express.Router()

router.post('/buy',async(req,res)=>{    
    const {userId, quantity, price, stockType} = req.body;
    const stockSymbol = req.body.stockSymbol;
    const actualPrice = price/100
    const orderObj = {
        requestType: "order",
        type: "buyOrderOption",
        userId,
        quantity,
        actualPrice, 
        stockType,
        stockSymbol

    }
    const pubSub = handlePubSubWithTimeout('order', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(orderObj))
    const response = await pubSub
    sendResponse(res, response)
})   
    
    

router.post('/sell',async(req,res)=>{
    const {userId, stockSymbol, quantity, price, stockType} = req.body;
    const actualPrice = price/100
    const sellObj = {
        requestType: 'order',
        type: "sellOrderOption",
        userId, 
        quantity,
        actualPrice,
        stockSymbol,
        stockType
    }
    const pubSub = handlePubSubWithTimeout('order', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(sellObj))
    const response = await pubSub
    sendResponse(res, response)
  
})


export default router
