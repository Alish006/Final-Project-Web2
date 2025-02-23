const express = require('express');
const router = express.Router();
const User = require('../model/users.js');
const { authenticateToken } = require('../middleware/authenticationVerify.js');


router.get('/profile', authenticateToken, (req, res)=>{
    res.render('profile.ejs');
});


router.get('/profile/edit', authenticateToken, async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(`
            <h1>Edit Profile</h1>
            <form action="/profile?_method=PUT" method="POST">
                <label for="username">Username:</label>
                <input type="text" name="username" value="${user.username}" required /><br><br>
        
                <label for="email">Email:</label>
                <input type="text" name="email" value="${user.email}" required /><br><br>
        
                <label for="isAdmin">Admin:</label>
                <input type="checkbox" id="isAdmin" name="isAdmin" ${user.isAdmin ? 'checked' : ''}><br><br>
        
                <button type="submit">Update Profile</button>
            </form>
        `);        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/profile', authenticateToken, async (req, res)=>{
    try{
        const userId = req.user.userId;
        const {username, email} = req.body;
        let {isAdmin} = req.body;

        isAdmin = isAdmin === "on";
        
        const user = await User.findByIdAndUpdate(userId, { username, email, isAdmin}, { new: true });

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        res.status(200).redirect('/profile');


    }catch(error){
        res.status(500).json({message: error.message});
    }

});


module.exports = router;