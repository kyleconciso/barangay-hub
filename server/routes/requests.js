const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
} = require('../services/firestoreService');
const {
  authMiddleware,
  roleMiddleware: { isEmployee, isAdmin },
} = require('../middleware/authMiddleware');
const {
  validate,
  requestCreateSchema,
  requestUpdateSchema,
} = require('../utils/validation');



// GET /api/requests - get all requests
router.get('/', async (req, res, next) => {
  try {
    const requests = await getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
});

// GET /api/requests/:id
router.get('/:id', async(req, res, next) => {
  try{
    const { id } = req.params;
    const request = await getRequest(id);
    if(!request){
      return next({status: 404, message: "Request not found", code: "REQUEST_NOT_FOUND"})
    }
    res.status(200).json(request);
  }
  catch(error){
    next(error);
  }
})

// POST /api/requests - create new request (Employee/Admin)
router.post(
  '/',
  authMiddleware,
  isEmployee,
  validate(requestCreateSchema),
  async (req, res, next) => {
    try {
      const requestData = req.body;
      const newRequest = await createRequest(requestData);
      res.status(201).json(newRequest);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/requests/:id - update request (Employee/Admin)
router.put(
  '/:id',
  authMiddleware,
  isEmployee,
  validate(requestUpdateSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const requestData = req.body;
      const updatedRequest = await updateRequest(id, requestData);
      res.status(200).json(updatedRequest);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/requests/:id - del request (Employee/Admin)
router.delete('/:id', authMiddleware, isEmployee, async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteRequest(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;