import express from "express";
import userRouter from './user';
import balanceRouter from './balance';
import symbolRouter from './symbol';
import orderRouter from './order';
import tradeRouter from './trade'
import { client, subscriber } from "../redis";
import { getJsonStringifyData } from "../config";
// import { INR_BALANCES, resetInrbalance, resetOrderbook, resetStockbalance, STOCK_BALANCES } from "../db/order";

const router = express.Router()

router.use("/symbol", symbolRouter)
router.use("/user",userRouter)
router.use('/balances', balanceRouter)
router.use('/order', orderRouter)
router.use('/trade', tradeRouter)

router.post('/onramp/inr',async(req,res)=>{
    const {userId, amount}= req.body; 
    const onRampObj = {
        requestType: 'onRamp',
        userId,
        amount
    }

    await client.lPush('taskQueue', getJsonStringifyData(onRampObj))
    await subscriber.subscribe('onRamp', (message)=>{
        res.status(200).json({
            msg:JSON.parse(message)
        })
        subscriber.unsubscribe()
    })
})

router.get('/orderbook/:stockSymbol',async(req,res)=>{
    const symbol = req.params.stockSymbol
    const orderBookobj ={
        requestType: 'orderBook',
        type:'stockSymbol',
        symbol

    }
    await client.lPush('taskQueue', getJsonStringifyData(orderBookobj))
    await subscriber.subscribe('orderBook',(message)=>{
        res.status(200).json({
            msg:JSON.parse(message)
        })
        subscriber.unsubscribe()
    })
})


router.post('/reset',async (req,res)=>{
    const obj={
        requestType:"reset"
    }
    try{
    await client.lPush('taskQueue',getJsonStringifyData(obj)) 
    await subscriber.subscribe('reset',(message)=>{
        res.status(200).json(JSON.parse(message))
        subscriber.unsubscribe()
    })
        
    }catch(e){
        console.log(e)
    }
})

router.get('/orderbook',async(req,res)=>{
    const orderBookObj = {
        requestType:'orderBook', 
        type: 'orderBook'
    }
    await client.lPush('taskQueue', getJsonStringifyData(orderBookObj))
    await subscriber.subscribe('orderBook',(message)=>{
        res.json(JSON.parse(message))
        subscriber.unsubscribe()
    })
})


// add the pub sub timeout  
// export function handlePubSubWithTimeout(channel:string,timeoutMs:Number,):Promise<any>{
//     return new Promise((resolve, reject)=>{
//         const timeOut =  setTimeout(()=>{
//             subscriber.unsubscribe(channel); 
//             reject(new Error("Response timed out"));
//           }, timeoutMs);
//         subscriber.subscribe(channel, (data) => {
//             clearTimeout(timeOut); 
//             subscriber.unsubscribe(channel); 
//             resolve(data); 
//           });
//     })
// }
export default router
