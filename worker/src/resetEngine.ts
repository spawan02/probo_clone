import { resetInrbalance, resetStockbalance, resetOrderbook } from "./db/order"
import { client } from "./redis"

export const doReset=async()=>{
    resetInrbalance()
    resetStockbalance()
    resetOrderbook()
    const response = 'Reset successfull'
    await client.publish('reset',JSON.stringify(response))
}