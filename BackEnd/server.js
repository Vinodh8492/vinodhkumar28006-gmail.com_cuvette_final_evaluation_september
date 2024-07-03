const express = require('express');

const app = express();
const dotenv = require('dotenv')
const db = require('./DataBase/db')
const cors = require('cors')
dotenv.config()
const port = process.env.PORT;

const userRouter = require('./Routes/userRoute');
const taskRouter = require('./Routes/taskRoute');

app.use(cors());
app.use(express.json())

app.use('/user', userRouter)
app.use('/task', taskRouter)

app.listen(port, () => {
    console.log("server started successfully")
})