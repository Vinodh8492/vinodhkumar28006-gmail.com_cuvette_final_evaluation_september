import React, { useState, useEffect } from 'react'
import ProLogo from '../../Assets/ProLogo.svg'
import bcrypt from 'bcryptjs';
import styles from './Settings.module.css'
import Board from '../../Assets/Board.svg'
import Analytics from '../../Assets/Analytics.svg'
import Setting from '../../Assets/Settings.svg'
import Logout from '../../Assets/Logout.svg'
import Person from '../../Assets/Person.svg'
import Lock from '../../Assets/Lock.svg';
import Mail from '../../Assets/Mail.svg';
import Eye from '../../Assets/Eye.svg';
import EyeSlash from '../../Assets/EyeClose.png';
import { useNavigate } from 'react-router-dom'
import { updateUserDetails, getUserDetails } from '../../API/User'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogoutOverlay({ onClose, onConfirm }) {
  return (
    <div className={styles.logoutoverlay}>
      <div className={styles.logoutoverlayContent}>
        <p className={styles.confirmlogoutpara} >Are you sure you want to log out?</p>
        <button className={styles.confirmlogoutButton} onClick={onConfirm}>Yes, Logout</button>
        <button className={styles.confirmcloseButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function Settings() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  const fetchAUserDetails = async () => {
    const userId = localStorage.getItem('user_Id');
    console.log(userId)
    if (userId) {
      const response = await getUserDetails(userId);
      console.log(response.data);
      if (response.data) {
        setUserData(response.data);
        setName(response.data.name || '');
        setEmail(response.data.email || '');
      }
    } else {
      console.error('User ID not found in localStorage');
      navigate('/login')
    }
  };


  useEffect(() => {
    fetchAUserDetails();
  }, []);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmpassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleUpdate = async () => {
    try {
      const userId = localStorage.getItem('user_Id');
      if (!userId) {
        console.log('User ID not found in localStorage');
        navigate('/login')
        return;
      }

      let updatedFields = {};

      if (name !== userData.name) {
        updatedFields.name = name;
      }

      if (oldPassword) {


        const passwordMatches = await bcrypt.compare(oldPassword, userData.password);

        if (!oldPassword || !newPassword) {
          toast.error('Both the password fields should be filled');
          return;
        }
        if (!passwordMatches) {
          toast.error('Incorrect old password. Please enter the correct password to proceed');
          return;
        }

        if (oldPassword === newPassword) {
          toast.error('New password must be different from the old password');
          return;
        }

        updatedFields.password = newPassword;
      }

      if (Object.keys(updatedFields).length > 1) {
        toast.error('Only one field can be updated at a time');
        return;
      }


      if (Object.keys(updatedFields).length > 0) {
        const updatedUser = await updateUserDetails(userId, updatedFields);
        console.log('User details updated:', updatedUser);
        if (updatedUser) {
          console.log(updatedUser?.updatedData?.email);
        }

        setOldPassword(newPassword);
        setEmail(updatedUser?.updatedData?.email)
        await fetchAUserDetails();

        if (updatedUser.message == "Invalid email format. Only @gmail.com emails are allowed." ||
          updatedUser.message == "Email address already in use, try another one") {
          toast.info(updatedUser.message)
          return
        }

        toast.success(updatedUser.message);

        setTimeout(() => {
          if (updatedUser?.updatedData?.email === updatedFields.email && name !== updatedFields.name) {
            localStorage.clear();
            navigate('/login');
          }
        }, 2500);

        setTimeout(() => {
          if (newPassword !== '') {
            localStorage.clear();
            navigate('/login');
          }
        }, 2500);

        setOldPassword('');
        setNewPassword('');
      } else {
        toast.info('No changes to update');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleReadOnlyClick = () => {
    toast.info("E-mail field is read-only, you cannot modify it");
  };


  return (
    <div className={styles.body} >
      <ToastContainer />
      <div className={styles.left} >

        <div className={styles.flex} >
          <img src={ProLogo} className={styles.prologo} />
          <p className={styles.pro} >Pro Manage</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/') }} >
          <img src={Board} className={styles.board} />
          <p className={styles.boardtext} >Board</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/analytics') }} >
          <img src={Analytics} className={styles.analytics} />
          <p className={styles.analyticstext} >Analytics</p>
        </div>

        <div className={styles.flexboard}  >
          <img src={Setting} className={styles.settings} />
          <p className={styles.settingstext} >Settings</p>
        </div>

        <div className={styles.flexy} onClick={() => setShowOverlay(true)} >
          <img src={Logout} className={styles.logout} />
          <p className={styles.log} >Log out </p>
        </div>

      </div>
      <hr className={styles.separator} />

      <div className={styles.right} >

        <div className={styles.header}>
          <p className={styles.settings}>Settings</p>
        </div>

        <div className={styles.data} >
          <div className={styles.container}>
            <img src={Person} className={styles.person} />
            <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
          </div>

          <div className={styles.container}>
            <img src={Mail} className={styles.mail} alt="Mail Icon" />
            <input type="text" name="email" placeholder="Update Email" value={email} onClick={handleReadOnlyClick} readOnly className={styles.input} />
          </div>

          <div className={styles.container}>
            <img src={Lock} className={styles.lock} alt="Password Icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.input}
            />
            <img
              src={showPassword ? EyeSlash : Eye}
              className={styles.eye}
              onClick={() => togglePasswordVisibility('password')}
            />
          </div>

          <div className={styles.container}>
            <img src={Lock} className={styles.lock} alt="Confirm Password Icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
            />
            <img
              src={showConfirmPassword ? EyeSlash : Eye}
              className={styles.eye}
              onClick={() => togglePasswordVisibility('confirmpassword')}
            />
          </div>

          <button className={styles.update} onClick={handleUpdate} >Update</button>
        </div>
        {showOverlay && (
          <LogoutOverlay
            onClose={() => setShowOverlay(false)}
            onConfirm={handleLogout}
          />
        )}
      </div>
    </div>
  )
}

export default Settings