import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import videoroutes from './Routes/video.js'
import userroutes from "./Routes/User.js"
import path from 'path'
import commentroutes from './Routes/comment.js'

// Configure dotenv
dotenv.config()

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false)

const app = express()

app.use(cors())
app.use(express.json({limit:"30mb", extended:true}))
app.use(express.urlencoded({limit:"30mb", extended:true}))
app.use('/uploads', express.static(path.join('uploads')))

app.get('/', (req,res) => {
    res.send("Your tube is working")
})

app.use(bodyParser.json())
app.use('/user', userroutes)
app.use('/video', videoroutes)
app.use('/comment', commentroutes)

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!DB_URL) {
            throw new Error("MongoDB connection URL is not defined in environment variables")
        }
        
        // Add connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        };

        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(DB_URL, options);
        console.log("MongoDB Database connected successfully");
        
        // Only start server after DB connection
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on Port ${PORT}`);
        });
    } catch (error) {
        console.error("Detailed connection error:", {
            name: error.name,
            message: error.message,
            code: error.code
        });
        process.exit(1);
    }
}

connectDB()

