const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const Task = require('../model/taskModel');
const User = require('../model/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let token;
let userId;
let taskId;

beforeAll(async () => {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create a test user
    const user = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
    });

    userId = user._id;

    // Generate a token for the test user
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Create a test task
    const task = await Task.create({
        description: 'Test Task',
        status: false,
        user_id: user._id,
    });

    taskId = task._id;
});

afterAll(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
});

describe('Task Routes', () => {
    it('should get all tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('description', 'Test Task');
    });

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'New Task',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Task created successfully');
    });

    it('should get a task by ID', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('description', 'Test Task');
    });

    it('should update a task description', async () => {
        const res = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Updated Task Description',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task description updated successfully');
        expect(res.body.task).toHaveProperty('description', 'Updated Task Description');
    });

    it('should complete a task', async () => {
        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task completed');
        expect(res.body.task).toHaveProperty('status', true);
    });

    it('should delete a task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });
});