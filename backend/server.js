require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

// Serve frontend in production
const path = require('path');
const frontendDist = path.join(__dirname, '../frontend/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDist));

  app.use((req, res) =>
    res.sendFile(path.resolve(frontendDist, 'index.html'))
  );
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
