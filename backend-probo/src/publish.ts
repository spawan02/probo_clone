import { createClient } from "redis";

const client = createClient()

export const publishMessage=(mes:any)=>{
    const mesJson = JSON.stringify(mes)
    client.publish("message", mesJson);
    console.log("message published")
}