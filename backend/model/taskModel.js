const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    description: {
        type: String,
        required: [true, 'Please provide task description'],
        maxLength: [100, 'Description cannot be more than 100 characters']
    },

    status: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;