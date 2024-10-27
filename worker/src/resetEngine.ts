import { resetInrbalance, resetStockbalance, resetOrderbook } from "./db/order"

export const doReset=()=>{
    resetInrbalance()
    resetStockbalance()
    resetOrderbook()
    const response = 'Reset successfull'
    return({error: false, msg: response})
}