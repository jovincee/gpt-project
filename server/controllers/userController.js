import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from 'jsonwebtoken'


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

//API to get published images:
/**
 * 1. Aggregate Chat collection to find messages with isImage and isPublished set to true
 * 2. Project necessary fields: imageUrl and userName
 * 3. Return images in responseq
 * 4. Handle errors
 * 
 * @param {*} params 
 * @returns res.json with published images if successful; error message if not
 */
export const getPublishedImages = async (params) => {
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


