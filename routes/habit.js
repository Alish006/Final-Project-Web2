const express = require('express');
const router = express.Router();
const Habit = require('../model/habits.js');
const { authenticateToken } = require('../middleware/authenticationVerify.js');


router.get('/habit', authenticateToken, async (req, res)=>{
    try{
        const habit = await Habit.find({userId: req.user.id, isAdmin: req.user.Isadmin});

        let habitHTML = ' ';

        habit.forEach(habits => {
            habitHTML += 
            `
        <div>
          <p>ID: ${habits.id}</p>
          <p>Name: ${habits.name}</p>
          <p>Description:${habits.description}</p>
          <p>WeeklyStatus: ${tasks.weeklyStatus}</p>
        
          <form action="/habit/post" method="get">
               <button type="submit">Edit</button>
          </form>

          <form action="/habit/${habits.id}/edit" method="get">
               <button type="submit">Create</button>
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
            <h1>Habits</h1>
              ${habitHTML}
            `
        );
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/habit/post', authenticateToken, (req, res) => {
    res.send(__dirname + '/index.html');
});




module.exports = router;