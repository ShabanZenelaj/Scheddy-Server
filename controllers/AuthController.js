import User from "../models/UserModel.js";
import {createSecretToken} from "../utils/SecretToken.js";
import bcrypt from "bcrypt";

const Signup = async (req, res, next) => {
    try {
        const { name, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ name, password, username, createdAt });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            sameSite: "none",
            secure: true
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
    }
};

const Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
            return res.status(406).json({message:'All fields are required'})
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.status(404).json({message:'Incorrect password or username' })
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.status(404).json({message:'Incorrect password or username' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            sameSite: "none",
            secure: true
        });
        res.status(201).json({ message: "User logged in successfully", success: true });
        next()
    } catch (error) {
        console.error(error);
    }
}

export {Signup, Login};