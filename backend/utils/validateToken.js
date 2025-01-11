const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const verifyToken = asyncHandler( async (req, res, next) => {
    // const getCookie = (cookieName) => {
    //     const cookies = document.cookie.split('; ');
    //     for (let cookie of cookies) {
    //         const [key, value] = cookie.split('=');
    //         if (key === cookieName) {
    //             return value
    //         }
    //     }
    //     return null;
    // }

    // token = getCookie(jwt);
    // console.log("This is the token: ", token)
    // try{
    //     const verified = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = verified.user;
    //     next()
    // } catch(err){
    //     res.status(401);
    //     throw new Error("User not authorized. Please login or create account")
    // }

    let token = req.cookies.jwt;

    if (token) {
        console.log("token was found")
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(verified.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error("User not authorized. Please login or create account")
        }
    } else {
        res.status(401);
        console.log("token was not found", process.env.JWT_SECRET)
        throw new Error("User not authorized. No token")
        
    }
});

module.exports = { verifyToken };