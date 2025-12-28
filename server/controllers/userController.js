import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import Chat from "../models/Chat.js";


// Generate JWT 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

//API to register user
/**
 * 1. Get name, email and password from req.body
 * 2. Check if user already exists
 * 3. If not, create new user
 * 4. Generate JWT token
 * 5. Return token in response
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const userExists = await User.findOne({email})

        if(userExists){
            return res.json({success: false, message: "User already exists!"})

        }

        const user = await User.create({name, email, password})
        const token = generateToken(user._id)

        res.json({success: true, token})

    } catch (error) {
        return res.json({success: false, message: error.message})

    }

}

//API to login user
/**
 * 1. Get email and password from req.body
 * 2. Find user by email
 * 3. If user exists, compare password with hashed password in db
 * 4. If password matches, generate JWT token
 * 
 * @param {} req 
 * @param {*} res 
 * @returns success httl response if user is logged in successfully; if not, then an error message
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch){
                const token = generateToken(user._id);
                return res.json({success: true, token})
            }
        }
        return res.json({ success: false, message: "Invalid email or password" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//API to get user data
/**
 * 1. Get user from req.user (set in authMiddleware)
 * 2. Return user data in response
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns res.json with user data if successful; error message if not
 */
export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ success: true, user })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }


}

//API to update published image status from false to true:
/** 1. Get chatId and imageUrl from req.body
 * 2. Find chat by chatId and message with content=imageUrl and isImage=true
 * 3. Update isPublished to true for that message
 * 4. Return updated chat in response
 * 5. Handle errors
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const setPublishedImage = async (req, res) => {
    try{
        const { chatId } = req.params;
        const { imageUrl } = req.body;

        if (!chatId || !imageUrl){
            return res.status(400).json({ success: false, message: "chatId and imageUrl are required" })
        }

        console.log(`imageUrl: ${imageUrl}, chatId: ${chatId}`)

        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId },
            {
                $set: { "messages.$[img].isPublished": true },
            },
            {
                arrayFilters: [
                {
                    "img.isImage": true,
                    "img.content": imageUrl,
                },
                ],
                new: true,
            }
        );


        //check if updatedChat is null
        if (!updatedChat){
            return res.status(404).json({ success: false, message: "Chat or image message not found" })
        }
        else {
            
            return res.json({
            success: true,
            message: "Image published successfully",
            });
        }

    } catch (error){
        console.error("❌ setPublishedImage error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }



}

//API to get published images:
/**
 * 1. Aggregate Chat collection to find messages with isImage and isPublished set to true
 * 2. Project necessary fields: imageUrl and userName
 * 3. Return images in response
 * 4. Handle errors
 * 
 * @param {*} params 
 * @returns res.json with published images if successful; error message if not
 */
export const getPublishedImages = async (req, res) => {
    try{
        const publishedImageMessages = await Chat.aggregate([
            { $unwind: "$messages" },
            { $match: { 
                "messages.isImage": true, 
                "messages.isPublished": true 
                } 
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName",
                }
            }
        ])

        res.json({success: true, images: publishedImageMessages.reverse()});

    }catch(error){

        return res.json({success: false, message: error.message});



    }


}


