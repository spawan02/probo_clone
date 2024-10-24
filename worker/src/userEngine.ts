import { INR_BALANCES, STOCK_BALANCES } from "./db/order"
import { client } from "./redis"

export const doUserCreate = async(data:any)=>{
    const {userId} = JSON.parse(data)

    let message; 
    if(!(INR_BALANCES[userId])){
        INR_BALANCES[userId]={   
        balance:0,
        locked:0
    }
    message = INR_BALANCES[userId]
}else{
    message="user already exist"
}
STOCK_BALANCES[userId]={}
    await client.publish('user', JSON.stringify(message))
}

