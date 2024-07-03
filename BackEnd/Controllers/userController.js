const express = require('express');
const User = require('../Model/User')
const Email = require('../Model/Email')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res, next) => {
    try {
        const { name, password, email, confirmpassword } = req.body;
        if (!name || !password || !email || !confirmpassword) {
            return res.json({
                message: "Fill all the fields"
            })
        }

        if (password !== confirmpassword) {
            return res.json({
                message: "Passwords do not match"
            });
        }

        const emailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;
        if (!emailRegex.test(email)) {
            return res.json({
                message: "Invalid email format. Only @gmail.com emails are allowed."
            });
        }

        const isExistingUser = await User.findOne({ email: email })
        if (isExistingUser) {
            return res
                .json({ message: "user already exists, try another Email" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new User({
            name,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword
        })

        await userData.save();
        res.json({ message: "user registered successfully" })

    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                message: "Fill all the fields"
            })
        }
        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res
                .json({
                    message: "Invalid Credentials"
                })
        }

        const passwordMatch = await bcrypt.compare(password, userDetails.password)

        if (!passwordMatch) {
            return res
                .json({
                    message: "Invalid Password"
                })
        }

        const token = jwt.sign({ userId: userDetails._id }, 'vinodh');


        res.json({ message: "User logged in successfully", name: userDetails.name, token: token, email: userDetails.email, id: userDetails._id })

    }
    catch (error) {
        console.log(error)
    }
}

const getAllUserDetails = async (req, res) => {
    try {
        const Category = req.query.Category;

        let filter = {};
        if (Category) {
            const regex = new RegExp(Category, "i");
            filter = { Category: regex };
        }

        const userList = await User.find(filter);

        res.json({ data: userList });

    } catch (error) {
        res.json(error)
    }
}

const getUserDetailsById = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.json({ message: "Bad Request" })
        }

        const userDetails = await User.findById(userId, { name: 1, email: 1, password: 1 });
        res.json({ data: userDetails })
    } catch (error) {

    }
}

const updateUserDetails = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.json({
                message: "Invalid credentials"
            });
        }

        const existinguser = await User.findById(userId);
        if (!existinguser) {
            return res.json({
                message: "user not found"
            });
        }

        const updatedData = req.body;

        if (updatedData.name) {
            existinguser.name = updatedData.name || existinguser.name;
        }

        if (updatedData.password) {
            const hashedPassword = await bcrypt.hash(updatedData.password, 10);
            existinguser.password = hashedPassword;
        }

        await existinguser.save();

        res.json({
            message: "user details updated successfully",
            updatedData
        });

    } catch (error) {
        res.json(error);
    }
}

const allAddedEmails = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { userEmail } = req.params;
        if (!email) {
            return res.json({
                message: "No e-mail data given"
            })
        }

        const emailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;
        if (!emailRegex.test(email)) {
            return res.json({
                message: "Invalid email format. Only @gmail.com emails are allowed."
            });
        }

        const existingEmail = await Email.findOne({ email, userEmail });
        if (existingEmail) {
            return res.json({ message: 'Email already exists for this user.' });
        }


        if (email === userEmail) {
            return res.json({ message: "You cannot add yourself as an assignee" })
        }

        const emailData = new Email({
            email,
            userEmail
        })

        await emailData.save();
        res.json({ message: "E-mail added successfully" })

    } catch (error) {
        console.log(error)
    }
}

const getAllEmailDetails = async (req, res) => {
    try {
        const { userEmail } = req.params;

        const emailList = await Email.find({ userEmail });

        res.json({ data: emailList });

    } catch (error) {
        res.json(error)
    }
}

module.exports = { loginUser, registerUser, getUserDetailsById, updateUserDetails, getAllUserDetails, allAddedEmails, getAllEmailDetails }

