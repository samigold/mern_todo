const express = require('express');
const dotenv = require('dotenv');
const app = express();
import path from 'path';
const userRoutes = require('./backend/routes/userRoutes');
const { notFound, errorHandler } = require('./backend/middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const connectDb = require('./backend/config/db');


dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

//Routes
app.use('/api/users', userRoutes);

//Error handling middleware
app.use(notFound);
app.use(errorHandler);

if(process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('*', (res, req)=>res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('Server is being served'))
}

// app.get('/', (req, res) => {
//     res.status(401);
//     res.send('Hello World');
// });

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

