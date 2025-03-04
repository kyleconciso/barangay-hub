
// import Joi from 'joi';

// // --- authentication ---
// export const registerSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({'any.only': 'Passwords must match'}),
//     displayName: Joi.string().required(),
//     phone: Joi.string().optional()
// });

// export const loginSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required()
// });