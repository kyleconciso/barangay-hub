const express = require('express');
const router = express.Router();
const { getPage, createPage, updatePage, deletePage } = require('../services/firestoreService');
const { authMiddleware } = require('../middleware/authMiddleware'); 
const { isEmployee, isAdmin } = require('../middleware/roleMiddleware');
const { validate, pageCreateSchema, pageUpdateSchema } = require('../utils/validation');

// GET /api/pages/:slug - get specific page via slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = await getPage(slug);
    if (!page) {
      return next({ status: 404, message: 'Page not found', code: 'PAGE_NOT_FOUND' });
    }
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
});

// POST /api/pages - create new page (Employee/Admin)
router.post('/', authMiddleware, isEmployee, validate(pageCreateSchema), async (req, res, next) => {
  try {
    const pageData = req.body;
    pageData.lastUpdatedBy = req.user.id;
    const newPage = await createPage(pageData);
    res.status(201).json(newPage);
  } catch (error) {
    next(error);
  }
});

// PUT /api/pages/:slug - update page (Employee/Admin)
router.put('/:slug', authMiddleware, isEmployee, validate(pageUpdateSchema), async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pageData = req.body;
    pageData.lastUpdatedBy = req.user.id;
    const updatedPage = await updatePage(slug, pageData);
    res.status(200).json(updatedPage);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/pages/:slug - delete page (Employee/Admin)
router.delete('/:slug', authMiddleware, isEmployee, async (req, res, next) => {
  try {
    const { slug } = req.params;
    await deletePage(slug);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;