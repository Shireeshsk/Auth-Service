import express from 'express'
import { register } from '../controllers/Register.js'
import { login } from '../controllers/Login.js'
import { refresh } from '../controllers/Refresh.js'
import { Logout } from '../controllers/Logout.js'
import { forgetPassword } from '../controllers/ForgotPassword.js'
import { verifyOTP } from '../controllers/VerifyOTP.js'
import { changePassword } from '../controllers/ChangePassword.js'

export const router = express.Router()
router.post('/register',register)
router.post('/login',login)
router.get('/refresh',refresh)
router.get('/logout',Logout)
router.post('/forgot-password',forgetPassword)
router.post('/verify-otp',verifyOTP)
router.post('/change-password',changePassword)