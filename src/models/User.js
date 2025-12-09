import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String
    },
    refreshToken : {
        type : [String],
        default : []
    },
    password_otp : {
        otp :{type : String},
        send_time : {type : Date },
        limit : {type : Number , default : 5 },
        last_attempt : {type : Date}
    },
    role :{
        type : String,
        enum :['User','Admin'],
        default : 'User'
    }
},{timestamps: true})

UserSchema.index({ email: 1 });

export const User = new mongoose.model("User",UserSchema)