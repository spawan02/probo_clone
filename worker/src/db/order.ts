interface UserBalance{
    balance: number
    locked: number
}

export interface InrBalance{
    [userId:string]:UserBalance
}
interface individualEntry{
    quantity: number, 
    type: 'sell' | 'reverted'
    
}
interface Order{
    [userId:string]: individualEntry;
}

interface PriceLevel{
    total:number
    orders:Order
}

export interface PriceOutcome{
    [price:string]:PriceLevel
}

interface Contract{
    "yes":PriceOutcome
    "no":PriceOutcome
}
interface OrderBook {
    [contract:string]:Contract
}
export let INR_BALANCES: InrBalance = {};

export let ORDERBOOK:OrderBook = {
    "BTC_USDT_10_Oct_2024_9_30": {
			"yes": {
				"9.5": {
					"total": 20,
					orders: {
						"user1": {
                            quantity: 10,
                            type:'sell'
                        },
						"user2": {
                            'quantity':10,
                            type: 'sell'
                        }
					}
				},
				"8.5": {
					"total": 10,
					"orders": {
						"user1": {
                            'quantity':10,
                            type:'sell'
                        }
					}
				},
			},
			"no": {
			
			}
   }
}
interface StockPosition {
    quantity: number 
    locked:number
}

interface StockType {
    "yes"?: StockPosition
    "no"?: StockPosition
}

interface UserStockBalance{
    [StockSymbol:string]:StockType
}

export interface StockBalance {
    [userId: string]:UserStockBalance
}

export const resetStockbalance = () =>  {
    // console.log('hi')
    STOCK_BALANCES={}
}
export function resetInrbalance(){
    // console.log('reset reached in')
    INR_BALANCES={}
}
export const resetOrderbook =()=>{
    ORDERBOOK={}
}
export let STOCK_BALANCES:StockBalance = {}

1
