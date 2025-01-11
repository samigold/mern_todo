const express = require('express');
const router = express.Router();
const {getTasks, createTask, getTask, deleteTask, completeTask, updateTask} = require('../controllers/taskController');
const {verifyToken} = require('../utils/validateToken');

router.route('/').get(verifyToken, getTasks).post(verifyToken, createTask);
router.route('/:id').get(verifyToken, getTask).delete(verifyToken, deleteTask).put(verifyToken, completeTask).patch(verifyToken, updateTask);

module.exports = router;
