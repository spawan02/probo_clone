import { doBalance } from "./balanceEngine"
import express from "express"
import { client, subscriber } from "./redis"
import { doUserCreate } from "./userEngine"
import { doSymbolCreate } from "./symbolEngine"
import { doMint } from "./mintEngine"
import { doOnRamp } from "./onRampEngine"
import { doOrder } from "./orderEngine"
import { doReset } from "./resetEngine"
import { getOrderbook } from "./orderBookEngine"
import { getJsonStringifyData } from "./config"

const app = express()
app.listen(3001)
const processTask = async(data:any)=>{
    let processedData;
    const {requestType} = JSON.parse(data)
    switch(requestType){
        case "balance": 
            processedData = await doBalance(data)
            client.publish('balance', getJsonStringifyData(processedData))
        break;
        case "user":
            processedData =  await doUserCreate(data)
            client.publish('user', getJsonStringifyData(processedData))
        break;
        case "symbol": 
            processedData = doSymbolCreate(data)
            client.publish('symbol', getJsonStringifyData(processedData))
        break;
        case "mint": 
            processedData = doMint(data)
            client.publish('mint', getJsonStringifyData(processedData))
        break;
        case "onRamp": 
            processedData = doOnRamp(data)
            client.publish('onRamp', getJsonStringifyData(processedData))
        break;
        case "order": 
            processedData = await doOrder(data) 
            client.publish('order', getJsonStringifyData(processedData))

        break;
        case "reset": 
            processedData= doReset()
            client.publish('reset', getJsonStringifyData(processedData))
        break;
        case "orderBook": 
            processedData = await getOrderbook(data)
            client.publish('orderBook', getJsonStringifyData(processedData))
        break;
    }
    
}

const worker = async()=>{
    while(true){
        try{
            const data = await subscriber.brPop('taskQueue',0)
            
            console.log(data)
            if(data){
                await processTask(data?.element)
            }
        }catch(e){
            console.error(e)
        }
    }

}
worker()