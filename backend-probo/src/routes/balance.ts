import express from "express"
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";
import { handlePubSubWithTimeout, sendResponse } from "../utils";
const router = express.Router()

router.get('/inr/:userId', async(req, res)=>{
    const userId = req.params.userId;
    const balanceObj={
        type: "getBalance",
        requestType:"balance",
        userId,
    }
   
    const pubSub = handlePubSubWithTimeout('balance', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(balanceObj))
    const response = await pubSub
    sendResponse(res, response)
})

router.get('/inr', async(req,res)=>{
    const inrBalanceObj = {
        type: "getInrBalance",
        requestType:"balance",
    }
   
    const pubSub = handlePubSubWithTimeout('balance', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(inrBalanceObj))
    const response = await pubSub
    sendResponse(res, response)
})

router.get('/stock',async(req,res)=>{
    const stockBalanceObject = {
        type: "getStockBalance",
        requestType:"balance",
    }
    const pubSub = handlePubSubWithTimeout('balance', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(stockBalanceObject))
    const response = await pubSub
    sendResponse(res, response)

})

router.get('/stock/:userId', async(req, res)=>{
    const {userId} = req.params;
    
    const userStockBalanceObj = {
        type: 'getUserStockBalance',
        requestType:"balance",
        userId
    }
    const pubSub = handlePubSubWithTimeout('balance', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(userStockBalanceObj))
    const response = await pubSub
    sendResponse(res, response)
})

export default router