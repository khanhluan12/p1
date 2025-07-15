const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authMiddleware, studentMiddleware } = require('../auth/authMiddleware');

router.post('/register/:eventId', authMiddleware, studentMiddleware, registrationController.registerEvent);

module.exports = router;
