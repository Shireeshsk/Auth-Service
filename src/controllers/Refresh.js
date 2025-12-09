import jwt from "jsonwebtoken"
import { User } from "../models/User.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js"

export const refresh = async (req,res)=>{
    const refreshT = req.cookies?.[process.env.COOKIE_NAME];
    if(!refreshT){
        return res.status(400).json({
            success : false,
            message : 'No refresh Token'
        })
    }
    try{
        const payload = jwt.verify(refreshT,process.env.REFRESH_SECRET)
        if(!payload || !payload.id){
            return res.status(404).json({
                success : false,
                message : "Invalid or expired refresh Token"
            })
        }
        const user = await User.findById(payload.id)
        if(!user){
            return res.status(400).json({
                success : true,
                message : "User not found"
            })
        }
        const idx = user.refreshToken.indexOf(refreshT)
        if(idx==-1){
            return res.status(400).json({
                success : false,
                message: 'Refresh Token not recognised'
            })
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        res.cookie(process.env.COOKIE_NAME, refreshToken, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        user.refreshToken[idx] = refreshToken
        await user.save()
        return res.status(200).json({
            success : true,
            token : accessToken
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}