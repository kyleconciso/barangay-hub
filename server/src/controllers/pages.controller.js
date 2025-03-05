const { createPage, getPageBySlug, getAllPages, updatePage, deletePage } = require('../models/page.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { roleCheck } = require('../middlewares/role.middleware');

exports.createPage = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { slug, title, content } = req.body;
            const createdBy = req.user.uid;

            if (!slug || !title || !content) {
                throw new AppError('Missing required fields', 400);
            }

            const newPage = {
                slug,
                title,
                content,
                createdAt: new Date(),
                createdBy,
                updatedAt: new Date(),
                updatedBy: createdBy,
            };
            const pageId = await createPage(newPage);
            return formatResponse(res, 201, { id: pageId }, 'Page created successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.getAllPages = [ // no roleCheck here anymore
    async (req, res, next) => {
        try {
            const pages = await getAllPages();
            return formatResponse(res, 200, { pages }, 'Pages retrieved successfully');
        } catch (error) {
            next(error);
        }
    }];

exports.getPage = [
    async (req, res, next) => {
        try {
            const { slug } = req.params;
            const page = await getPageBySlug(slug);
            if (!page) {
                throw new AppError('Page not found', 404);
            }
            return formatResponse(res, 200, { page }, 'Page retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
];


exports.updatePage = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { slug } = req.params;
            const { title, content } = req.body;
            const updatedBy = req.user.uid;

            // Check if page exists
            const existingPage = await getPageBySlug(slug);
            if (!existingPage) {
                throw new AppError('Page not found', 404);
            }


            const updatedPage = {
                title,
                content,
                updatedAt: new Date(),
                updatedBy,
            };

            await updatePage(existingPage.id, updatedPage);
            return formatResponse(res, 200, null, 'Page updated successfully');
        } catch (error) {
            next(error);
        }
    }
];

exports.deletePage = [
    roleCheck(['EMPLOYEE', 'ADMIN']),
    async (req, res, next) => {
        try {
            const { slug } = req.params;

            // Check if page exists
            const existingPage = await getPageBySlug(slug);
            if (!existingPage) {
                throw new AppError('Page not found', 404);
            }

            await deletePage(existingPage.id);
            return formatResponse(res, 200, null, 'Page deleted successfully');
        } catch (error) {
            next(error);
        }
    }
];