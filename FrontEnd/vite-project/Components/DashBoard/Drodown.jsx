import React, { useState, useEffect } from 'react';
import styles from './Dropdown.module.css';
import Ellipse from '../../Assets/Ellipse.svg';
import { getUserDetails } from '../../API/User';

const CustomDropdown = ({ addedEmails, taskData, handleChange, handleButtonClick, email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requiredEmail, setRequiredEmail] = useState('');
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_Id');
        const response = await getUserDetails(userId);
        const userEmail = response.data.email;
        setRequiredEmail(userEmail);
        setIsCreator(userEmail === taskData.Assign_to);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [taskData.Assign_to]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (email) => {
    handleChange({ target: { name: 'Assign_to', value: email } });
    setIsOpen(false);
  };

  return (
    <div className={styles.customDropdown}>
      <button className={styles.dropdownButton} onClick={toggleDropdown} disabled={isCreator}>
        {taskData.Assign_to || 'Add an assignee'}
      </button>
      {isOpen && !isCreator && (
        <div className={styles.dropdownContent}>
          {addedEmails.map((emailObj, index) => (
            <div key={index} className={styles.dropdownItem}>
              <span onClick={() => handleOptionClick(emailObj.email)}> </span>
              <div className={styles.ellipsecontainer}>
                <img src={Ellipse} className={styles.ellipse} />
                <span className={styles.emailPrefix}>{emailObj.email.slice(0, 2).toUpperCase()}</span>
              </div>
              <span className={styles.email}>{emailObj.email}</span>
              <button className={styles.button} onClick={() => handleOptionClick(emailObj.email)}>
                Assign
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
