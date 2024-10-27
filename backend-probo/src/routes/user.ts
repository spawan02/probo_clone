import express from "express"
import { getJsonStringifyData } from "../config";
import { client, subscriber } from "../redis";
import { handlePubSubWithTimeout, sendResponse } from "../utils";

const router = express.Router()

router.post("/create/:userId", async (req,res)=>{
    const {userId} = req.params;
    const userObj = {
        type: "createUser", 
        requestType:"user",
        userId,
    }

    const pubSub = handlePubSubWithTimeout('user', 5000) 
    await client.lPush('taskQueue', getJsonStringifyData(userObj))
    const response = await pubSub
    sendResponse(res, response)
})

export default router