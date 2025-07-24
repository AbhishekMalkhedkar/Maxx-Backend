import User from "../model/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { genToken } from "../config/token.js";

export const registration = async (req,res) => {
    try{

        const {name, email, password} = req.body;
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({ message : "User already exist"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({ message : "Enter Valid Email"});
        }
        
        if(password.length < 6){
            return res.status(400).json({ message : "Enter Strong  Password"});
            
        }

        const hashPassword = await bcrypt.hash(password, 10 );

        const user = await User.create({ name, email, password : hashPassword});

        const token = genToken(user._id);
        res.cookie("token", token,{
            httpOnly : true,
            secure : false,
            sameSite : "Strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json(user)

    }catch(error){
        console.log("SignUp Error");
        return res.status(500).json({ message : `SignUp Error ${error}`})
        
    }
}

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        console.log(user);
        
        if(!user){
            return res.status(404).json({ message : "User Not Found!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message : "Incorrect Password!"});
        }

        const token = genToken(user._id);
        res.cookie("token", token,{
            httpOnly : true,
            secure : false,
            sameSite : "Strict",
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({message : "Login successful"});


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : `Login Error ${error}`})
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message : "Logout Successful"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : `Logout Error ${error}`})
    }
}