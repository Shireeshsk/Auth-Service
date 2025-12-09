import {User} from '../models/User.js'
import argon2 from 'argon2'
import {config} from 'dotenv'
config()

export const changePassword = async (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(401).json({
            success : false,
            message : "Enter valid credentials"
        })
    }
    try{
        const findUser = await User.findOne({email}) 
        if(!findUser){
            return res.status(401).json({
                success : false,
                message : 'User Not Found'
            })
        }
        // const hashedPassword = await bcrypt.hash(password,Number(process.env.SALT))
        const hashedPassword = await argon2.hash(value.password)
        findUser.password = hashedPassword
        await findUser.save()
        return res.status(200).json({
            success : true,
            message : "Password Changed Successfully"
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : 'Internal Server Error'
        })
    }
}