import { createClient } from "redis"

let client:any, subscriber:any
function redisClient(){
    const redis_url = process.env.REDIS_URL || 'redis://localhost:6379'
    client = createClient({url: redis_url})
    subscriber = client.duplicate()
    client.connect()
    subscriber.connect()
    if(client)  console.log("client connected")
        console.log("redis url is ",redis_url)
    return client   
}
if(!client){    
    console.log("inside client",client)
    redisClient()
}
    
export {client,subscriber}