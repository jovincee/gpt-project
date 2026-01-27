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


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//middleware
// Middleware
// app.use(cors({
//   origin: [
//     "https://gpt-project-three.vercel.app",
//     "https://gpt-project-gsvjr27w-jovincees-projects.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],

// }));


app.use(cors());



//routes
app.get('/', (req, res) => res.send('Server is live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)


const PORT = process.env.PORT || 3000


app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)})