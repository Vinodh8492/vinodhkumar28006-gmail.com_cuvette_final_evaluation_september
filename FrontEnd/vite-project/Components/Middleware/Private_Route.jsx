import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
