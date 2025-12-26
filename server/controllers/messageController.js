import Chat from "../models/Chat.js";
import gemini from "../configs/gemini.js";
import imagekit from "../configs/imagekit.js";
import axios from "axios";


//Text-based AI chat message controller
/**
 * 1. Get chatId from req.params and message from req.body
 * 2. Find chat by chatId and prompt from req.body
**/
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 1️⃣ Save user message
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      isPublished: false,
    };

    chat.messages.push(userMessage);

    // 2️⃣ Call Gemini
    const result = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiMessage = {
      role: "assistant",
      content: result.text,
      timestamp: Date.now(),
      isImage: false,
      isPublished: false,
    };

    chat.messages.push(aiMessage);

    // 3️⃣ Save chat
    await chat.save();

    // 4️⃣ Respond ONCE
    return res.status(200).json({
      success: true,
      reply: aiMessage,
    });

  } catch (error) {
    console.error("🔥 TEXT MESSAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate text response",
    });
  }
};
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt, isPublished } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("IMAGEKIT_URL_ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
      isPublished: false,
    });

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/clonegpt/${Date.now()}.png?tr=w-800,h-800`;

    let imageResponse;
    try {
      imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    } catch (err) {
      console.error("❌ ImageKit fetch error:", err.response?.status);
      throw new Error("Image generation failed");
    }

    const base64Image = `data:image/png;base64,${Buffer.from(
      imageResponse.data
    ).toString("base64")}`;

    let upload;
    try {
      upload = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "clonegpt",
      });
    } catch (err) {
      console.error("❌ ImageKit upload error:", err);
      throw new Error("Image upload failed");
    }

    const reply = {
      role: "assistant",
      content: upload.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    chat.messages.push(reply);
    await chat.save();

    return res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error("🔥 FINAL IMAGE CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
