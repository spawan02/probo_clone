import {WebSocket, WebSocketServer} from "ws";
import express from "express";
import { createClient } from "redis";
import { subscriber } from "./redis";
import dotenv from "dotenv"
dotenv.config({})

const app = express();
const client = createClient()
let userSubsciptions:Map<string, Set<WebSocket>>= new Map()
client.connect()
const httpServer = app.listen(8080)
const wss = new WebSocketServer({server: httpServer})
wss.on('connection',(ws)=>{
    ws.on("error",console.error)
    ws.on("message",(message)=>{ 
           handleMessage(message,ws)
    })
    ws.on("close", () => {
        console.log("Client disconnected");
        for (const stockSymbol of userSubsciptions.keys()) {
          const listener = userSubsciptions.get(stockSymbol);
          if (listener) {
            client.unsubscribe(`orderbook.${stockSymbol}`);
          }
        }
        userSubsciptions.clear();
      });
    });

//@ts-ignore
let response:any

const handleMessage = async(message:any,ws:WebSocket)=>{
    try{
        const decodeMessage = message.toString()
        const { type, stockSymbol } = JSON.parse(decodeMessage);
        if(type === 'subscribe'){
            if(!userSubsciptions.has(stockSymbol)){
                userSubsciptions.set(stockSymbol,new Set <WebSocket>([ws]))
                // console.log(userSubsciptions)
            }else{
                userSubsciptions.get(stockSymbol)?.add(ws)
            }
        }
        if(type==="unsubscribe"){
            await client.unsubscribe(`orderbook.${stockSymbol}`);
        }
        await subscriber.subscribe('order',(message:string)=>{
            response = JSON.parse(message)

            userSubsciptions.get(stockSymbol)!.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                const data = {
                    event: 'event_orderbook_update',
                    message: response
                }
                // console.log("this is a websocket",message);
                client.send(JSON.stringify(data))
                }
            });  
        }
    )
        
    }catch(error){
        console.error(error)
    }
}

