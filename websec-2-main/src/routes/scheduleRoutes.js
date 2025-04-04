const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const path = require('path');

// Route for getting schedule data
// Schedule routes
router.get('/rasp', async (req, res) => {
    try {
        await scheduleController.getSchedule(req, res);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Groups and teachers data route
router.get('/groupsAndTeachers', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../../groupAndTeachers.json'));
    } catch (error) {
        console.error('File read error:', error);
        res.status(500).json({ error: 'Failed to read groups and teachers data' });
    }
});

module.exports = router;
