import express from "express";
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";
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
    await client.lPush("taskQueue", getJsonStringifyData(orderObj))
    await subscriber.subscribe('order', (message)=>{
        res.status(200).json({msg:JSON.parse(message)})
        subscriber.unsubscribe()
    })
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
    await subscriber.subscribe('order', (message)=>{
        res.status(200).json({msg:JSON.parse(message)})
        subscriber.unsubscribe()
    })
    await client.lPush("taskQueue", getJsonStringifyData(sellObj))

})


export default router
