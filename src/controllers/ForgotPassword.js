import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendMail.js";
export const forgetPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email : email})
        if(!user){
            return res.status(403).json({
                success : false,
                message : "User Not Found"
            })
        }
        const userOtp = user.password_otp?.otp
        if(userOtp){
            const timeDiff = (Date.now() - user.password_otp.last_attempt.getTime()) <= 24*60*60*1000;
            if(!timeDiff){
                user.password_otp.limit = 5
                await user.save()
            }

            const remainLimit = user.password_otp.limit === 0
            if(timeDiff && remainLimit){
                return res.status(400).json({
                    success : false,
                    message : "Daily Limit Reached"
                })
            }

        }
        const otp = Math.floor(Math.random()*90000)+100000
        user.password_otp.otp = otp
        user.password_otp.limit--
        user.password_otp.last_attempt = new Date()
        user.password_otp.send_time = new Date(Date.now() + 2*60*1000)
        const data = {
            email : email,
            otp : otp
        }
        const result = await sendEmail(data)
        // console.log(result)
        await user.save()

        return res.status(200).json({
            success : true,
            message : `OTP sent at ${email}`,
            otp : user.password_otp.otp
        })

    }catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}