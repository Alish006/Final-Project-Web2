const express = require('express');
const router = express.Router();
const Habit = require('../model/habits.js');
const { authenticateToken } = require('../middleware/authenticationVerify.js');


router.get('/habit', authenticateToken, (req, res)=>{
    res.send('hello');
});



module.exports = router;