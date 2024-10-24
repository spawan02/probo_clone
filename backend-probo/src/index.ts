import express, { json } from "express";
import router from "./routes/index";
import cors from "cors"

const app = express()

app.use(json())
app.use(cors())
app.use('/',router)

app.listen(3000)