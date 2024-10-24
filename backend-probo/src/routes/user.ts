import express from "express"
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";

const router = express.Router()

router.post("/create/:userId", async (req,res)=>{
    const {userId} = req.params;
    const userObj = {
        type: "createUser", 
        requestType:"user",
        userId,
    }
    await client.lPush('taskQueue', getJsonStringifyData(userObj))
    await subscriber.subscribe('user', (message:any)=>{
        // console.log(message)
        if(message){
            res.status(200).json({
                msg:JSON.parse(message)
            })   
        }
        subscriber.unsubscribe()
    })
    // res.status(201).json({
    //     message: `User ${userId} created`,
    // })
})

export default router