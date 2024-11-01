import express from "express";
import userRouter from './user';
import balanceRouter from './balance';
import symbolRouter from './symbol';
import orderRouter from './order';
import tradeRouter from './trade'
import { client, subscriber } from "../redis";
import { getJsonStringifyData } from "../config";
import { handlePubSubWithTimeout, sendResponse } from "../utils";

const router = express.Router()

router.use("/symbol", symbolRouter)
router.use("/user",userRouter)
router.use('/balances', balanceRouter)
router.use('/order', orderRouter)
router.use('/trade', tradeRouter)

router.get("/",(_,res)=>{
    res.json({message:"Server is healty"})
})

router.post('/onramp/inr',async(req,res)=>{
    const {userId, amount}= req.body; 
    const onRampObj = {
        requestType: 'onRamp',
        userId,
        amount
    }
    const pubSub = handlePubSubWithTimeout('onRamp', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(onRampObj))
    const response = await pubSub
    sendResponse(res, response)
    
})

router.get('/orderbook/:stockSymbol',async(req,res)=>{
    const symbol = req.params.stockSymbol
    const orderBookobj ={
        requestType: 'orderBook',
        type:'stockSymbol',
        symbol

    }
    const pubSub = handlePubSubWithTimeout('orderBook', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(orderBookobj))
    const response = await pubSub
    sendResponse(res, response)
    
})


router.post('/reset',async (req,res)=>{
    const obj={
        requestType:"reset"
    }
    const pubSub = handlePubSubWithTimeout('reset', 10000) 
    await client.lPush('taskQueue', getJsonStringifyData(obj))

    const response = await pubSub
    sendResponse(res, response)
})

router.get('/orderbook',async(req,res)=>{
    const orderBookObj = {
        requestType:'orderBook', 
        type: 'orderBook'
    }
    const pubSub = handlePubSubWithTimeout('orderBook', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(orderBookObj))
    const response = await pubSub
    sendResponse(res, response)
})




export default router
