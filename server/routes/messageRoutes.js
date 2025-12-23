import express from "express";

import { textMessageController, imageMessageController } from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";

const messageRouter = express.Router();


//different endpoints:

messageRouter.post("/text", protect, textMessageController);
messageRouter.post("/image", protect, imageMessageController);

export default messageRouter;