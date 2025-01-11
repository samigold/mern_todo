const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const generateToken = require('../utils/generateToken');

//@desc     AUth user/set token
//route     POST /api/users/auth
//Access    Public
const authUser = asyncHandler (async (req, res) => {
    //Destructure the request body
    const { email, password } = req.body;
    //Validate the request body
    if(!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    //Find the user
    const user = await User.findOne({ email });
    //Check if the user exists and confrims password match
    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

//@desc     Register a new User
//route     POST /api/users/register
//Access    Public
const regUser = asyncHandler (async (req, res) => {

   //Destructure the request body
   const { name, email, password } = req.body; 

   //user exists check
   const userExists = await User.findOne({ email });
   if(userExists) {
         res.status(400);
         throw new Error('User already exists');
   }

    //Create a new user
    const user = await User.create({
        name,
        email,
        password
    });

    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})


//@desc     Logout User
//route     POST /api/users/logout
//Access    Private
const logoutUser = asyncHandler (async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        message: 'User logged out successfully',
    });
})

//@desc     Get User profile
//route     GET /api/users/profile
//Access    Private
const getUserProfile = asyncHandler (async (req, res) => {
    //const user = await User.findById(req.user._id);

    res.status(200).json(req.user);

    // res.status(200).json({
    //     message: 'Get user profile'
    // });
})

//@desc     Update User profile
//route     PUT /api/users/profile
//Access    Private
const updateUserProfile = asyncHandler (async (req, res) => {

    const user = await User.findById(req.user._id);
    if(user) {
        // user.name = req.body.name || user.name;
        // user.email = req.body.email || user.email;

        // if (req.body.password) {
        //     user.password = req.body.password
        // }
        const {name, email, password } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;

        if(password){
            user.password = password;
        }
        const updatedUser = await user.save(); 

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    } else {
        res.status(404);
        throw new Error('User not found');
    }

    // const { name, email , password } = req.body;
    // const user = await User.findById(req.user._id);
    // if (user) {
    //     user.name = name;
    //     user.email = email;
        
    // }

})
module.exports = {
    authUser,
    regUser,
    logoutUser,
    getUserProfile,
    updateUserProfile }