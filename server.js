const express = require('express');  
const mongoose = require('mongoose'); 
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");

require('dotenv').config();

const authenticationRoutes = require('./routes/authentication.js');
const habitRoutes = require('./routes/habit.js');
const profileRoutes = require('./routes/profile.js')
const app = express(); 


// MongoDB connection 

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then (() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connection to MongoDB:', error);
});


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SECRET_KEY_SESSISON,
    resave: false,
    saveUninitialized: true,
}));

app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.email = req.session.email;
    res.locals.isAdmin = req.session.isAdmin;
    next();
});


app.get('/', (req, res)=>{
    res.render('register.ejs');
});

app.use(flash());
app.use('/', authenticationRoutes);
app.use('/', habitRoutes);
app.use('/', profileRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});













