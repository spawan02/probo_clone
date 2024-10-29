import express, { json } from "express";
import router from "./routes/index";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({})

const app = express()

app.use(json())
app.use(cors())
app.use('/',router)
app.get("/get",(req,res)=>{
    res.json({mes:'this is get'})
})
app.listen(3000)