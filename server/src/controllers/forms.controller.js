const { createForm, getFormById, getAllForms, updateForm, deleteForm } = require('../models/form.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');

exports.createForm = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { title, description, link, logoURL } = req.body;
            const createdBy = req.user.uid;

            if (!title || !description || !link) {
                throw new AppError('Missing required fields', 400);
            }

            const newForm = {
                title,
                description,
                link,
                logoURL,
                createdAt: new Date(),
                createdBy,
                updatedAt: new Date(),
                updatedBy: createdBy,
            };
            const formId = await createForm(newForm);
            return formatResponse(res, 201, { id: formId }, 'Form created successfully');
        } catch (error) {
            next(error);
        }
    }
];


exports.getForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const form = await getFormById(id);
        if (!form) {
            throw new AppError('Form not found', 404);
        }
        return formatResponse(res, 200, { form }, 'Form retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getAllForms = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const forms = await getAllForms();
            return formatResponse(res, 200, { forms }, 'Forms retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.updateForm = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description, link, logoURL } = req.body;
            const updatedBy = req.user.uid;

             // Check if form exists
            const existingForm = await getFormById(id);
            if (!existingForm) {
                throw new AppError('Form not found', 404);
            }


            const updatedForm = {
                title,
                description,
                link,
                logoURL,
                updatedAt: new Date(),
                updatedBy,
            };

            await updateForm(existingForm.id, updatedForm);
            return formatResponse(res, 200, null, 'Form updated successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.deleteForm = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { id } = req.params;

            // Check if form exists
            const existingForm = await getFormById(id);

            if (!existingForm) {
                throw new AppError('Form not found', 404);
            }

            await deleteForm(existingForm.id);
            return formatResponse(res, 200, null, 'Form deleted successfully');
        } catch (error) {
            next(error);
        }
    }
];