const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const uiRoutes = require('./routes/authUIRoutes');
dotenv.config();
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', uiRoutes); 
// Routes
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

app.use('/auth', authRoutes);
app.use('/registrations', registrationRoutes);
// DB connect
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
     console.log('✅ Connected to MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
