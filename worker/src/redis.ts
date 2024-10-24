import { createClient } from "redis"

const client = createClient()
const subscriber = client.duplicate()
client.connect()
subscriber.connect()

export {client,subscriber}