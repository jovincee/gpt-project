import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * create a schema for user with name, email, password and credits fields
 */
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    credits: {type: Number, default: 20},


})

//hash password before saving to db
userSchema.pre('save', async function () {
    if (!this.isModified('password')){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})


const User = mongoose.model('User', userSchema);

export default User;