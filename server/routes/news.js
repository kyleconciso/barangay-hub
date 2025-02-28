const express = require('express');
const router = express.Router();
const { getAllNews, getNewsBySlug, createNews, updateNews, deleteNews } = require('../services/firestoreService');
const { authMiddleware, roleMiddleware: { isEmployee, isAdmin } } = require('../middleware/authMiddleware');
const { validate, newsCreateSchema, newsUpdateSchema } = require('../utils/validation');

// GET /api/news - get all news
router.get('/', async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const newsResult = await getAllNews(page, limit);
        res.status(200).json(newsResult);
    } catch (error) {
        next(error);
    }
});

// GET /api/news/:slug - get specific news article by slug
router.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;
        const news = await getNewsBySlug(slug);
        if (!news) {
            return next({ status: 404, message: 'News article not found', code: 'NEWS_NOT_FOUND' });
        }
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
});

// POST /api/news - create new news article (Employee/Admin)
router.post('/', authMiddleware, isEmployee, validate(newsCreateSchema), async (req, res, next) => {
    try {
        const newsData = req.body;
        const authorId = req.user.id; //  authMiddleware
        const newNews = await createNews(newsData, authorId);
        res.status(201).json(newNews);
    } catch (error) {
        next(error);
    }
});

// PUT /api/news/:slug - update news article (Employee/Admin)
router.put('/:slug', authMiddleware, isEmployee, validate(newsUpdateSchema), async (req, res, next) => {
    try {
        const { slug } = req.params;
        const newsData = req.body;
        const updatedNews = await updateNews(slug, newsData);
        res.status(200).json(updatedNews);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/news/:slug - delete news article (Employee/Admin)
router.delete('/:slug', authMiddleware, isEmployee, async (req, res, next) => {
    try {
        const { slug } = req.params;
        await deleteNews(slug);
        res.status(204).send(); // No content
    } catch (error) {
        next(error);
    }
});

module.exports = router;