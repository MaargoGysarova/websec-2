const PORT = process.env.PORT || 5500;
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const server = http.Server(app);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const scheduleRoutes = require('./src/routes/scheduleRoutes');

// API Routes first
app.use('/api', scheduleRoutes);

// Then static files
app.use(express.static(path.join(__dirname, 'src/public')));

// HTML route last
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});