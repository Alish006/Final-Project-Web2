const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/users.js');
const bcrypt = require("bcryptjs");

router.post('/register',  async (req, res)=> {
    const { username, email, password } = req.body;

    try {
        if (!email || !password) {
           req.flash('error', 'Email and Password are required');
           return res.status(400).redirect('/register');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.status(400).redirect('/register');
            
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            id: Date.now().toString(),
            username: username,
            email: email,
            password: hashedPassword,
        });

        user.save();

        res.status(200).redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error);
        res.redirect('/register');
    }

});


router.get('/register', (req, res)=> {
    res.render('register.ejs');
});


router.post('/login',  async (req, res)=> {
    const {email, password} = req.body; 

    const user = await User.findOne({email});

    if (!user || !(await bcrypt.compare(password, user.password))) {
        req.flash('error', 'Invalid password');
        return res.status(400).redirect('/login');
    }
    else if(!user || email != user.email){
        req.flash('error', 'User does not exist with this email');
        return res.status(400).redirect('/login');
    }

    const accessToken = jwt.sign({userId: user.id, isAdmin: user.isAdmin}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.isAdmin = user.isAdmin;

    res.cookie('token', accessToken, { httpOnly: true});

    res.status(200).redirect('/profile');


});


router.delete('/logout', (req, res)=> {
    try{
    res.cookie('token', ' ', {maxAge: 1});
    res.status(200).redirect('/login');
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


router.get('/login',  (req, res)=>{
    res.render('login.ejs');
});


module.exports = router;
