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
    try{
        const userId = req.user._id;
        const userName = req.user.name;
        const { chatId, prompt } = req.body;


        console.log(req);


        //check if prompt exists:
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const chat =  await Chat.findOne({userId, _id: chatId,});

        //check if chat exists: 
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        //push and save prompt to messages array to the backend
        chat.messages.push({role: 'user', content: prompt, timestamp: Date.now(), isImage: false, isPublished: false});

        //call Google Gemini API with prompt and get response; save response to backend

        //call Gemini
        const result = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const aiResponse = result.text;

        //push and save AI response to messages array to the backend
        chat.messages.push({role: 'assistant', content: aiResponse, timestamp: Date.now(), isImage: false, isPublished: false});


        //------------IMAGEKIT INTEGRATION FOR IMAGE GENERATION  ----------------//

        // Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //Construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt/${encodedPrompt}/clonegpt/${Date.now()}.png?tr=w-800,h-800`;

        //Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: 'arraybuffer'});

        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        // Upload to ImageKit Media Library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "clonegpt"
        })

        //create a reply and push to array of messages to backend:
        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        }

        res.json({success: true, reply});

        chat.messages.push(reply);


        // 5️⃣ Save chat
        await chat.save();

        // 6️⃣ Return updated chat
        res.status(200).json({
            success: true,
            chat,
        });



    } catch (error) {
        console.error("🔥 FULL ERROR OBJECT:", error);
        console.error("🔥 ERROR MESSAGE:", error?.message);
        console.error("🔥 ERROR STACK:", error?.stack);

    return res.status(500).json({
        success: false,
        error: error?.message || "Unknown error",
    });
  }




}

//Text-based AI chat message controller
/**
 * 1. Get chatId from req.params and message from req.body
 * 2. Find chat by chatId and prompt from req.body
**/
export const imageMessageController = async (req, res) => {
    try{
        const userId = req.user._id;
        const userName = req.user.name;
        const { chatId, prompt, isPublished } = req.body;


        console.log(req);


        //check if prompt exists:
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const chat =  await Chat.findOne({userId, _id: chatId});

        //check if chat exists: 
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        //push and save prompt to messages array to the backend
        chat.messages.push({
            role: 'user', 
            content: prompt, 
            timestamp: Date.now(), 
            isImage: false, 
            isPublished: false});

        //------------IMAGEKIT INTEGRATION FOR IMAGE GENERATION  ----------------//

        // Encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //Construct ImageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/clonegpt/${Date.now()}.png?tr=w-800,h-800`;

        //Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType: 'arraybuffer'});

        // Convert to Base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        // Upload to ImageKit Media Library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "clonegpt"
        })

        //create a reply and push to array of messages to backend:
        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished,
        }

        res.json({success: true, reply});

        chat.messages.push(reply);


        // 5️⃣ Save chat
        await chat.save();

        // 6️⃣ Return updated chat
        res.status(200).json({
            success: true,
            chat,
        });



    } catch (error) {
        console.error("🔥 FULL ERROR OBJECT:", error);
        console.error("🔥 ERROR MESSAGE:", error?.message);
        console.error("🔥 ERROR STACK:", error?.stack);

    return res.status(500).json({
        success: false,
        error: error?.message || "Unknown error",
    });
  }




}


