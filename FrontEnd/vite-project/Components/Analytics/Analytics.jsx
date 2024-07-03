import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProLogo from '../../Assets/ProLogo.svg'
import styles from './Analytics.module.css'
import Board from '../../Assets/Board.svg'
import Analytic from '../../Assets/Analytics.svg'
import Settings from '../../Assets/Settings.svg'
import Logout from '../../Assets/Logout.svg'
import Dot from '../../Assets/Dot.svg';
import { useNavigate } from 'react-router-dom'
import { getAllTask } from '../../API/Task'


function LogoutOverlay({ onClose, onConfirm }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <p className={styles.confirmpara} >Are you sure you want to log out?</p>
        <button className={styles.confirmButton} onClick={onConfirm}>Yes, Logout</button>
        <button className={styles.closeButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}


function Analytics() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const [stateData] = useState(state?.taskData);
  const currentUserEmail = localStorage.getItem('userEmail');
  useEffect(() => {
    if (!currentUserEmail) {
      navigate('/login');
    }
  }, [currentUserEmail, navigate]);

  const [taskData, setTaskData] = useState({
    title: stateData?.title || '',
    Assign_to: stateData?.Assign_to || '',
    priority: stateData?.priority || '',
    date: stateData?.date || null,
    checklist: stateData?.checklist || [''],
    status: stateData?.status || ''
  });

  const [lowPriorityCount, setLowPriorityCount] = useState(0);
  const [moderatePriorityCount, setModeratePriorityCount] = useState(0);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [dueDateTasksCount, setDueDateTasksCount] = useState(0);
  const [backlog, setBacklog] = useState(0)
  const [todo, setTodo] = useState(0)
  const [inprogress, setInProgress] = useState(0)
  const [done, setDone] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false);


  const fetchAllTasks = async () => {
    const response = await getAllTask();
    const userTasks = response.data.filter(task => {
      return task.userEmail === currentUserEmail || task.Assign_to === currentUserEmail;
    });
    setTaskData(userTasks);

    let lowCount = 0;
    let moderateCount = 0;
    let highCount = 0;
    let dueDateCount = 0;
    let backlogTasks = 0;
    let todoTasks = 0;
    let inprogressTasks = 0;
    let doneTasks = 0;

    userTasks.forEach(task => {

      if (task.priority === 'low priority') {
        lowCount++;
      } else if (task.priority === 'moderate priority') {
        moderateCount++;
      } else if (task.priority === 'high priority') {
        highCount++;
      }
      if (task.date) {
        dueDateCount++;
      }
      if (task.status === 'backlog') {
        backlogTasks++;
      } else if (task.status === 'to do') {
        todoTasks++;
      } else if (task.status === 'in progress') {
        inprogressTasks++;
      } else if (task.status === 'done') {
        doneTasks++
      }
    });

    setLowPriorityCount(lowCount);
    setModeratePriorityCount(moderateCount);
    setHighPriorityCount(highCount);
    setDueDateTasksCount(dueDateCount);
    setBacklog(backlogTasks)
    setInProgress(inprogressTasks)
    setTodo(todoTasks)
    setDone(doneTasks)
  };

  useEffect(() => {
    fetchAllTasks();
  });

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className={styles.body} >
      <div className={styles.left} >

        <div className={styles.flex} >
          <img src={ProLogo} className={styles.prologo} />
          <p className={styles.pro} >Pro Manage</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/') }}>
          <img src={Board} className={styles.board} />
          <p className={styles.boardtext} >Board</p>
        </div>

        <div className={styles.flexboard} >
          <img src={Analytic} className={styles.analytics} />
          <p className={styles.analyticstext} >Analytics</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/settings') }} >
          <img src={Settings} className={styles.settings} />
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
          <p className={styles.analytics}>Analytics</p>
        </div>

        <div className={styles.full} >

          <div className={styles.half} >
            <div className={styles.section1} >
              <img src={Dot} />
              <p className={styles.text} >Backlog Tasks</p>
              <p className={styles.number1} >{backlog}</p>
            </div>

            <div className={styles.section2} >
              <img src={Dot} />
              <p className={styles.text} >To-do Tasks</p>
              <p className={styles.number2} >{todo}</p>
            </div>

            <div className={styles.section3} >
              <img src={Dot} />
              <p className={styles.text} >In-Progress Tasks</p>
              <p className={styles.number3} >{inprogress}</p>
            </div>

            <div className={styles.section4} >
              <img src={Dot} />
              <p className={styles.text} >Completed Tasks</p>
              <p className={styles.number4} >{done}</p>
            </div>
          </div>

          <div className={styles.half} >
            <div className={styles.section1} >
              <img src={Dot} />
              <p className={styles.text} >Low Priority</p>
              <p className={styles.digit1} >{lowPriorityCount}</p>
            </div>

            <div className={styles.section2} >
              <img src={Dot} />
              <p className={styles.text} >Moderate Priority</p>
              <p className={styles.digit2} >{moderatePriorityCount}</p>
            </div>

            <div className={styles.section3} >
              <img src={Dot} />
              <p className={styles.text} >High Priority</p>
              <p className={styles.digit3} >{highPriorityCount}</p>
            </div>

            <div className={styles.section4} >
              <img src={Dot} />
              <p className={styles.text} >Due Date Tasks</p>
              <p className={styles.digit4} >{dueDateTasksCount}</p>
            </div>
          </div>

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

export default Analytics