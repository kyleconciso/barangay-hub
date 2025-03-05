// src/routes/pages.routes.js
const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pages.controller');
const { validateRequest } = require('../middlewares/validate.middleware');
const { body, param } = require('express-validator');

router.post('/',
    [
        body('slug').notEmpty().isString(),
        body('title').notEmpty().isString(),
        body('content').notEmpty().isString(),
        validateRequest
    ],
    pagesController.createPage[1] 
);

router.get('/:slug', pagesController.getPage);

router.get('/', pagesController.getAllPages[0]);

router.put('/:slug',
    [
        body('title').optional().isString(),
        body('content').optional().isString(),
        validateRequest
    ],
    pagesController.updatePage[1]
);

router.delete('/:slug', pagesController.deletePage[1]);

module.exports = router;