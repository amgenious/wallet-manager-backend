import express from 'express'
import dotenv from "dotenv"
import { initDB } from './config/db.js'
import rateLimiter from './middleware/rateLimiter.js'
import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js"
dotenv.config()

const app = express()
app.use(express.json())
app.use(rateLimiter)
const PORT = process.env.PORT || 5001

if(process.env.NODE_ENV==="production") job.start()

app.get("/api/health",(req,res)=>{
    res.status(200).json({status:"Ok"})
})
app.use("/api/transactions", transactionsRoute)

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server online on http://localhost:${PORT}`)
})
})