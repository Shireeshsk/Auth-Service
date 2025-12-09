import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const Logout = async (req , res)=>{
    const token = req.cookies[process.env.CCOKIE_NAME]
    if(!token){
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    }
    try{
        const payload = jwt.verify(token,process.env.REFRESH_SECRET)
        const user = await User.findOne({_id : payload.id})
        if(!user){
            res.clearCookie(process.env.COOKIE_NAME, {
                httpOnly: true,      
                secure: process.env.NODE_ENV === 'production',  
                sameSite: 'strict',  
                // maxAge: 7 * 24 * 60 * 60 * 1000 
            })
            return res.status(200).json({
                success : true,
                message : "Logout Succesful"
            })
        }
        const idx = user.refreshToken.indexOf(token)
        if(idx==-1){
            return res.status(200).json({
                success : true,
                message : 'Logout successful'
            })
        }
        delete user.refreshToken[idx]
        await user.save()
        res.clearCookie(process.env.COOKIE_NAME, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict',  
        })
        return res.status(200).json({
            success : true,
            message : 'Logout Successful'
        })
    }
    catch(err){
        console.error(err)
        return res.status(200).json({
            success : true,
            message : "Logout Successful"
        })
    }
}