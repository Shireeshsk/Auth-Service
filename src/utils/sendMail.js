import nodemailer from 'nodemailer'
import {config} from 'dotenv'
config()
export const sendEmail = async (data)=>{
    try {
        const transport = nodemailer.createTransport({
            service : 'Gmail',
            auth : {
                user : 'shireeshpoosa.dev@gmail.com',
                pass : process.env.APP_PASSWORD
            }
        })

        const mailOptions = {
            from : "shireeshpoosa.dev@gmail.com",
            to : data.email ,
            subject : 'password OTP',
            html: `<p>Your OTP for password reset is: <b>${data.otp}</b></p>`,
        }
        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        console.error(error)
    }
}