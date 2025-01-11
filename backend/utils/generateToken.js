const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn: '30d'});

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'developement',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 //this is 30 days in milliseconds. its 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    });
};

module.exports = generateToken;