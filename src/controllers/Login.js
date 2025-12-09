import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { LoginValidation } from "../utils/Validation.js";
import argon2 from "argon2"

export const login = async(req,res)=>{
    // console.log('Login route hit')
    // console.log(req)
    // console.log(req.body)
    const {error,value} = LoginValidation.validate(req.body);
    if(error){
        // console.log(error.details[0].message)
        return res.status(400).json({
            message : error.details[0].message,
            success : false
        })
    }
    try{
        let user = await User.findOne({email : value.email});
        if(!user){
            return res.status(400).json({
                message : "Incorrect User Name or Password",
                success : true
            })
        }
        const isValid = await argon2.verify(user.password,value.password)
        if(!isValid){
            return res.status(400).json({
                message : "Incorrect User Name or Password",
                success : true
            }) 
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        user.refreshToken.push(refreshToken)
        await user.save();
        res.cookie(process.env.COOKIE_NAME, refreshToken, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        return res.status(200).json({
            message : 'Login successful',
            token : accessToken,
            success : true,
            user:{
                id : user._id,
                name : user.name,
                email : user.email
            }
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : 'Internal Server Error'
        })
    }
}