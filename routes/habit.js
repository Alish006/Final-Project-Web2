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
        
          <form action="/habit/${habits.id}/edit" method="get">
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


router.get('/habit/:id',  authenticateToken, async (req, res) => {
    try{
        const {id} = req.params;
        const habit = await Habit.findById(id, req.body);
        res.status(200).send(`
        <style>
            body{ background-color: #007bff; justify-self: center; }
            p{font-size: 25px;}
            button{ background:rgb(200, 0, 255); color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
        </style> 

        <div>
          <p>Id:${habit.id}</p>
          <p>Name:${habit.name}</p>
          <p>Description: ${habit.description}</p>
          <p>Weekly Status: ${habit.weeklyStatus ? 'Yes' : 'No'}</</p>
          <form action="/habit" method="get">
          <button type="submit">Get</button>
          </form>
        </div
        `)
    }catch(error){
        res.status(500).json({message: error.message});
    }
    
});

router.get('/habit/:id/edit', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findById(id);

        if (!habit) {
            return res.status(404).send('Habit not found');
        }

        res.send(`
          <h1>Edit Habit</h1>
            <form action="/habit/${habit.id}?_method=PUT" method="POST">
                <label for="title">Name:</label>
                <input type="text" name="name" value="${habit.name}" required /><br><br>

                <label for="description">Description:</label>
                <textarea name="description" rows="5" cols="40" required>${habit.description}</textarea><br><br>

                <label for="author">Weekly Status:</label>
                <input type="checkbox" name="weeklyStatus" value="true" ${habit.weeklyStatus ? 'checked' : ''} /><br><br>

                <button type="submit">Update</button>
            </form> 
        `);
    } catch (error) {
        res.status(500).send('Error retrieving habit');
    }
});

router.put('/habit/:id', authenticateToken, async (req, res) => {
    try{
        const {id} = req.params;
        const { name, description} = req.body;

        const weeklyStatus = req.body.weeklyStatus === "true" ? true : false;

        const habit = await Habit.findByIdAndUpdate(id, { name, description, weeklyStatus}, { new: true });

        if(!habit){
            return res.status(400).json({message: "Habit not found"});
        }

        const updatedHabit = await Habit.findById(id);
        res.status(200).send(`
            <h1>Habit Updated Successfully!</h1>
            <p>Name: ${habit.name}</p>
            <p>Description: ${habit.description}</p>
            <p>Weekly Status: ${habit.weeklyStatus ? 'Yes' : 'No'}</p>
            <br>
            <a href="/habit">Back to Habits</a>
        `)

    }catch(error){
        res.status(500).json({message: error.message});
    }
    
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