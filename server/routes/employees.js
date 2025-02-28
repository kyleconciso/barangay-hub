const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee } = require('../services/firestoreService');
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