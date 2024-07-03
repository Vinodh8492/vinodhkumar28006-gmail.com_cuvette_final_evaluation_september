import React from "react";
import axios from 'axios';


const backendUrl = 'http://localhost:3333/user'

export const registerUser = async ({ email, name, password, confirmpassword }) => {
  try {
    const reqUrl = `${backendUrl}/register`;
    const response = await axios.post(reqUrl, { email, name, password, confirmpassword })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const reqUrl = `${backendUrl}/login`;
    const response = await axios.post(reqUrl, { email, password })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const updateUserDetails = async (userId, updatedFormData) => {
  try {
    const reqUrl = `${backendUrl}/update/${userId}`;
    const response = await axios.put(reqUrl, updatedFormData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);

  }
};

export const getUserDetails = async (userId) => {
  try {
    const reqUrl = `${backendUrl}/details/${userId}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);

  }
};

export const getAllUserDetails = async () => {
  try {
    const reqUrl = `${backendUrl}/all`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);

  }
};

export const getAllEmailDetails = async (userEmail) => {
  try {
    const reqUrl = `${backendUrl}/getemails/${userEmail}`;
    const response = await axios.get(reqUrl);
    return response.data;
  } catch (error) {
    console.log(error);

  }
};

export const postAllEmailDetails = async (userEmail, email) => {
  try {
    const reqUrl = `${backendUrl}/addemail/${userEmail}`;
    const response = await axios.post(reqUrl, { email });
    return response.data;
  } catch (error) {
    console.log(error);

  }
};