const Joi = require('joi');

// for validating schema

// --- Authentication ---
const authRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    displayName: Joi.string().required(),
    phone: Joi.string().optional()
});
const authLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

// --- Pages ---
const pageCreateSchema = Joi.object({
    slug: Joi.string().required(),
    content: Joi.string().required(),
    lastUpdatedBy: Joi.string().required()
});

const pageUpdateSchema = Joi.object({
    content: Joi.string().required(),
    lastUpdatedBy: Joi.string().required()
});

// --- News ---
const newsCreateSchema = Joi.object({
    slug: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
});

const newsUpdateSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string()
});

// --- Requests ---
const requestCreateSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().uri().required(),
    logoURL: Joi.string().uri().required()
});

const requestUpdateSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    link: Joi.string().uri(),
    logoURL: Joi.string().uri()
});

// --- Tickets ---
const ticketCreateSchema = Joi.object({
    category: Joi.string().valid('complaint', 'suggestion', 'inquiry', 'other').required(),
    subject: Joi.string().required(),
    body: Joi.string().required()
});

const ticketUpdateSchema = Joi.object({
    status: Joi.string().valid('open', 'in-progress', 'closed'),
    assignedTo: Joi.string().allow(null)
});

const ticketAddMessageSchema = Joi.object({
    content: Joi.string().required()
});

// --- Users ---
const userUpdateSchema = Joi.object({
    displayName: Joi.string(),
    phone: Joi.string()
});

// --- Site Settings ---
const siteSettingsUpdateSchema = Joi.object({
    siteName: Joi.string(),
    location: Joi.string(),
    telephone: Joi.string()
});

const employeeCreateSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    displayName: Joi.string().required(),
    phone: Joi.string().optional()
})

// --- Validate Function ---
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next({ status: 400, message: error.details[0].message, code: 'VALIDATION_ERROR' });
        }
        next();
    };
};

module.exports = {
    validate,
    authRegisterSchema,
    authLoginSchema,
    pageCreateSchema,
    pageUpdateSchema,
    newsCreateSchema,
    newsUpdateSchema,
    requestCreateSchema,
    requestUpdateSchema,
    ticketCreateSchema,
    ticketUpdateSchema,
    ticketAddMessageSchema,
    userUpdateSchema,
    siteSettingsUpdateSchema,
    employeeCreateSchema
};