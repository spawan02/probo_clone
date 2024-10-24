import { INR_BALANCES } from "./db/order";
import { client } from "./redis";

export const doOnRamp =(data:any)=>{
    const {userId, amount} = JSON.parse(data)
    const user = INR_BALANCES[userId];
    let message
    if(user){
        user.balance+=amount;
        message= `Onramped ${userId} with amount ${amount}`
        client.publish('onRamp', JSON.stringify(message))
    }
    else{
        message= `user with id ${userId} doesn't exist`
        client.publish('onRamp', JSON.stringify(message))
    }   
}