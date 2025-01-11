const asyncHandler = require('express-async-handler');
const Task = require('../model/taskModel')

//@desc     Get all tasks
//route     GET /api/tasks
//Acess     Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({user_id: req.user.id}).select('description status');
    if (tasks.length === 0) {
        res.status(404);
        throw new Error('There is no task here');
    }
    res.status(200).json(tasks);

    console.log(req.user.id);
})

//@desc     Create new task
//route     POST /api/tasks  
//Acess     Private
const createTask = asyncHandler(async (req, res) => {
    const {description} = req.body;
    if (!description) {
        res.status(400);
        throw new Error('Description is required');
    }

    const task = Task.create({
        description,
        status: false,
        user_id: req.user.id
    })
    
    res.status(201).json({
        message: 'Task created successfully'
    });
});

//@desc     Get task by id
//route     GET /api/tasks/:id
//Acess     Private
const getTask = asyncHandler( async (req, res) =>{
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if(task.user_id.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('You are not authorized to view this task');
    }

    res.status(200).json(task);
})

//@desc    Complete task
//route    PUT  /api/tasks/:id
//Access   Private
const completeTask = asyncHandler(async (req, res) =>{
    const task = await Task.findById(req.params.id);
    if(!task){
        res.status(404);
        throw new error("Task not found");
    }
    if(task.status === false){
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {status: true}, {new: true});
    res.status(200).json({
        message: "Task completed",
        task: updatedTask,
    });
} else {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, {status: false}, {new: true});
    res.status(200).json({
        message: "Task not completed",
        task: updatedTask,
    });
}
});

//@desc    Update task description
//route    PATCH /api/tasks/:id
//Access   Private
const updateTask = asyncHandler(async (req, res) => {
    const { description } = req.body;

    // Validate input
    if (!description || description.trim() === "") {
        res.status(400);
        throw new Error("Description cannot be empty");
    }

    // Find the task
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    // Update the description
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { description: description.trim() },
        { new: true }
    );

    res.status(200).json({
        message: "Task description updated successfully",
        task: updatedTask,
    });
});




//@desc    Delete task
//route    DELETE /api/tasks/:id
//Acess    Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
        res.status(404);
        throw new Error('Task not found');
    }

    res.status(200).json({
        message: 'Task deleted successfully'
    });
})
module.exports = {getTasks, createTask, getTask, deleteTask, completeTask, updateTask};