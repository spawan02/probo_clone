// interface UserBalance{
//     balance: number
//     locked: number
// }

// export interface InrBalance{
//     [userId:string]:UserBalance
// }

// interface Order{
//     [userId:string]:number
// }

// interface PriceLevel{
//     total:number
//     orders:Order
// }

// export interface PriceOutcome{
//     [price:string]:PriceLevel
// }

// interface Contract{
//     "yes":PriceOutcome
//     "no":PriceOutcome
// }
// interface OrderBook {
//     [contract:string]:Contract
// }
// export let INR_BALANCES: InrBalance = {
//     "user1": {
//        balance: 10,
//        locked: 0,
//     },
//     "user2": {
//        balance: 20,
//        locked: 10
//     }
//   };

// export let ORDERBOOK:OrderBook = {
//     "BTC_USDT_10_Oct_2024_9_30": {
//              "yes": {
//                  "9.5": {
//                      "total": 12,
//                      "orders": {
//                          "user1": 2,
//                          "user2": 10
//                      },
//                     },
//                  "8.5": {
//                      "total": 12,
//                      "orders": {
//                          "user1": 3,
//                          "user2": 3,
//                          "user3": 6
//                      }
//                  },
//              },
//              "no": {
             
//              }
//     }
//  }
// interface StockPosition {
//     quantity: number 
//     locked:number
// }

// interface StockType {
//     "yes"?: StockPosition
//     "no"?: StockPosition
// }

// interface UserStockBalance{
//     [StockSymbol:string]:StockType
// }

// export interface StockBalance {
//     [userId: string]:UserStockBalance
// }
// export const resetStockBalance = () =>  {
//     console.log('hi')
//     STOCK_BALANCES={}
// }
// export function resetInrBalance(){
//     console.log('reset reached in')
//     // INR_BALANCES={}
// }
// export const resetOrderbook =()=>{
//     ORDERBOOK={}
// }
// export let STOCK_BALANCES:StockBalance = {
// 	user1: {
// 	   "BTC_USDT_10_Oct_2024_9_30": {
// 		   "yes": {
// 			   "quantity": 1,
// 			   "locked": 0
// 		   }, 
//            "no":{
//             "quantity":0,
//             "locked":0
//            }
// 	   }
// 	},
// 	user2: {
// 		"BTC_USDT_10_Oct_2024_9_30": {
// 		   "yes":{
//             "quantity": 3,
//             "locked": 4
//            },
//             "no": {
// 			   "quantity": 3,
// 			   "locked": 4
// 		   }
// 	   }
// 	}
// }

// 1

// import { InrBalance, StockBalance } from "./index";

// interface InrBalance {
//     balance: number;
//     locked: number;
// }

// interface StockOption {
//     quantity: number;
//     locked: number;
// }

// interface StockBalance {
//     "yes"?: StockOption; 
//     "no"?: StockOption;  
// }

// interface individualEntry{
//     quantity: number
// }

// interface orderEntry{
//     total: number,
//     orders: Record<string, individualEntry>;
// }
// interface orderBook {
//     yes: Record<string, orderEntry>
//     no: Record<string, orderEntry>
// }

// export let INR_BALANCES: Record<string, InrBalance> = {};

// export let STOCK_BALANCES: Record<string, Record<string, StockBalance>> = {};

// export let ORDERBOOK: Record<string, orderBook>={}

// export const resetInrbalance = () => {
//     // INR_BALANCES = {}
//     console.log('hi')
// }
// export const resetStockbalance = () => {
//     STOCK_BALANCES = {}
// }

// export const resetOrderbook = ()=>{
//     ORDERBOOK ={}
// }