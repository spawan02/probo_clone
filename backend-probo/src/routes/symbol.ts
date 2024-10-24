import express from "express";
import { client, subscriber } from "../redis";
import { getJsonStringifyData } from "../config";
const router = express.Router()

router.post('/create/:symbol', async (req, res)=>{
    const {symbol}  = req.params;
    // const userId = getUserId()
    const symbolObj = {
        type: 'symbolCreate',
        requestType: 'symbol',
        symbol
    }
    console.log('reached here symbol')

    await client.lPush('taskQueue',getJsonStringifyData(symbolObj))
    await subscriber.subscribe('symbol', (message:any)=>{
        const response =JSON.parse(message)
        // console.log(response)
        res.status(200).json({
            msg: response
        })
        subscriber.unsubscribe()
    })

    // STOCK_BALANCES[userId] = user //assign
    // res.status(200).json({
    //     message: `Symbol ${symbol} created`
    // })
})
export default router