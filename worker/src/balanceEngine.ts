import { INR_BALANCES, STOCK_BALANCES } from "./db/order";

export const doBalance = async(data:any)=>{
    const {type, userId} = JSON.parse(data)
    const user = INR_BALANCES[userId];
    switch (type){
        case "getBalance":
            const response = INR_BALANCES[userId]
            if(!response){
                return{error:true, msg: `User ${userId} not found`}
            }
            return {error: false, msg: response}

        case "getInrBalance":
            const inrResponse = INR_BALANCES
            return {error: false, msg: inrResponse}
        
        case "getStockBalance":
            const stockResponse = STOCK_BALANCES
            return {error: false, msg: stockResponse}
        
        case "getUserStockBalance":
            const userResponse = STOCK_BALANCES[userId]
            if(!userResponse){
                return {error: true, msg: "User not found or no stock balance available"}
            }
            return {error: false, msg: userResponse}
        
    }
}
