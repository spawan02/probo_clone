import express from "express"
import { client, subscriber } from "../redis"
import { getJsonStringifyData } from "../config"
const router = express.Router()

router.post('/mint', async(req, res) => {
    const { userId, stockSymbol, quantity } = req.body
    
    const mintObject = {
        requestType:'mint',
        userId,
        stockSymbol,
        quantity
    }
    await client.lPush('taskQueue',getJsonStringifyData(mintObject))
    await subscriber.subscribe('mint', (message)=>{
        res.json(JSON.parse(message))
        subscriber.unsubscribe()
    })
   
    // res.json({
    //     message: `Minted ${quantity} 'yes' and 'no' tokens for ${userId}, remaining balance is ${user.balance}`
    // })
})
export default router
