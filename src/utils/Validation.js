import Joi from "joi";

export const RegisterValidation = Joi.object({
    name: Joi.string().min(3).max(20).required(),

    email: Joi.string()
        .email()
        .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
        .message("Email must be lowercase only and valid format")
        .required(),

    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$!%&]).{6,}$/)
        .message(
            "Password must be of length>=6 characters, contain 1 uppercase, 1 number, and 1 special char @#$!%&"
        )
        .required()
});
    
export const LoginValidation = Joi.object({
    email: Joi.string()
        .email()
        .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
        .message("Email must be lowercase only and valid format")
        .required(),

    password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$!%&]).{6,}$/)
        .message(
            "Password must be of length>=6 characters, contain 1 uppercase, 1 number, and 1 special char @#$!%&"
        )
        .required()
})
