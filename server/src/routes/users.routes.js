const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middlewares/validate.middleware');

router.get('/:id', usersController.getUser[0]);
router.get('/', usersController.getAllUsers[0]);
router.get('/type/resident', usersController.getResidents[0]);
router.put('/:id',
    [
        body('firstName').optional().isString(),
        body('lastName').optional().isString(),
        body('phone').optional().isString(),
        body('address').optional().isString(),
        body('type').optional().isIn(['RESIDENT', 'EMPLOYEE', 'ADMIN']),
        validateRequest
    ]
    , usersController.updateUser[0]);
router.delete('/:id', usersController.deleteUser[0]);

module.exports = router;