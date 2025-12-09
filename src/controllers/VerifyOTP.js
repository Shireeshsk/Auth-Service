import { User } from "../models/User.js";

export const verifyOTP = async (req,res)=>{
    const {email,otp} = req.body
    try{
        // console.log(email)
        // console.log("verify OTP hit")
        const user = await User.findOne({email : email})
        // console.log(user)
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User Not Found"
            })
        }
        if (!user.password_otp || !user.password_otp.otp) {
            return res.status(401).json({
                success: false,
                message: "OTP Not Found",
            });
        }

        const isExpire = user.password_otp.send_time < new Date().getTime()
        if(isExpire){
            return res.status(400).json({
                success : false,
                message : "OTP Expired"
            })
        }

        if (String(otp) !== String(user.password_otp.otp)) {
            console.log('incorrect OTP')
            return res.status(401).json({
                success: false,
                message: "Incorrect OTP",
            });
        }
        console.log('verification successful')
        return res.status(200).json({
            success : true,
            message : "OTP verfication successful"
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}