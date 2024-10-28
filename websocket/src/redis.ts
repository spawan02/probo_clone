import { createClient } from "redis"
const redis_url = process.env.REDIS_URL || 'redis://localhost:6379'
const client = createClient({url: redis_url})
const subscriber = client.duplicate()
client.connect()
subscriber.connect()

export {client,subscriber}