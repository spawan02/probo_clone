import express, { json } from "express";
import router from "./routes/index";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({})

const app = express()

app.use(json())
app.use(cors())
app.use('/',router)

app.listen(3000,()=>console.log("Server running in 3000"))