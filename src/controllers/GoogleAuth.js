import { User } from "../models/User.js";
import { generateAccessToken,generateRefreshToken } from "../utils/generateTokens.js";

export const googleAuth = async (req,res)=>{
    try{
        let findUser = await User.findOne({email : req.user?._json?.email})
        if(!findUser){
            findUser = new User({email : req.user?._json?.email,name : req.user?._json?.name})
            console.log('user saved ')
            await findUser.save()
        }
        const accessToken = generateAccessToken(findUser)
        const refreshToken = generateRefreshToken(findUser)
        findUser.refreshToken.push(refreshToken)
        await findUser.save()
        res.cookie(process.env.COOKIE_NAME, refreshToken, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production',  
            sameSite: 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        res.redirect('http://localhost:5173/home')
    }catch(err){
        console.log(err);
        res.redirect('http://localhost:5173/login')
    }
}