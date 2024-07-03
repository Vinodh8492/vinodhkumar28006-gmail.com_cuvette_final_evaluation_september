const express = require('express');

const userRouter = express.Router();
const { loginUser, registerUser, getUserDetailsById, updateUserDetails, getAllUserDetails, allAddedEmails, getAllEmailDetails } = require('../Controllers/userController')

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/all', getAllUserDetails);
userRouter.get('/details/:userId', getUserDetailsById)
userRouter.put('/update/:userId', updateUserDetails)
userRouter.post('/addemail/:userEmail', allAddedEmails)
userRouter.get('/getemails/:userEmail', getAllEmailDetails)

module.exports = userRouter;