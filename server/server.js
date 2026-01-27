import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'

const allowedOrigins = [
  "https://gpt-project-three.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const app = express()


//connect to database
await connectDB()


//middleware
// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// ✅ SAFE OPTIONS handler (no crash)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});


//routes
app.get('/', (req, res) => res.send('Server is live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)


const PORT = process.env.PORT || 3000


app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)})