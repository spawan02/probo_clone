import { getJsonStringifyData } from "./config"
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "./db/order"
import { client } from "./redis"

//to update the orders in orderbook
let priceLevel = {
    total: 0,
    orders:{}
}

export const doOrder = async(data:any)=>{
    const {userId, quantity, actualPrice, stockType, type, stockSymbol} = JSON.parse(data)
    
    const price = actualPrice
    switch(type){
        case "buyOrderOption":
            if(!(userId in INR_BALANCES)){
                // response="user doesn't exist"
                // const responoseObj = {
                //     response: response,
                // }
                return({error:true, msg: "user doesn't exist"})
                // client.publish('order', getJsonStringifyData(responoseObj))
            }else{
                console.log(STOCK_BALANCES[userId][stockSymbol])
                if(!(STOCK_BALANCES[userId][stockSymbol])){
                    // response= "stock doesn't exist"
                    // const responoseObj = {
                    //     // response: response,
                    //     stockSymbol,
                    //     orderbook:ORDERBOOK[stockSymbol]
                    // }
                    // client.publish('order', getJsonStringifyData(responoseObj))
                    return({error: true, msg: "stock doesn't exist"})
                }    
                let stockQuantityBalance:number=0
                const stock = STOCK_BALANCES[userId][stockSymbol]
                //@ts-ignore
                stockQuantityBalance = stock[stockType].quantity
                let UserStockBalance = INR_BALANCES[userId].balance;
                if(!(UserStockBalance>=(100*price)*quantity)){  
                    return({error: true, msg: "Insufficient funds"}) 
                }
                const totalRequiredPrice = (100*price)*quantity
                //lock the user balance
                // if(!ORDERBOOK[stockSymbol][stockType][price]){
                INR_BALANCES[userId]["locked"] = totalRequiredPrice;
                INR_BALANCES[userId]["balance"] -= totalRequiredPrice;
                console.log('here', totalRequiredPrice)
                //@ts-ignore
                const stockOrderBook = ORDERBOOK[stockSymbol];
                
                const reverse=(type:any)=>{
                    if(type==="yes"){
                        return "no"
                    }else{
                        return "yes"
                    }
                }
        
                //to update the balance of the user when order placed
                //@ts-ignore
                const userStockBalanceUpdate=(stock, users)=>{
                    const orderUser = users
                    //@ts-ignore
                    // STOCK_BALANCES[orderUser][stockSymbol][stockType]["locked"] = 0
                    let balance = INR_BALANCES[orderUser]["balance"] 
                    balance -= (100*price*quantity)
                    INR_BALANCES[userId]["balance"] = balance
                    INR_BALANCES[userId]["locked"] = 0
                    // res.json(INR_BALANCES[userId]["balance"])
                }
                //@ts-ignore
                let stockOrderBookPrice = ORDERBOOK[stockSymbol][stockType][price]
                //to get 10-x price for reverse order
                let reversePrice = (10-price).toString()
                // console.log('reverse price', reversePrice)
                //@ts-ignore
                if(!(stockOrderBook[stockType][price])){
                    const reverseStockType = reverse(stockType)
                    //when there are no 'yes' orders to be fulfilled at user price
                    const reverseOrderBook = ORDERBOOK[stockSymbol][reverseStockType]
                    console.log(reverseOrderBook)
                    if(reverseOrderBook[reversePrice]){
                        const existingReverseQuantity = reverseOrderBook[reversePrice]["total"]
                        // res.json(existingReverseQuantity)
                    
                        if(existingReverseQuantity<quantity){
                            ORDERBOOK[stockSymbol][reverseStockType]={
                                ...reverseOrderBook,
                                [reversePrice]:{
                                    total: quantity-existingReverseQuantity,
                                    orders:{
                                        [userId+"probo"]:quantity-existingReverseQuantity
                                    }
                                }
                            }
                            //@ts-ignore
                            STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = existingReverseQuantity 
            
                            INR_BALANCES[userId]["balance"] -= ((100*price)*existingReverseQuantity)
                            // STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = existingReverseQuantity
                            // INR_BALANCES[userId]["balance"] -=(price*existingReverseQuantity)
                            // response ="order is placed"
                            return({error:false, msg: "Order is placed"})
                        }
                        //if the available order is equal to quantity the user stock balance and INR balance is updated 
                        else{
                            //@ts-ignore
                            STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = quantity
                            let balance = INR_BALANCES[userId]["balance"] 
                            balance -= ((Number(reversePrice)*100)*quantity)
                            INR_BALANCES[userId]["balance"] = balance
                            INR_BALANCES[userId]["locked"] = 0   
                            return({error: false, msg: "order is placed and executed"})
                        }
                    
                    }else{
                        ORDERBOOK[stockSymbol][reverseStockType]={
                            ...reverseOrderBook,
                            [reversePrice]:{
                                total: quantity,
                                orders:{
                                    [userId+"probo"]:quantity
                                }
                            }
                        }
                        return({error: false, msg:"order is placed"})
                    }
                }
                else{
                    let totalAvailableOrderQuantity = 0
                    if(stockOrderBookPrice["total"]>=quantity){
                        stockQuantityBalance += quantity
                        UserStockBalance-=price
                        stockOrderBookPrice["total"]-=quantity;
                        const order = stockOrderBookPrice["orders"]
                        //@ts-ignore
                        const ordersOrderBook = stockOrderBook[stockType][price]["orders"]
                        //updating the stock order book balance of users
                        for (const users in ordersOrderBook){
                            //when the orderbook quantity is < quantity 
                            if(!totalAvailableOrderQuantity===quantity){
                                //here we are appending the order of the different users with different quqntity to the user
                                if(stockOrderBookPrice["orders"][users]>=quantity){
                                    if(stockOrderBookPrice["orders"][users]===0){
                                        delete stockOrderBookPrice["orders"][users]
                                    }else{
                                        totalAvailableOrderQuantity+=(stockOrderBookPrice["orders"][users]-quantity);
                                        //update the remaining balance of user
                                        stockOrderBookPrice["orders"][users] = totalAvailableOrderQuantity
                                    }
                                //seller stock get reduced and balance increases 
                                userStockBalanceUpdate(stockOrderBookPrice, users)
                                return({error: false, response:"order is placed and executed"})
                                
                                
                                }  
                                else{
                                    userStockBalanceUpdate(stockOrderBookPrice, users)
                                } 
                            }
                        }                    
                    } else{
                        console.log("inside else of quantity")
                        if(stockOrderBookPrice["total"]>=1){
                            let remainingQuantity=quantity-stockOrderBookPrice["total"]
                            //@ts-ignore 
                            STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"]=stockOrderBookPrice["total"]
                            stockQuantityBalance += stockOrderBookPrice["total"]
                            stockOrderBookPrice["total"]=0;
                            stockOrderBookPrice["orders"]={}
                            const reverseStockType = reverse(stockType)
                            //when there are no 'yes' orders to be fulfilled at user price
                    ORDERBOOK[stockSymbol][reverseStockType]={
                         ...ORDERBOOK[stockSymbol][reverseStockType],
                        [reversePrice]:{
                            total: remainingQuantity,
                            orders:{
                                [userId+"probo"]:remainingQuantity
                            }
                        }
                    }
                    }
        
                    //add the reverse logic here
                }
                priceLevel = {
                    total: 0,
                    orders:{
                        ...priceLevel.orders,
                        userId: quantity
                    }
                }
                
                //@ts-ignore
                // ORDERBOOK[stockSymbol][stockType][price] = priceLevel;
                // //@ts-ignore
                // // const order = ORDERBOOK[stockSymbol][stockType]
                // const totalOrders = Object.values(stockOrderBookPrice["orders"]).reduce((accumulator:number, currentValue:any) => {
                //     return accumulator + currentValue
                // },0)
                // stockOrderBookPrice["total"] = totalOrders
                // res.json(stockOrderBookPrice)
                response = "Buy order placed"
                    const responoseObj = {

                        stockSymbol,
                        orderBook: stockOrderBookPrice
                    }
                    return({error: false, responoseObj})
                // client.publish('order', getJsonStringifyData(responoseObj))
            }
        }
        
        case "sellOrderOption":
            let stockQuantityBalance=0
            //@ts-ignore
            if(!(userId in STOCK_BALANCES) || !(STOCK_BALANCES[userId][stockSymbol])){
                return({error: false, msg: "user or stock doesn't exist"})
            }else{
                // res.json(STOCK_BALANCES)
                const stock = STOCK_BALANCES[userId][stockSymbol]
                //@ts-ignore
                stockQuantityBalance = stock[stockType]["quantity"]
                //@ts-ignore
                const UserStockBalance = stock[stockType]
                const stockQuantity = UserStockBalance["quantity"];
                if(!(stockQuantity>=quantity)){  
                    return({error: true, msg: "Insufficient shares"})
                }else{
                    //@ts-ignore
                    UserStockBalance["quantity"] -= quantity
                    UserStockBalance["locked"] = quantity;
                    priceLevel = {
                        total: 0,
                        orders:{
                            ...priceLevel.orders,
                            [userId]: quantity
                        }
                    }
                    
                    //@ts-ignore
                    let order = ORDERBOOK[stockSymbol][stockType]
                    order = {
                        ...order,
                        [price]:
                            priceLevel
                    }
                    
                    //@ts-ignore
                    ORDERBOOK[stockSymbol][stockType] = order
                    
                    const stockOrderBookPrice= order[price]["orders"]
                    let totalOrders:number = 0;
                    for (const order in stockOrderBookPrice){
                        totalOrders+=stockOrderBookPrice[order]
                    }
                    
                    order[price]["total"] = totalOrders
                    // res.json(ORDERBOOK) 
                }
                //@ts-ignore
                const pubMessage=ORDERBOOK[stockSymbol] 
                // const responseObj = {
                //     stockSymbol,
                //     // response: "Sell order placed and trade pending",
                //     orderBook: pubMessage
                // }   
                return({error: false, msg: pubMessage})
                // client.publish('order', getJsonStringifyData(responseObj))
            }

    }

}


//ORDERBOOK[stockSymbol]