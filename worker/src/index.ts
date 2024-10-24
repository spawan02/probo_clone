import { doBalance } from "./balanceEngine"
import express from "express"
import { subscriber } from "./redis"
import { doUserCreate } from "./userEngine"
import { doSymbolCreate } from "./symbolEngine"
import { doMint } from "./mintEngine"
import { doOnRamp } from "./onRampEngine"
import { doOrder } from "./orderEngine"
import { doReset } from "./resetEngine"
import { getOrderbook } from "./orderBookEngine"

const app = express()
app.listen(3001)

const processTask = async(data:any)=>{
    const {requestType} = JSON.parse(data)
    // console.log('code reached here', data)
    switch(requestType){
        case "balance": doBalance(data)  
        break;
        case "user": doUserCreate(data)
        break;
        case "symbol": doSymbolCreate(data)
        break;
        case "mint": doMint(data)
        break;
        case "onRamp": doOnRamp(data)
        break;
        case "order": doOrder(data)
        break;
        case "reset": doReset()
        break;
        case "orderBook": getOrderbook(data)
        break;
    }
    // const data = subscriber.brPop('balance',0)
    
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