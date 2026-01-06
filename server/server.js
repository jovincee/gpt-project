import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'



const app = express()


//connect to database
await connectDB()


//middleware
// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://gpt-project-three.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//routes
app.get('/', (req, res) => res.send('Server is live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

const PORT = process.env.PORT || 3000


app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)})