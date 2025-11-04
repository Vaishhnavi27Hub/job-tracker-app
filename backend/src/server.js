

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');


// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const noteRoutes = require('./routes/noteRoutes');
// const alertRoutes = require('./routes/alertRoutes');
// const profileRoutes = require('./routes/profileRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/notes', noteRoutes);
// app.use('/api/alerts', alertRoutes);
// app.use('/api/profile', profileRoutes);

// // MongoDB Connection - UPDATED (No deprecated options)
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-tracker')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err.message));

// // Basic route
// app.get('/', (req, res) => {
//   res.json({ message: 'Job Tracker API is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const noteRoutes = require('./routes/noteRoutes');
const alertRoutes = require('./routes/alertRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/profile', profileRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-tracker')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // ⚠️ IMPORTANT: Start alert scheduler AFTER MongoDB connects
    try {
      const { startAlertScheduler } = require('./utils/alertScheduler');
      startAlertScheduler();
      console.log('✅ Alert email system initialized');
    } catch (error) {
      console.error('❌ Failed to start alert scheduler:', error.message);
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});