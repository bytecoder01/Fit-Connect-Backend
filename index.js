 import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from "./Routes/UploadRoute.js";
import authRouter from './Routes/AuthRoute.js';
import userRouter from './Routes/UserRoute.js';
import postRouter from './Routes/PostRoute.js';
import ChatRoute from './Routes/ChatRoute.js'
import MessageRoute from './Routes/MessageRoute.js'

dotenv.config();

const app = express();
app.use(express.static('public'))
app.use('/images', express.static('images'))
// Apply CORS middleware before other routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`)))
  .catch((error) => console.log('Database connection error:', error));

// ROUTES
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/upload', uploadRouter);
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
