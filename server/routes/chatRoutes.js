import express from "express";
import {createChat, deleteChat, getChats } from "../controllers/chatController.js";
import { textMessageController } from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";
import gemini from "../configs/gemini.js";

const chatRouter = express.Router();


//different endpoints:
chatRouter.post('/create', protect, createChat);
chatRouter.get('/all', protect, getChats);
chatRouter.delete('/delete/:chatId', protect, deleteChat);
chatRouter.post("/prompt", protect, textMessageController);

//test:
chatRouter.post("/gemini/test", async (req, res) => {
  try {
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say hello",
    });

    res.json({ response: result.text });
  } catch (err) {
    console.error("Gemini test error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default chatRouter;