import { INR_BALANCES, STOCK_BALANCES } from "./db/order"

export const doUserCreate = async(data:any)=>{
    const {userId} = JSON.parse(data)

    if(!(INR_BALANCES[userId])){
        INR_BALANCES[userId]={   
        balance:0,
        locked:0   
    }
    STOCK_BALANCES[userId]={}
    return({error: false, msg: `user created successfull`, balance:INR_BALANCES[userId]})
    }else{
        return({error: true, msg: `User ${userId} already exists`})
}
}