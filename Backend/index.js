import dotenv from 'dotenv';
dotenv.config()
import connectDb from './config/db.js'
import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chatRoute.js'
const app = express();
app.use(cors())
app.use(express.json())
connectDb()
app.use("/api/chat", chatRoutes);
app.get("/",(req,res)=>{
    res.send("route working")
})

app.listen(3001,()=>{
    console.log('server is running on port 3001')
})