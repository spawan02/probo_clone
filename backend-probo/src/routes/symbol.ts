import express from "express";
import { client, subscriber } from "../redis";
import { getJsonStringifyData } from "../config";
import { handlePubSubWithTimeout, sendResponse } from "../utils";
const router = express.Router()

router.post('/create/:symbol', async (req, res)=>{
    const {symbol}  = req.params;
    const symbolObj = {
        type: 'symbolCreate',
        requestType: 'symbol',
        symbol
    }
  

    const pubSub = handlePubSubWithTimeout('symbol', 4000) 
    await client.lPush('taskQueue', getJsonStringifyData(symbolObj))
    const response = await pubSub
    sendResponse(res, response)
})
export default router