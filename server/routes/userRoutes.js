import express from "express";
import { getUser, loginUser, registerUser, getPublishedImages, setPublishedImage } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";


const userRouter = express.Router();

//different endpoints:
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUser);
userRouter.get('/published-images', getPublishedImages);
userRouter.post('/update-image-status', setPublishedImage);


export default userRouter;