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
            body { background-color: #007bff; justify-self: center; }
            h1 { text-align: center; }
            button { background: rgb(200, 0, 255);; color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
            </style>

            <h1>Habits</h1>
              ${habitHTML}

            
            <form action="/habit/post" method="get">
                  <button type="submit">Create</button>
            </form>

            <form action="/profile" method="get">
                  <button type="submit">Go to Profile</button>
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
            <h1>Edit Habit</h1>
            <form action="/habit/${habit.id}?_method=PUT" method="POST">
            
            <div class="input-container">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" value="${habit.name}" required />
            </div>

            <div class="input-container">
               <label for="description">Description:</label>
               <textarea id="description" name="description" rows="5" required>${habit.description}</textarea>
            </div>

            <div class="checkbox-container">
              <label for="weeklyStatus">Weekly Status:</label>
              <input type="checkbox" name="weeklyStatus" value="true" ${habit.weeklyStatus ? 'checked' : ''} />
            </div>
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
            <style>
            body{ background-color: #007bff; justify-self: center; }
            p{font-size: 25px;}
            button{ background:rgb(200, 0, 255); color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
            a {color: black; }
            </style> 
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
        );

    }catch(error){
        res.status(500).json({message: error.message});
    }

});

router.delete('/habit/:id', authenticateToken, async (req, res) => {

    try{
        const {id} = req.params;
        const habit = await Habit.findByIdAndDelete(id); 

        if(!habit){
            return res.status(400).json({message: "Habit not found"});
        }

        res.status(200).send(`
        <style>
            body{ background-color: #007bff; justify-self: center; }
            p{font-size: 25px;}
            button{ background:rgb(200, 0, 255); color: white; border: none; padding: 10px 15px; font-size: 20px; border-radius: 5px; cursor: pointer; }
            a {color: black; }
        </style> 
          <h1>Habit Deleted Successfully!</h1>
          <p>Id: ${habit.id}</p>
          <p>Name: ${habit.name}</p>
          <p>Description: ${habit.description}</p>
          <p>Weekly Status: ${habit.weeklyStatus ? 'Yes' : 'No'}</p>

        <form action="/habit" method="get">
          <button type="submit">Get</button>
        </form>
        `);
    }catch(error){
        res.status(500).json({message: error.message,});
    }
});




module.exports = router;