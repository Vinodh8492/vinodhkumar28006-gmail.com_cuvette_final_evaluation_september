const express = require('express');
const Task = require('../Model/Task');

const createTask = async (req, res, next) => {
    try {

        const { title, priority, checklist, Assign_to, date, userEmail } = req.body;

        if (!userEmail) {
            return res.json({
                message: "User Email is not found"
            });
        }

        if (!title || !priority || !checklist) {
            return res.json({
                message: "Task Title, Task Priority, and checklists are required"
            });
        }

        if (!checklist || checklist.length === 0 || !checklist.every(item => item.trim() !== '')) {
            return res.json({
                message: "Checklist should have at least one non-empty item"
            });
        }

        if (!['high priority', 'low priority', 'moderate priority'].includes(priority)) {
            return res.json({
                message: "Invalid priority type"
            });
        }

        const emailRegex = /\b[A-Za-z0-9._%+-]+@gmail\.com\b/;
        if (Assign_to && !emailRegex.test(Assign_to)) {
            return res.json({
                message: "Invalid Assign_to format. Only @gmail.com format is allowed."
            });
        }

        const formattedChecklist = checklist.filter(item => item.trim() !== '').map(item => ({ item, checked: false }));

        const task = new Task({
            title,
            priority,
            checklist: formattedChecklist,
            Assign_to,
            userEmail,
            date
        });

        await task.save();
        res.json({
            message: "Task created successfully",
            task
        });

    } catch (error) {

    }
};

const editTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.json({
                message: "Invalid credentials"
            });
        }

        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.json({
                message: "Task not found"
            });
        }

        const updatedData = req.body;
        existingTask.title = updatedData.title || existingTask.title;
        existingTask.priority = updatedData.priority || existingTask.priority;

        existingTask.checklist = updatedData.checklist.map(item => ({
            item: item.item,
            checked: item.checked || false
        }));

        existingTask.date = updatedData.date || existingTask.date;
        existingTask.Assign_to = updatedData.Assign_to || existingTask.Assign_to;
        existingTask.status = updatedData.status || existingTask.status
        existingTask.userEmail = updatedData.userEmail || existingTask.userEmail



        await existingTask.save();

        res.json({
            message: "Task updated successfully"
        });

    } catch (error) {
        res.json(error);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        if (!taskId) {
            return res.json({ message: "Bad Request" });
        }

        const result = await Task.deleteOne({ _id: taskId });

        if (result.deletedCount === 0) {
            return res.json({ message: "Task not found" });
        }
        return res.json({ message: "Task deleted successfully" });
    } catch (error) {

    }
}

const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.json({ message: "Bad Request" })
        }

        const taskDetails = await Task.findById(taskId, { title: 1, Assign_to: 1, priority: 1, checklist: 1, date: 1, _id: 1 });
        res.json({ data: taskDetails })
    } catch (error) {

    }
}

const getAllTask = async (req, res) => {
    try {
        const Category = req.query.Category;

        let filter = {};
        if (Category) {
            const regex = new RegExp(Category, "i");
            filter = { Category: regex };
        }

        const taskList = await Task.find(filter);

        res.json({ data: taskList });

    } catch (error) {
        res.json(error)
    }
}

const updateChecklistItem = async (req, res, next) => {
    try {
        const { taskId, index } = req.params;

        if (!taskId || index === undefined) {
            return res.status(400).json({
                message: "Invalid taskId or itemId"
            });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const itemIndex = parseInt(index);
        if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= task.checklist.length) {
            return res.status(400).json({
                message: "Invalid index"
            });
        }

        const checklistItem = task.checklist[itemIndex];
        if (!checklistItem) {
            return res.status(404).json({
                message: "Checklist item not found"
            });
        }

        checklistItem.checked = !checklistItem.checked;

        const updatedTask = await task.save();

        if (!updatedTask) {
            return res.status(500).json({
                message: "Failed to update the checklist item"
            });
        }

        await task.save();

        res.json({
            message: "Checklist item updated successfully",
            task: task
        });

    } catch (error) {
        next(error);
    }
};



module.exports = { createTask, editTask, deleteTask, getTaskById, getAllTask, updateChecklistItem }