import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

const accessSecret = process.env.ACCESS_SECRET
const refreshSecret = process.env.REFRESH_SECRET
export const generateAccessToken = (user)=>{
    const payload = {
        id : user._id,
        email : user.email
    }
    const accessToken = jwt.sign(payload,accessSecret,{expiresIn:'15m'})
    // console.log(accessSecret)
    return accessToken
}

export const generateRefreshToken = (user)=>{
    const refreshToken = jwt.sign({id:user._id},refreshSecret,{expiresIn:'7d'});
    // console.log(refreshSecret)
    return refreshToken
}