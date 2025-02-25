const express = require('express');
const router = express.Router();
const User = require('../model/users.js');
const { authenticateToken } = require('../middleware/authenticationVerify.js');
const jwt = require('jsonwebtoken');


router.get('/profile', authenticateToken, async (req, res)=>{
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('profile.ejs', {user: user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/profile/edit', authenticateToken, async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(`
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #87CEFA;
            text-align: center;
            margin: 0;
            padding: 0;
        }

        h1 {
            color: #333;
            margin-top: 20px;
        }

        form {
            background: white;
            max-width: 450px;
            margin: 20px auto;
            padding: 35px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            border: solid 0.5px black;
            text-align: left;
        }

        .input-container {
            margin-bottom: 15px;
        }

        label {
            font-weight: bold;
            color: #555;
            display: block;
            margin-bottom: 5px;
        }

        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 20px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        }

        button:hover {
            background-color: #0560c2;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        </style>
            <h1>Edit Profile</h1>
            <form action="/profile?_method=PUT" method="POST">

            <div class="input-container">
                <label for="username">Username:</label>
                <input type="text" name="username" value="${user.username}" required /><br><br>
            </div>    

            <div class="input-container">        
                <label for="email">Email:</label>
                <input type="text" name="email" value="${user.email}" required /><br><br>
            </div>    

            <div class="checkbox-container">
                <label for="isAdmin">Admin:</label>
                <input type="checkbox" id="isAdmin" name="isAdmin" ${user.isAdmin ? 'checked' : ''}><br><br>

            </div>    
        
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

        const newToken = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", newToken, { httpOnly: true });


        res.status(200).redirect('/profile');


    }catch(error){
        res.status(500).json({message: error.message});
    }

});


module.exports = router;