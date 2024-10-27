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
                return({error:true, msg: "user doesn't exist"})
            }else{
                console.log(STOCK_BALANCES[userId][stockSymbol])
                // if(!(STOCK_BALANCES[userId][stockSymbol])){
                //     return({error: true, msg: "stock doesn't exist"})
                // }    
                if (!STOCK_BALANCES[userId][stockSymbol]) {
                    STOCK_BALANCES[userId][stockSymbol] = {
                      yes: { quantity: 0, locked: 0 },
                      no: { quantity: 0, locked: 0 },
                    };
                  }
                if (quantity<0) break;
                let stockQuantityBalance:number=0
                const stock = STOCK_BALANCES[userId][stockSymbol]
                //@ts-ignore
                stockQuantityBalance = stock[stockType].quantity
                let UserStockBalance = INR_BALANCES[userId].balance;
                if(!(UserStockBalance>=(100*price)*quantity)){  
                    return({error: true, msg: "Insufficient funds"}) 
                }
                const totalRequiredPrice = (100*price)*quantity
                INR_BALANCES[userId]["balance"] -= totalRequiredPrice;
                INR_BALANCES[userId]['locked'] +=totalRequiredPrice;
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
                // const userStockBalanceUpdate=(stock, user)=>{
                //     const orderUser = user
                //     //@ts-ignore
                //     // STOCK_BALANCES[orderUser][stockSymbol][stockType]["locked"] = 0
                //     let balance = INR_BALANCES[orderUser]["balance"] 
                //     balance -= (100*price*quantity)
                //     INR_BALANCES[userId]["balance"] = balance
                //     INR_BALANCES[userId]["locked"] = 0
                //     // res.json(INR_BALANCES[userId]["balance"])
                // }
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
                                        [userId]:{
                                            quantity: quantity-existingReverseQuantity,
                                            type: 'reverted'   
                                        }
                                        }
                                }
                            }
                            //@ts-ignore
                            STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = existingReverseQuantity 
            
                            // INR_BALANCES[userId]["balance"] -= ((100*price)*existingReverseQuantity)
                            INR_BALANCES[userId].locked -= existingReverseQuantity * 100 * price;    

                            // STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = existingReverseQuantity
                            // INR_BALANCES[userId]["balance"] -=(price*existingReverseQuantity)
                            return({error:false, msg: ORDERBOOK[stockSymbol]})
                        }
                        //if the available order is equal to quantity the user stock balance and INR balance is updated 
                        else{
                            let tempQuantity = quantity
                            //@ts-ignore
                            const ordersOrderBook = stockOrderBook[stockType][price]["orders"]
                            for (const user in ordersOrderBook){
                                const available = stockOrderBookPrice.orders[user].quantity
                                const toTake = Math.min(available, tempQuantity);
                                stockOrderBookPrice.orders[user].quantity -= toTake;
                                stockOrderBookPrice.total -= toTake;
                                tempQuantity-=toTake;
                                //@ts-ignore
                                STOCK_BALANCES[userId][stockSymbol][stockType]["quantity"] = quantity
                                if (stockOrderBookPrice.orders[user].quantity === 0) {
                                    delete stockOrderBookPrice.orders[user];
                                }
                                if (stockOrderBookPrice.total === 0) {
                                    //@ts-ignore
                                delete stockOrderBook[stockType][price].total;
                                }
                            }
                            
                            let balance = INR_BALANCES[userId]["balance"] 
                            balance -= ((Number(reversePrice)*100)*quantity)
                            INR_BALANCES[userId]["balance"] = balance
                            INR_BALANCES[userId]["locked"] = 0   
                            return({error: false, msg: ORDERBOOK[stockSymbol]})
                        }
                    
                    }else{
                        ORDERBOOK[stockSymbol][reverseStockType]={
                            ...reverseOrderBook,
                            [reversePrice]:{
                                total: quantity,
                                orders:{
                                    [userId]:{
                                        'quantity': quantity,
                                        type: 'reverted'
                                    }
                                }
                            }
                        }
                        return({error: false, msg:ORDERBOOK[stockSymbol]})
                    }
                }
                else{
                    let tempQuantity = quantity
                    if(stockOrderBookPrice["total"]>=quantity){
                        stockQuantityBalance += quantity
                        console.log(stockQuantityBalance)
                        UserStockBalance-=price
                        // stockOrderBookPrice["total"]-=quantity;
                        // const order = stockOrderBookPrice["orders"]

                        //@ts-ignore
                        const ordersOrderBook = stockOrderBook[stockType][price]["orders"]
                        for (const user in ordersOrderBook){
                            //@ts-ignore
                            const available = ORDERBOOK[stockSymbol][stockType][price].orders[user].quantity
                            const toTake = Math.min(available, quantity);
                            //@ts-ignore
                            ORDERBOOK[stockSymbol][stockType][price].orders[user].quantity -= toTake;
                            //@ts-ignore
                            ORDERBOOK[stockSymbol][stockType][price].total -= toTake;
                            tempQuantity-=toTake;
                        //updating the user orderbook balance 
                            if(ordersOrderBook[user].type==="sell"){
                                //@ts-ignore
                                    STOCK_BALANCES[user][stockType][stockType][locked]-= toTake;
                                    INR_BALANCES[user].balance += toTake * 100 * price;
                                    INR_BALANCES[userId].locked -= toTake * 100 * price;    

                                }else if (ordersOrderBook[user].type == "reverted") {
                                    //   @ts-ignore
                                    stock[stockType][quantity] += toTake;
                                    INR_BALANCES[userId].locked -= toTake * 100 * price;    
                                    // console.log(
                                    //   "stock balance of yes ",
                                    //   STOCK_BALANCES[user][stockSymbol].yes.quantity
                                    // );
                                // userStockBalanceUpdate(stockOrderBookPrice, user)

                            // when the orderbook quantity is < quantity 
                            // if(!totalAvailableOrderQuantity===quantity){
                            //     //here we are appending the order of the different users with different quantity to the user
                            //     if(stockOrderBookPrice["orders"][users][quantity]>=quantity){
                            //         if(stockOrderBookPrice["orders"][users][quantity]===0){
                            //             delete stockOrderBookPrice["orders"][users]
                            //         }else{
                            //             totalAvailableOrderQuantity+=(stockOrderBookPrice["orders"][users][quantity]-quantity);
                            //             //update the remaining balance of user
                            //             stockOrderBookPrice["orders"][users] = totalAvailableOrderQuantity
                            //         }
                            //     //seller stock get reduced and balance increases 
                            //     userStockBalanceUpdate(stockOrderBookPrice, users)
                            //     return({error: false, response:"order is placed and executed"})
                            //     }  
                            //     else{
                            //     } 
                            }
                            if (stockOrderBookPrice.orders[user].quantity === 0) {
                                delete stockOrderBookPrice.orders[user];
                            }
                            if (stockOrderBookPrice.total === 0) {
                                //@ts-ignore
                            delete stockOrderBook[stockType][price].total;
                            }

                        }                    
                    } else{
                        console.log("inside else of quantity")
                        // if(stockOrderBookPrice["total"]>=1){
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
                                [userId]:{
                                    quantity: remainingQuantity,
                                    type: "reverted"
                                }
                            }
                        }
                    }
                    // }
                    //add the reverse logic here
                }
                // priceLevel = {
                //     total: 0,
                //     orders:{
                //         ...priceLevel.orders,
                //         userId: quantity
                //     }
                // }
                
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
                    return({error: true, msg: "Insufficient stocks"})
                }else{
                    //@ts-ignore
                    UserStockBalance["quantity"] -= quantity;
                    UserStockBalance["locked"] = quantity;
                    priceLevel = {
                        total: 0,
                        orders:{
                            ...priceLevel.orders,
                            [userId]: {
                                'quantity':quantity,
                                type:'sell'
                            }
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
                    let totalOrders = 0;
                    for (const order in stockOrderBookPrice){
                        totalOrders+=stockOrderBookPrice[order].quantity
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