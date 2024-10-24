import express from "express"
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";
const router = express.Router()

router.get('/inr/:userId', async(req, res)=>{
    const userId = req.params.userId;
    const balanceObj={
        type: "getBalance",
        requestType:"balance",
        userId,
        
    }
   
    await client.lPush('taskQueue', getJsonStringifyData(balanceObj))
    await subscriber.subscribe('balance',(message)=>{
        res.status(200).json({
            msg:JSON.parse(message)
        })
        subscriber.unsubscribe()
    })
    //first push in queue
})

router.get('/inr', async(req,res)=>{
    const inrBalanceObj = {
        type: "getInrBalance",
        requestType:"balance",
    }
    // res.json('ji')
    await client.lPush('taskQueue', getJsonStringifyData(inrBalanceObj))
    // res.status(200).json(INR_BALANCES)
    await subscriber.subscribe('balance',(message)=>{
        if(message){
            res.status(200).json({
                msg:JSON.parse(message)
            })
            subscriber.unsubscribe()
        }
    })
})

router.get('/stock',async(req,res)=>{
    const stockBalanceObject = {
        type: "getStockBalance",
        requestType:"balance",
    }
    await client.lPush('taskQueue', getJsonStringifyData(stockBalanceObject))
    await subscriber.subscribe('balance',(message)=>{
        if(message) {
            res.status(200).json({msg:JSON.parse(message)})
            subscriber.unsubscribe()
        }
    })
    // res.status(200).json(STOCK_BALANCES)
})

router.get('/stock/:userId', async(req, res)=>{
    const {userId} = req.params;
    
    const userStockBalanceObj = {
        type: 'getUserStockBalance',
        requestType:"balance",
        userId
    }
    await client.lPush('taskQueue', getJsonStringifyData(userStockBalanceObj))
    await subscriber.subscribe('balance',(message)=>{
        res.status(200).json({msg:JSON.parse(message)})
        subscriber.unsubscribe()
    })
    // res.json({
    //     stock: stockBalance
    // })
})



export default router