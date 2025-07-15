const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists' });
    }

    const newUser = new User({
      username,
      password,
      role: role || 'student'
    });

    await newUser.save(); 
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Server error, please try again.' });
  }
};



exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !await user.comparePassword(password)) {
    return res.render('login', { error: 'Invalid credentials' });
  }


  const token = jwt.sign(
    { userId: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, { httpOnly: true }); 
  res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/student/register');
};

