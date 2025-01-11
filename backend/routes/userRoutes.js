const express = require('express');
const router = express.Router();
const {authUser, regUser, logoutUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const {verifyToken} = require('../utils/validateToken');
// const { protect } = require('../middleware/authMiddleware');



router.route('/').post(regUser);
router.route('/auth').post(authUser);
router.route('/logout').post(logoutUser);
router.route('/profile').get(verifyToken, getUserProfile).put(verifyToken, updateUserProfile);

module.exports = router;