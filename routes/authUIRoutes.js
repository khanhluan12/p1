const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const registrationController = require('../controllers/registrationController'); 
const { authMiddleware, adminMiddleware } = require('../auth/authMiddleware');


router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get('/student/register', registrationController.showEvents);
router.get('/admin/dashboard', authMiddleware, adminMiddleware, registrationController.listAllRegistrations);
module.exports = router;
