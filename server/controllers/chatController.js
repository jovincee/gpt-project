import Chat from "../models/Chat.js";


//API controller for creating a new chat
/**
 * 1. Get userId from req.user (set in authMiddleware)
 * 2. Create object with fields, chatData
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createChat = async (req, res) => {
    try{
        const userId = req.user._id;


        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name,

        }

        await Chat.create(chatData)
        res.json({success: true, message: "Chat created"})

    } catch(error){
        return res.json({success: false, message: error.message})
    }



}

//API controller for getting all chats
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getChats = async (req, res) => {
    try{
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({createdAt: -1})
        


        return res.json({success: true, chats})

    } catch (error){
        return res.json({success: false, message: error.message})
    }

}

//API controller for deleting a chat
export const deleteChat = async (req, res) =>  {
    try{
        const {chatId} = req.params;
        const userId = req.user._id;
        
        await Chat.deleteOne({ _id: chatId, userId})
        
        return res.json({success: true, message: "Chat deleted"})


    } catch (error){
        return res.json({success: false, message: error.message})


    }

}