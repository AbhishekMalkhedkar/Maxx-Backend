import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
dotenv.config();
import cors from 'cors';


let port = process.env.PORT || 6000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173/",
    credentials : true
}));

app.use("/api/auth", authRoutes)

app.get("/" , (req,res) => {
    res.send("Hello from Server")
})


app.listen(port, () => {
    console.log("Server started at : ", port);
    connectDb();
})