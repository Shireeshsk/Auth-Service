import { User } from '../models/User.js'
import { RegisterValidation } from '../utils/Validation.js'
import argon2 from 'argon2'
import { generateAccessToken,generateRefreshToken } from '../utils/generateTokens.js'

export const register = async (req,res)=>{ 
    const {error,value} = RegisterValidation.validate(req.body);
    if(error){
        return res.status(400).json({
            message : error.details[0].message,
            success : false
        })
    }
    try{
        let user = await User.findOne({email:value.email})
        if(user){
            return res.status(400).json({
                message : 'User Already Exists',
                success : false
            })
        }
        const hashedPassword = await argon2.hash(value.password)
        user = new User({
            name : value.name,
            email : value.email,
            password : hashedPassword
        })
        user = await user.save()
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
            message : 'Registration successful',
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