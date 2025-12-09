import express from "express"
import {config} from "dotenv"
import { connectDB } from "./config/connectDB.js";
import {router as authroutes} from './routes/routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import {Strategy as googleStrategy} from 'passport-google-oauth20'
import { googleAuth } from "./controllers/GoogleAuth.js";
config();

const app = express()
const port = process.env.PORT 

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials : true
}))
app.use(passport.initialize())

passport.use(
    new googleStrategy({
        clientID : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL : 'http://localhost:5555/auth/google/callback'
    },
    (accessToken , refreshToken ,profile , done)=>{
        console.log(profile)
        console.log(accessToken)
        done(null,profile)
    }
))

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})
app.get('/auth/google',passport.authenticate('google',{
    scope:['email','profile'],
    prompt : "select_account"
}))

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session : false,failureRedirect: 'http://localhost:5173/login' }),
  googleAuth
)
app.use('/auth',authroutes)

app.get('/',(req,res)=>{
    return res.status(200).json({
        message : "Server is up and working",
        success : true
    })
})

await connectDB()
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})