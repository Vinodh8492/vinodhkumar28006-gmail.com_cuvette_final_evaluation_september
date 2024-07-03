import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../Assets/Logo.svg';
import Person from '../../Assets/Person.svg';
import Lock from '../../Assets/Lock.svg';
import Mail from '../../Assets/Mail.svg';
import Eye from '../../Assets/Eye.svg';
import EyeSlash from '../../Assets/EyeClose.png';
import styles from './Register.module.css';
import { registerUser } from '../../API/User';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({ name: '', password: '', email: '', confirmpassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {
    localStorage.clear()
    navigate('/login');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmpassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.password || !formData.name || !formData.email || !formData.confirmpassword) {
        toast.error("Fields can't be empty");
        return;
      }
      const response = await registerUser({ ...formData });

      if (response?.message === "user already exists, try another Email") {
        toast.info(response.message);
        return;
      }

      if (response?.message === "Passwords do not match") {
        toast.error(response.message);
        return;
      }

      if (response?.message === "Invalid email format. Only @gmail.com emails are allowed.") {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setFormData({ name: '', password: '', email: '', confirmpassword: '' });
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className={styles.body}>
      <ToastContainer />
      <div className={styles.left}>
        <img src={Logo} className={styles.logo} alt="Logo" />
        <p className={styles.p1}>Welcome aboard my friend</p>
        <p className={styles.p2}>just a couple of clicks and we start</p>
      </div>

      <div className={styles.right}>
        <p className={styles.text}>Register</p>
        <div className={styles.container}>
          <img src={Person} className={styles.person} alt="Person Icon" />
          <input type="text" name="name" placeholder="Name" maxLength={12} onChange={handleChange} value={formData.name} className={styles.input} />
        </div>

        <div className={styles.container}>
          <img src={Mail} className={styles.mail} alt="Mail Icon" />
          <input type="text" name="email" placeholder="Email" maxLength={16} onChange={handleChange} value={formData.email} className={styles.input} />
        </div>

        <div className={styles.container}>
          <img src={Lock} className={styles.lock} alt="Password Icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className={styles.input}
            maxLength={10}
          />
          <img
            src={showPassword ? EyeSlash : Eye}
            className={styles.eye}
            alt="Toggle Password Visibility"
            onClick={() => togglePasswordVisibility('password')}
          />
        </div>

        <div className={styles.container}>
          <img src={Lock} className={styles.lock} alt="Confirm Password Icon" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmpassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirmpassword}
            className={styles.input}
            maxLength={10}
          />
          <img
            src={showConfirmPassword ? EyeSlash : Eye}
            className={styles.eye}
            alt="Toggle Confirm Password Visibility"
            onClick={() => togglePasswordVisibility('confirmpassword')}
          />
        </div>

        <button onClick={handleSubmit} className={styles.register}>Register</button>
        <p className={styles.para}>Have an account ?</p>
        <button className={styles.login} onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
}

export default Register;
