const express = require('express');
const router = express.Router();
const formsController = require('../controllers/forms.controller');
const { body } = require('express-validator');
const { validateRequest } = require('../middlewares/validate.middleware');

router.post('/',
    [
        body('title').notEmpty().isString(),
        body('description').notEmpty().isString(),
        body('link').notEmpty().isURL(),
        body('logoURL').optional().isURL(),
        validateRequest
    ],
    ...formsController.createForm
);

router.get('/:id', formsController.getForm);
router.get('/', ...formsController.getAllForms);

router.put('/:id',
    [
        body('title').optional().isString(),
        body('description').optional().isString(),
        body('link').optional().isURL(),
        body('logoURL').optional().isURL(),
        validateRequest
    ],
    ...formsController.updateForm
);

router.delete('/:id', ...formsController.deleteForm);

module.exports = router;