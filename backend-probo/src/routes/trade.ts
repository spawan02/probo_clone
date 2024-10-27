import express from "express"
import { client, subscriber } from "../redis"
import { getJsonStringifyData } from "../config"
import { handlePubSubWithTimeout, sendResponse } from "../utils"
const router = express.Router()

router.post('/mint', async(req, res) => {
    const { userId, stockSymbol, quantity } = req.body
    
    const mintObject = {
        requestType:'mint',
        userId,
        stockSymbol,
        quantity
    }
    const pubSub = handlePubSubWithTimeout('mint', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(mintObject))
    const response = await pubSub
    sendResponse(res, response)
  
})


export default router
