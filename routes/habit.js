const express = require('express');
const router = express.Router();
const Habit = require('../model/habits.js');
const { authenticateToken } = require('../middleware/authenticationVerify.js');


router.get('/habit', authenticateToken, async (req, res)=>{
    try{
        const habit = await Habit.find({userId: req.user.userId}).sort({ createdAt: -1 });;

        let habitHTML = " ";

        habit.forEach(habits => {
            habitHTML += 
            `
            <style>
            body{ background-color: #007bff; justify-self: center; }
            p{font-size: 25px;}
            button{ background:rgb(200, 0, 255); color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
            </style> 

        <div>
          <p>ID: ${habits.id}</p>
          <p>Name: ${habits.name}</p>
          <p>Description:${habits.description}</p>
          <p>WeeklyStatus: ${habits.weeklyStatus ? 'Yes' : 'No'}</p>
        
          <form action="/habit/post" method="get">
               <button type="submit">Edit</button>
          </form>

           ${req.user.isAdmin ? `
            <form action="/habit/${habits.id}?_method=DELETE" method="post">
                <button type="submit">Delete</button>
            </form>` : ''}

            <form action="/habit/${habits.id}" method="get">
          <button type="submit">Get</button>
           </form>
          <hr>
        </div>
            `
        });

        res.status(200).send(
            `
            <style>
            body{ background-color: #007bff; justify-self: center; }
            h1{ text-align: center; }
            button { background: rgb(200, 0, 255);; color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
            </style>

            <h1>Habits</h1>
              ${habitHTML}
            <form action="/habit/post" method="get">
                  <button type="submit">Create</button>
            </form>
            `
        );
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/habit/post', authenticateToken, (req, res) => {
    res.render('habitPost.ejs');
});


router.post('/habit', authenticateToken, async (req, res) =>{
    try{

        const habitData = {
            name: req.body.name,
            description: req.body.description,
            weeklyStatus: req.body.weeklyStatus || false,
            userId: req.user.userId,
        };
        
        const habit = await Habit.create(habitData);
        
        res.status(200).send(
            `
          <style>
            body{ background-color: #007bff; justify-self: center; }
            h1{ text-align: center; }
            p{font-size: 25px;}
            button { background: rgb(200, 0, 255);; color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
          </style>
          <h1>Habit Created Successfully!</h1>
          <p>Name: ${habit.name}</p>
          <p>Description: ${habit.description}</p>

          <form action="/habit" method="get">
          <button type="submit">Get</button>
           </form>
            `
        )

    }catch(error){
        res.status(500).json({message: error.message});
    }

});




module.exports = router;