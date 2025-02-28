const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee, getUser } = require('../services/firestoreService'); // Import getUser
const {
    authMiddleware,
  } = require('../middleware/authMiddleware');
const { isEmployee, isAdmin } = require('../middleware/roleMiddleware');
const { validate, employeeCreateSchema } = require('../utils/validation');
// GET /api/employees
router.get('/', authMiddleware, isAdmin, async(req, res, next) => {
  try{
    const {page, limit} = req.query;
    const employees = await getAllEmployees(page, limit);
    res.status(200).json(employees);
  }
  catch(error){
    next(error)
  }
})

// GET /api/employees/:id - Get a specific employee
router.get('/:id', authMiddleware, isAdmin, async (req, res, next) => { // Added route
    try {
        const { id } = req.params;
        const employee = await getUser(id); // Reusing getUser from userService
        if (!employee) {
            return next({ status: 404, message: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' });
        }
        if(employee.role !== 'employee') {
            return next({ status: 404, message: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' });
        }
        res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
});

// POST /api/employees
router.post('/', authMiddleware, isAdmin, validate(employeeCreateSchema), async(req, res, next) => {
  try{
    const employeeData = req.body;
    const newEmployee = await createEmployee(employeeData);

    res.status(201).json(newEmployee);
  }
  catch(error){
    next(error)
  }
})

//PUT and DELETE employee same endpoint with user

module.exports = router;