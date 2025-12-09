import { User } from "../models/User";
import jwt from 'jsonwebtoken'

export const verifyAuth = async (req,res,next)=>{
    const headers = req.headers['Authorization'] || req.headers['authorization']
    if(!headers){
        return res.status(404).json({
            success : false,
            message : 'Authorization Headers not found'
        })
    }
    const token = headers.split(' ')[1]
    if(!token){
        return res.status(404).json({
            success : false,
            message : 'Token not found'
        })
    }
    try{
        const payload = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        if(!payload || !payload.id){
            return res.status(403).json({
                success : false,
                message : "Invalid or expired refresh Token"
            })
        }
        const user = await User.findOne({_id : payload.id})
        if(!user){
            return res.status(400).json({
                success : false,
                message : "No user found"
            })
        }
        req.user = user
        next()
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({
                success:false,
                message:"Access token expired"
            })
        }
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server error"
        })
    }
}