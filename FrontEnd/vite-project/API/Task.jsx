import React from "react";
import axios from 'axios'

const backendUrl = 'https://last-backend-dz62.onrender.com/task'

export const createTask = async (task) => {
  try {
    const reqUrl = `${backendUrl}/create`;

    const response = await axios.post(reqUrl, task);
    return response.data;
  } catch (error) {
    console.error(error);
    console.log('Failed to create task.');
  }
};

export const editTask = async (taskId, updatedFormData) => {
  try {
    const reqUrl = `${backendUrl}/edit/${taskId}`;

    const response = await axios.put(reqUrl, updatedFormData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);

  }
};

export const deleteTask = async (taskId) => {
  try {
    const reqUrl = `${backendUrl}/delete/${taskId}`;

    const response = await axios.delete(reqUrl);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const reqUrl = `${backendUrl}/getone/${taskId}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);

  }
};

export const getAllTask = async () => {
  try {
    const reqUrl = `${backendUrl}/all`;
    const response = await axios.get(reqUrl)
    return response.data
  } catch (error) {
    console.log(error)
  }
}


