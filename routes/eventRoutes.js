const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.get('/student/register', registrationController.showEvents);

module.exports = router;
