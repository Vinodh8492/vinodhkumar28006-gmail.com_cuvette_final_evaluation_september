const express = require('express');

const taskRouter = express.Router();

const { createTask, editTask, deleteTask, getTaskById, getAllTask, updateChecklistItem } = require('../Controllers/taskController')

taskRouter.post('/create', createTask)
taskRouter.put('/edit/:taskId', editTask)
taskRouter.delete('/delete/:taskId', deleteTask)
taskRouter.get('/getone/:taskId', getTaskById)
taskRouter.get('/all', getAllTask)
taskRouter.put('/update-checklist/:taskId/:index', updateChecklistItem)


module.exports = taskRouter