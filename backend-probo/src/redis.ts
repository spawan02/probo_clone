import { createClient } from "redis"

let client:any, subscriber:any
async function redisClient(){
    const redis_url = process.env.REDIS_URL || 'redis://localhost:6379'
    console.log(redis_url)
    client = createClient({url: redis_url})
    subscriber = createClient({url:redis_url})
    await subscriber.connect()
    await client.connect()
    client.on('error', (err:Error) => console.log('Redis Client Error', err));
}
redisClient()
export {client,subscriber}