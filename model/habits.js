const mongoose = require('mongoose');

const HabitSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: false,
    },

    weeklyStatus: {
        type: Boolean,
        required: false,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

},

    {
        timestamps: true
    }

);

const Habit = mongoose.model('Habit', HabitSchema);

module.exports = Habit;