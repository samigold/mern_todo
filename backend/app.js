const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');


dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

connectDb();

app.use(cors({ origin: "http://localhost:3000", credentials: true, methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], }));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes)

//Error handling middleware
app.use(notFound);
app.use(errorHandler);


// app.get('/', (req, res) => {
//     res.status(401);
//     res.send('Hello World');
// });

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

