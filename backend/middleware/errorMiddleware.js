const dotenv = require('dotenv');
dotenv.config();

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next)=>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; //If the status code is 200, then set the status code to 500, else set it to the status code
    let message = err.message;

    if(err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    //the CastError is a mongoose error that occurs when the id is not a valid id

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack //If the environment is production, then set the stack to null, else set it to the error stack
    })
}

module.exports = {notFound, errorHandler}