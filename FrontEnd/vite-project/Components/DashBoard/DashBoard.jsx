import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProLogo from '../../Assets/ProLogo.svg';
import Board from '../../Assets/Board.svg';
import Analytics from '../../Assets/Analytics.svg';
import Settings from '../../Assets/Settings.svg';
import Logout from '../../Assets/Logout.svg';
import Collapse from '../../Assets/Collapse.svg';
import Add from '../../Assets/Add.svg';
import Pink from '../../Assets/Pink.svg';
import Green from '../../Assets/Green.svg';
import Blue from '../../Assets/Blue.svg';
import Delete from '../../Assets/Delete.svg';
import styles from './DashBoard.module.css';
import More from '../../Assets/More.svg';
import Ellipse from '../../Assets/Ellipse.svg';
import Down_Arrow from '../../Assets/Down_Arrow.svg'
import People from '../../Assets/People.svg'
import Link_Copied from '../../Assets/Link_Copied.svg'
import TruncatedTitle from './Title.jsx';
import CustomDropdown from './Drodown';
import { createTask, editTask, getAllTask, deleteTask, getTaskById } from '../../API/Task';
import { getAllUserDetails, getAllEmailDetails, postAllEmailDetails, getUserDetails } from '../../API/User'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OverlayComponent = ({
  taskData,
  selectedPriority,
  inputSections,
  selectedDate,
  handleChange,
  handleHighPriorityClick,
  handleModeratePriorityClick,
  handleLowPriorityClick,
  handleAddInputSection,
  handleRemoveInputSection,
  handleInputChange,
  setSelectedDate,
  setTaskData,
  handleCloseOverlay,
  handleEditClick,
  setIsOverlayVisible,
  handleSubmit,
  userEmails,
  setInputSections,
  email
}) => {



  const [addedEmails, setAddedEmails] = useState([])
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    localStorage.clear()
    navigate('/login')
  }

  const handleButtonClick = (email) => {
    console.log('Button clicked for:', email);
  };

  const handleChecklistItemToggle = (index) => {

    if (index > 1000) {
      toast.info('You cannot update checklist even before creating it')
    }
    setInputSections(prevSections =>
      prevSections.map((section, idx) => {
        if (idx === index) {
          console.log("Toggling checklist item:", section.id);
          console.log("Previous section:", section);

          const updatedSection = {
            ...section,
            value: {
              ...section.value,
              checked: !section.value.checked
            }
          };
          console.log("Updated section:", updatedSection);

          const updatedTaskData = {
            ...taskData,
            checklist: [
              ...taskData.checklist.slice(0, idx),
              updatedSection.value,
              ...taskData.checklist.slice(idx + 1)
            ]
          };
          console.log("Updated taskData:", updatedTaskData);
          setTaskData(updatedTaskData);
          return updatedSection;
        }
        console.log("creating the task ")
        return section;
      })
    );
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        if (userEmail) {
          const response = await getAllEmailDetails(userEmail);
          toast.error(response.message)
          setAddedEmails(response.data);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, [userEmail]);

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <div className={styles.p3}>
          Title <span className={styles.redAsterisk}>*</span>
        </div>
        <input
          type="text"
          placeholder="Enter Task Title"
          name="title"
          className={styles.tasktitle}
          value={taskData.title || ''}
          onChange={handleChange}
          maxLength={24}
        />

        <div>
          <div className={styles.p3}>
            Select Priority <span className={styles.redAsterisk}>*</span>
            <button
              className={`${styles.buttons} ${selectedPriority === 'High' ? styles.selected : ''}`}
              onClick={handleHighPriorityClick}
            >
              <img className={styles.colors} src={Pink} alt="High Priority" />
              <p className={styles.colorstext}>HIGH PRIORITY</p>
            </button>

            <button
              className={`${styles.buttons} ${selectedPriority === 'Moderate' ? styles.selected : ''}`}
              onClick={handleModeratePriorityClick}
            >
              <img className={styles.colors} src={Blue} alt="Moderate Priority" />
              <p className={styles.colorstext}>MODERATE PRIORITY</p>
            </button>

            <button
              className={`${styles.buttons} ${selectedPriority === 'Low' ? styles.selected : ''}`}
              onClick={handleLowPriorityClick}
            >
              <img className={styles.colors} src={Green} alt="Low Priority" />
              <p className={styles.colorstext}>LOW PRIORITY</p>
            </button>
          </div>
        </div>

        <div className={styles.p2}>
          <div> Assign to </div>
          <CustomDropdown
            addedEmails={addedEmails}
            taskData={taskData}
            handleChange={handleChange}
            handleButtonClick={handleButtonClick}
            email={email}
          />

        </div>

        <div className={styles.p4}>
          <div className={styles.checked}>
            Checklist ({inputSections.filter(section => section.value.checked).length}/{inputSections.length})
            <span className={styles.redAsterisk}>*</span>
          </div>
          <div className={styles.inputSectionContainer}>


            {inputSections.map(section => (
              <div key={section.id} className={styles.inputsection}>
                <input
                  type="checkbox"
                  checked={section.value.checked}
                  onChange={() => handleChecklistItemToggle(section.id)}
                  className={styles.checkboxInput}
                />
                <input
                  type="text"
                  value={section.value.item}
                  onChange={(e) => handleInputChange(section.id, e.target.value)}
                  className={styles.taskInput}
                  placeholder="Enter task"
                  maxLength={75}
                />
                <img
                  src={Delete}
                  className={styles.deleteIcon}
                  onClick={() => handleRemoveInputSection(section.id)}
                  alt="Delete"
                />
              </div>
            ))}
          </div>
          <div className={styles.addname} onClick={handleAddInputSection}>
            <img src={Add} alt="Add New" />
            <p className={styles.colorstext}>Add New</p>
          </div>
        </div>

        <div className={styles.lastbuttons}>
          <DatePicker
            selected={selectedDate}
            onChange={date => {
              setSelectedDate(date);
              setTaskData((prevState) => ({
                ...prevState,
                date: date,
              }));
            }}
            dateFormat="dd/MM/yyyy"
            className={styles.datepicker}
            placeholderText="Select Due Date"
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={200}
            scrollableYearDropdown
          />
          <button className={styles.cancelbutton} onClick={handleCloseOverlay}>Cancel</button>
          <button className={styles.savebutton} onClick={handleSubmit} >Save</button>
        </div>
      </div>
    </div>
  );
};

const DeleteOverlayComponent = ({ taskId, onClose, handleDeleteConfirmation }) => {
  return (
    <div className={styles.deleteoverlay}>
      <div className={styles.deleteoverlayContent}>
        <p className={styles.deletetext} >Are you sure you want to Delete?</p>
        <div className={styles.deletebuttons}>
          <button className={styles.deletedbutton} onClick={handleDeleteConfirmation}>Yes, Delete</button>
          <button className={styles.cancelationbutton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const AddPeopleOverlay = ({ onClose }) => {

  const [enteredEmail, setEnteredEmail] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [addedEmail, setAddedEmail] = useState('');

  const handleAddEmail = async (email) => {
    try {
      const userId = localStorage.getItem('user_Id');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }
      const response = await getUserDetails(userId);
      const userEmail = response.data.email;

      if (!userEmail) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const addEmailResponse = await postAllEmailDetails(userEmail, email);
      console.log(addEmailResponse.message);

      if (addEmailResponse.message === "E-mail added successfully") {
        setAddedEmail(email);
        setShowSuccessOverlay(true);
      } else {
        setEnteredEmail('');
        toast.error(addEmailResponse.message);
      }
    } catch (error) {
      toast.error("Failed to add email", error);
    }
  };




  const handleCloseSuccessOverlay = () => {
    setShowSuccessOverlay(false);
    onClose()
  };

  const handleChange = (e) => {
    setEnteredEmail(e.target.value);
  };

  return (
    <div className={styles.addoverlay}>
      <div className={styles.addoverlayContent}>
        <div className={styles.addcontents} >
          <p className={styles.addheader}>Add people to the board</p>
          <input type="text" placeholder='Enter the email' className={styles.addinput} onChange={handleChange} maxLength={21} value={enteredEmail} />
          <div className={styles.addbuttons} >
            <button className={styles.addcancelButton} onClick={onClose}>Cancel</button>
            <button className={styles.addemailButton} onClick={() => { handleAddEmail(enteredEmail) }} >Add Email</button>
          </div>
        </div>
      </div>
      {showSuccessOverlay && <SuccessOverlay onClose={handleCloseSuccessOverlay} addedEmail={addedEmail} />}
    </div>
  );
};

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

const SuccessOverlay = ({ onClose, addedEmail }) => {
  return (
    <div className={styles.successOverlay}>
      <div className={styles.successOverlayContent}>
        <p className={styles.emailMessage}>{addedEmail}  added  to  board</p>
        <button className={styles.gotitButton} onClick={onClose}>Okay, got it!</button>
      </div>
    </div>
  );
};

function DashBoard() {

  const [addOverlayVisible, setAddOverlayVisible] = useState(false);
  const toggleAddOverlay = () => {
    setAddOverlayVisible(!addOverlayVisible);
  };
  const [state, setState] = useState(null);
  const [stateData, setStateData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [inputSections, setInputSections] = useState([{ id: Date.now(), value: '' }]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskOverlays, setTaskOverlays] = useState({});
  const [showMoreActions, setShowMoreActions] = useState({});
  const [email, setEmail] = useState('')

  useEffect(() => {
    const requiredData = async () => {
      try {
        const userId = localStorage.getItem('user_Id')
        const response = await getUserDetails(userId)
        setEmail(response.data.email)

      } catch (error) {
        console.log(error)
      }
    }
    requiredData()
  }, []);


  const [taskData, setTaskData] = useState({
    title: '',
    Assign_to: '',
    userEmail: email,
    priority: '',
    date: null,
    checklist: [{ item: '', checked: false }],
    status: 'to do'
  });

  useEffect(() => {
    if (stateData.length > 0) {
      const updatedTaskData = stateData.reduce((accumulator, item) => {
        accumulator.title += item.title + ' ';
        accumulator.Assign_to += item.Assign_to + ' ';
        accumulator.priority += item.priority + ' ';
        if (!accumulator.checklist) {
          accumulator.checklist = [];
        }

        accumulator.checklist.push(
          ...item.checklist.map(checklistItem => ({
            item: checklistItem.item.trim(),
            checked: checklistItem.checked
          }))
        );

        if (item.date) {
          const dateObject = new Date(item.date);
          if (!isNaN(dateObject.getTime())) {
            const formattedDate = dateObject.toISOString().slice(0, 10);
            accumulator.date += formattedDate + ' ';
          } else {
            console.log(`Invalid date format for item with id ${item._id}: ${item.date}`);
          }
        } else {
          console.log(`Null or undefined date for item with id ${item._id}`);
        }
        return accumulator;
      }, {
        title: '',
        Assign_to: '',
        priority: '',
        date: ''
      });

      updatedTaskData.title = updatedTaskData.title.trim();
      updatedTaskData.Assign_to = updatedTaskData.Assign_to.trim();
      updatedTaskData.priority = updatedTaskData.priority.trim();
      updatedTaskData.date = updatedTaskData.date.trim();
      updatedTaskData.checklist = updatedTaskData.checklist.map(item => ({
        ...item,
        item: item.item.trim()
      }));

      setTaskData(updatedTaskData);
    }
  }, [stateData]);

  useEffect(() => {
    if (state && state.taskData) {
      setStateData(prevStateData => [...prevStateData, state.taskData]);
    }
  }, [state]);


  const [originalTaskData, setOriginalTaskData] = useState([]);

  const fetchAllTasks = async () => {
    const response = await getAllTask();
    setOriginalTaskData(response.data);
    setTaskData(response.data);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });

    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  };

  const getPriorityImage = (priority) => {
    switch (priority) {
      case 'high priority':
        return Pink;
      case 'moderate priority':
        return Blue;
      case 'low priority':
        return Green;
      default:
        return null;
    }
  };

  const [isDeleteOverlayVisible, setIsDeleteOverlayVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const handleDeleteClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsDeleteOverlayVisible(true);
    setShowMoreActions(false)
  };

  const handleDeleteConfirmation = async () => {
    try {
      console.log('Deleting task:', selectedTaskId);
      const response = await deleteTask(selectedTaskId);
      if (response && !response.error) {
        setTaskData((prevData) => prevData.filter((task) => task._id !== selectedTaskId));
        toast.success('Task deleted successfully');
      } else {
        console.error('Failed to delete task');
      }
      setIsDeleteOverlayVisible(false)
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const [selectedPriority, setSelectedPriority] = useState('');

  const [userEmails, setUserEmails] = useState([]);

  const handleAddEmailSuccess = (email) => {
    handleCloseOverlay();
  };


  useEffect(() => {
    const requiredData = async () => {
      try {
        const userId = localStorage.getItem('user_Id')
        const response = await getUserDetails(userId)
        const name = response.data.name;
        if (name) {
          setUserName(name);
        }
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        setCurrentDate(`${day}${getDaySuffix(day)} ${month}, ${year}`);

      } catch (error) {
        console.log(error)
      }
    }
    requiredData()
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('');

  const filterTaskData = (timeframe) => {
    if (!originalTaskData.length) {
      console.error('Original task data not fetched yet.');
      return;
    }

    let filteredData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setTaskData(originalTaskData);

    if (timeframe === 'today') {
      filteredData = originalTaskData.filter(item => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === today.getTime();
      });
    } else if (timeframe === 'thisWeek') {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      filteredData = originalTaskData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= today && itemDate <= weekEnd;
      });
    } else if (timeframe === 'thisMonth') {
      const monthEnd = new Date(today);
      monthEnd.setDate(today.getDate() + 30);
      filteredData = originalTaskData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= today && itemDate <= monthEnd;
      });
    } else {
      filteredData = originalTaskData;
    }

    console.log("Filtered data:", filteredData);
    setTaskData(filteredData);
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const handleHighPriorityClick = () => {
    setTaskData((prevState) => ({
      ...prevState,
      priority: 'high priority',
    }));
    setSelectedPriority('High');
  };

  const handleModeratePriorityClick = () => {
    setTaskData((prevState) => ({
      ...prevState,
      priority: 'moderate priority',
    }));
    setSelectedPriority('Moderate');
  };

  const handleLowPriorityClick = () => {
    setTaskData((prevState) => ({
      ...prevState,
      priority: 'low priority',
    }));
    setSelectedPriority('Low');
  };

  const handleClick = async (_id, newStatus) => {
    try {
      console.log("Current taskData IDs:", taskData.map(task => task._id));

      const updatedTaskData = taskData.map(task => {
        if (task._id === _id) {
          console.log(`Updating task with ID ${_id} to status ${newStatus}`);
          if (newStatus === 'backlog') {
            if (task.date && new Date(task.date) < new Date()) {
              task.status = 'backlog';
            } else {
              task.status = 'backlog';
            }
          } else {
            task.status = newStatus;
          }
        }
        return task;
      });

      const updatedTask = updatedTaskData.find(task => task._id === _id);
      console.log("Updated task data to send:", updatedTask);


      setTaskData(updatedTaskData);

      const response = await editTask(_id, updatedTask);
      console.log("Response from editTask:", response);

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log('Task updated successfully:', response.message);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleRemoveInputSection = (id) => {
    const newInputSections = inputSections.filter(section => section.id !== id);
    setInputSections(newInputSections);
    setTaskData((prevState) => ({
      ...prevState,
      checklist: newInputSections.map(section => section.value),
    }));
  };

  const handleAddInputSection = () => {
    const newInputSections = [...inputSections, { id: Date.now(), value: { item: '', checked: false } }];
    setInputSections(newInputSections);
    setTaskData((prevState) => ({
      ...prevState,
      checklist: newInputSections.map(section => section.value),
    }));
  };

  const handleInputChange = (id, value) => {
    if (!isEditing) {
      const newInputSections = inputSections.map(section => section.id === id ? { ...section, value } : section);
      setInputSections(newInputSections);
      setTaskData((prevState) => ({
        ...prevState,
        checklist: newInputSections.map(section => section.value),
      }));
    } else {
      const newInputSections = inputSections.map(section =>
        section.id === id ? { ...section, value: { item: value } } : section
      );

      setInputSections(newInputSections);
      setTaskData(prevState => ({
        ...prevState,
        checklist: newInputSections.map(section => ({
          item: section.value.item,
          checked: (prevState.checklist || []).find(chk => chk.item === section.value.item)?.checked || false
        })),
      }));
    }
  };

  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    localStorage.clear()
    navigate('/login');
    return
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [showChecklists, setShowChecklists] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (taskData && Array.isArray(taskData)) {
      const initialCheckedItems = taskData.map(task => {
        return task.checklist.map(item => item.checked);
      });
      setCheckedItems(initialCheckedItems.flat());
    }
  }, [taskData]);

  const toggleChecklist = (taskId) => {
    setShowChecklists((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));
  };

  const handleLabelClick = async (taskId, index) => {
    try {
      const newChecklist = [...taskData];
      const item = newChecklist.find(task => task._id === taskId).checklist[index];
      item.checked = !item.checked;

      setTaskData(newChecklist);

      const response = await axios.put(
        `https://last-backend-dz62.onrender.com/task/update-checklist/${taskId}/${index}`,
        { checked: item.checked }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };


  const [showLinkCopiedImage, setShowLinkCopiedImage] = useState(false)

  const handleShareTask = (taskId) => {
    const generatedURL = `${window.location.origin}/share/${taskId}`;
    navigator.clipboard.writeText(generatedURL);
    console.log(generatedURL)
    setShowLinkCopiedImage(true);
    setTimeout(() => {
      setShowLinkCopiedImage(false);
    }, 2000);
    setShowMoreActions(false)

  };


  const handleAddClick = () => {
    setIsOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
    window.location.reload()
  };

  const collapseAllChecklists = (statusToClose) => {
    const updatedChecklists = {};
    taskData.forEach((task) => {
      if (task.status === statusToClose) {
        updatedChecklists[task._id] = false;
      } else {
        if (!updatedChecklists.hasOwnProperty(task._id)) {
          updatedChecklists[task._id] = showChecklists[task._id] !== undefined ? showChecklists[task._id] : false;
        }
      }
    });
    setShowChecklists(updatedChecklists);
  };

  const toggleMoreActions = (taskId) => {
    console.log(taskId)
    setShowMoreActions(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId]
    }));

  };

  function isDateInPast(taskDate) {
    const currentDate = new Date();
    const taskDateObj = new Date(taskDate);
    return taskDateObj < currentDate;
  }

  const handleEditClick = async (taskId) => {
    const taskData = await getTaskById(taskId);
    setState({
      id: taskId,
      taskData: taskData?.data,
      edit: true,
    });
    switch (taskData?.data?.priority) {
      case 'high priority':
        setSelectedPriority('High');
        break;
      case 'moderate priority':
        setSelectedPriority('Moderate');
        break;
      case 'low priority':
        setSelectedPriority('Low');
        break;
      default:
        setSelectedPriority('');
        break;
    }
    setInputSections(taskData.data.checklist.map((item, index) => ({
      id: index,
      value: item,
    })));


    setIsEditing(true)
    if (!isOverlayVisible) {
      setIsOverlayVisible(true);
    }
    console.log(taskId)
  };

  useEffect(() => {
    handleEditClick()
  }, [])

  useEffect(() => {
    if (stateData.length > 0) {
      console.log("Ids in stateData:");
      stateData.forEach(item => {
        console.log(item._id);
      });
    }
  }, [stateData]);

  const handleSubmit = async () => {
    try {
      if (!taskData.title) {
        toast.error('Please enter task title');
        return;
      }

      if (!taskData.priority) {
        toast.error('Please choose the task priority');
        return;
      }

      if (!Array.isArray(taskData.checklist) || taskData.checklist.length === 0 || !taskData.checklist.every(item => item !== '')) {
        toast.error('Checklist should have at least one non-empty item');
        return;
      }

      if (isEditing) {
        try {
          stateData.forEach(async (item) => {
            const updatedTask = {
              title: taskData.title,
              Assign_to: taskData.Assign_to,
              userEmail: taskData.userEmail,
              priority: taskData.priority,
              date: taskData.date,
              checklist: taskData.checklist.map(checklistItem => ({
                item: checklistItem.item,
                checked: checklistItem.checked
              }))
            };

            const response = await editTask(item._id, updatedTask);
            console.log("response message ", response.message)
            if (response?.message) {
              toast.success(response.message)
            }
            console.log(item.id)
          });

        } catch (error) {
          console.error('Error editing tasks:', error);
          toast.error('Failed to edit tasks. Please try again.');
        }
      }
      else {
        taskData.userEmail = localStorage.getItem('userEmail')
        const response = await createTask(taskData);
        console.log('Task created:', response);
        if (response?.message) {
          toast.success(response.message)
        }
      }
      setTaskData({
        title: '',
        Assign_to: '',
        userEmail: '',
        priority: '',
        date: null,
        checklist: [{ item: '', checked: false }]
      })
      setSelectedPriority('');
      setInputSections([{ id: Date.now(), value: '' }]);
      setSelectedDate(null);
      setIsOverlayVisible(false)

      setTimeout(() => {
        window.location.reload();
      }, 2000);



    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create or edit task. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    fetchAllTasks();
  }, []);


  return (
    <div className={styles.body}>
      <ToastContainer />
      <div className={styles.left}>
        <div className={styles.flex}>
          <img src={ProLogo} className={styles.prologo} alt="ProLogo" />
          <p className={styles.pro}>Pro Manage</p>
          <div>
          </div>
        </div>

        <div className={styles.flexboard}>
          <img src={Board} className={styles.board} alt="Board" />
          <p className={styles.boardtext}>Board</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/analytics'); }}>
          <img src={Analytics} className={styles.analytics} alt="Analytics" />
          <p className={styles.analyticstext}>Analytics</p>
        </div>

        <div className={styles.flex} onClick={() => { navigate('/settings'); }}>
          <img src={Settings} className={styles.settings} alt="Settings" />
          <p className={styles.settingstext}>Settings</p>
        </div>

        <div className={styles.flexy} onClick={() => setShowOverlay(true)} >
          <img src={Logout} className={styles.logout} alt="Logout" />
          <p className={styles.log}>Log out </p>
        </div>
      </div>
      <hr className={styles.separator} />

      <div className={styles.right}>
        <div className={styles.header}>
          <p className={styles.welcome}>Welcome! {userName}</p>
          <p className={styles.date}>{currentDate}</p>
        </div>

        <div className={styles.header}>
          <p className={styles.board1}>Board</p>
          <div className={styles.peoplesection} onClick={toggleAddOverlay} >
            <img src={People} className={styles.people} />
            <p className={styles.addpeople} >Add People</p>
          </div>
          <select
            className={styles.week}
            value={selectedTimeframe}
            onChange={(e) => {
              setSelectedTimeframe(e.target.value);
              filterTaskData(e.target.value);
            }}
          >
            <option value="">Select Timeframe</option>
            <option value="today">Today</option>
            <option value="thisWeek">This week</option>
            <option value="thisMonth">This month</option>
          </select>
        </div>

        <div className={styles.taskSections}>
          <div className={styles.taskarea}>
            <div className={styles.section1}>

              <div className={styles.backlogSection}>
                <p className={styles.backlog}>Backlog</p>
                <img src={Collapse} className={styles.collpaseicon} onClick={() => collapseAllChecklists("backlog")} alt="Collapse" />
              </div>

              {Array.isArray(taskData) && taskData.length > 0 && (
                taskData.map((task, index) => {
                  const userEmail = email;
                  if (task.status === 'backlog' && (task.userEmail === userEmail || task.Assign_to === userEmail)) {
                    return (
                      <div key={task._id} className={styles.tasksContainer}>
                        <div className={styles.row1}>
                          <img src={getPriorityImage(task.priority)} className={styles.priorityImage} />
                          <p className={styles.prioritytext}>{task.priority}</p>

                          <img src={More} className={styles.more} onClick={() => toggleMoreActions(task._id)} />
                        </div>
                        {task.Assign_to && task.Assign_to !== 'undefined' && (
                          <div className={styles.assigned} >
                            <p className={styles.assignToText}>
                              {task.Assign_to.slice(0, 2).toUpperCase()}
                            </p>
                            <img src={Ellipse} className={styles.ellipse} />
                          </div>
                        )}

                        <div className={styles.bigcontainer}  >
                          {showMoreActions[task._id] && (
                            <div className={styles.moreDetails}>
                              <p className={styles.editpara} onClick={() => handleEditClick(task._id)}>Edit</p>
                              <p className={styles.sharepara} onClick={() => handleShareTask(task._id)}>Share</p>
                              <p className={styles.deletepara} onClick={() => handleDeleteClick(task._id)}>Delete</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.datatitle}> <TruncatedTitle title={task.title} /></div>
                        <div className={styles.row2}>
                          <p className={styles.checklisttext}>Checklist
                            <span className={styles.checknumbers} >({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</span></p>
                          <div className={styles.arrowdiv}>
                            <img src={Down_Arrow} className={styles.arrow} onClick={() => toggleChecklist(task._id)} />
                          </div>
                          <div className={styles.checklistInputarea}>
                            {showChecklists[task._id] && (
                              <div className={styles.checklistInput}>
                                {task.checklist.map((item, idx) => (
                                  <label key={idx} className={styles.radioLabel} onClick={() => handleLabelClick(task._id, idx)}>
                                    <input
                                      type="checkbox"
                                      className={styles.boxes}
                                      checked={item.checked}
                                      readOnly
                                    />
                                    <div className={styles.inputvalues}>{item.item}</div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.actionbuttons}>
                          {task.date && (
                            <button className={`${styles.actiondate} ${isDateInPast(task.date) ? styles.datePast : styles.dateFuture}`}>
                              {formatDate(task.date)}
                            </button>
                          )}

                          {task.status && (
                            <div className={styles.sectionchangebuttons1}>
                              <button className={styles.actionprogress} onClick={() => handleClick(task._id, 'in progress')} >PROGRESS</button>
                              <button className={styles.actiontodo} onClick={() => handleClick(task._id, 'to do')} >TO DO</button>
                              <button className={styles.actiondone} onClick={() => handleClick(task._id, 'done')} >DONE</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}

            </div>


            <div className={styles.section1}>
              <div className={styles.backlogSection}>
                <p className={styles.backlog}>To Do</p>
                <img src={Add} className={styles.add} onClick={handleAddClick} alt="Add" />
                <img src={Collapse} className={styles.collpaseicon} onClick={() => collapseAllChecklists("to do")} alt="Collapse" />
              </div>

              {Array.isArray(taskData) && taskData.length > 0 && (
                taskData.map((task, index) => {
                  const userEmail = email;
                  if (task.status === 'to do' && (task.userEmail === userEmail || task.Assign_to === userEmail)) {
                    return (
                      <div key={task._id} className={styles.tasksContainer}>
                        <div className={styles.row1}>
                          <img src={getPriorityImage(task.priority)} className={styles.priorityImage} />
                          <p className={styles.prioritytext}>{task.priority}</p>
                          <img src={More} className={styles.more} onClick={() => toggleMoreActions(task._id)} />
                        </div>
                        {task.Assign_to && task.Assign_to !== 'undefined' && (
                          <div className={styles.assigned} >
                            <p className={styles.assignToText}>
                              {task.Assign_to.slice(0, 2).toUpperCase()}
                            </p>
                            <img src={Ellipse} className={styles.ellipse} />
                          </div>
                        )}
                        <div className={styles.bigcontainer}>
                          {showMoreActions[task._id] && (
                            <div className={styles.moreDetails}>
                              <p className={styles.editpara} onClick={() => handleEditClick(task._id)}>Edit</p>
                              <p className={styles.sharepara} onClick={() => handleShareTask(task._id)}>Share</p>
                              <p className={styles.deletepara} onClick={() => handleDeleteClick(task._id)}>Delete</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.datatitle}> <TruncatedTitle title={task.title} /></div>
                        <div className={styles.row2}>
                          <p className={styles.checklisttext}>Checklist
                            <span className={styles.checknumbers} >({task.checklist.filter(item => item.checked).length}/{task.checklist.length}) </span></p>
                          <div className={styles.arrowdiv}>
                            <img src={Down_Arrow} className={styles.arrow} onClick={() => toggleChecklist(task._id)} />
                          </div>
                          <div className={styles.checklistInputarea}>
                            {showChecklists[task._id] && (
                              <div className={styles.checklistInput}>
                                {task.checklist.map((item, idx) => (
                                  <label key={idx} className={styles.radioLabel} onClick={() => handleLabelClick(task._id, idx)}>
                                    <input
                                      type="checkbox"
                                      className={styles.boxes}
                                      checked={item.checked}
                                      readOnly
                                    />
                                    <div className={styles.inputvalues}>{item.item}</div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.actionbuttons}>
                          {task.date && (
                            <button className={`${styles.actiondate} ${isDateInPast(task.date) ? styles.datePast : styles.dateFuture}`}>
                              {formatDate(task.date)}
                            </button>
                          )}

                          {task.status && (
                            <div className={styles.sectionchangebuttons}>
                              <button className={styles.actionbacklog} onClick={() => handleClick(task._id, 'backlog')} >BACKLOG</button>
                              <button className={styles.actionprogress} onClick={() => handleClick(task._id, 'in progress')} >PROGRESS</button>
                              <button className={styles.actiondone} onClick={() => handleClick(task._id, 'done')} >DONE</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>



            <div className={styles.section1}>
              <div className={styles.backlogSection}>
                <p className={styles.backlog}>In Progress</p>
                <img src={Collapse} className={styles.collpaseicon} onClick={() => collapseAllChecklists("in progress")} alt="Collapse" />
              </div>

              {Array.isArray(taskData) && taskData.length > 0 && (
                taskData.map((task, index) => {
                  const userEmail = email;
                  if (task.status === 'in progress' && (task.userEmail === userEmail || task.Assign_to === userEmail)) {
                    return (
                      <div key={task._id} className={styles.tasksContainer}>
                        <div className={styles.row1}>
                          <img src={getPriorityImage(task.priority)} className={styles.priorityImage} />
                          <p className={styles.prioritytext}>{task.priority}</p>
                          <img src={More} className={styles.more} onClick={() => toggleMoreActions(task._id)} />
                        </div>
                        {task.Assign_to && task.Assign_to !== 'undefined' && (
                          <div className={styles.assigned} >
                            <p className={styles.assignToText}>
                              {task.Assign_to.slice(0, 2).toUpperCase()}
                            </p>
                            <img src={Ellipse} className={styles.ellipse} />
                          </div>
                        )}
                        <div className={styles.bigcontainer}>
                          {showMoreActions[task._id] && (
                            <div className={styles.moreDetails}>
                              <p className={styles.editpara} onClick={() => handleEditClick(task._id)}>Edit</p>
                              <p className={styles.sharepara} onClick={() => handleShareTask(task._id)}>Share</p>
                              <p className={styles.deletepara} onClick={() => handleDeleteClick(task._id)}>Delete</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.datatitle}><TruncatedTitle title={task.title} /></div>
                        <div className={styles.row2}>
                          <p className={styles.checklisttext}>Checklist
                            <span className={styles.checknumbers}>({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</span>
                          </p>
                          <div className={styles.arrowdiv}>
                            <img src={Down_Arrow} className={styles.arrow} onClick={() => toggleChecklist(task._id)} />
                          </div>
                          <div className={styles.checklistInputarea}>
                            {showChecklists[task._id] && (
                              <div className={styles.checklistInput}>
                                {task.checklist.map((item, idx) => (
                                  <label key={idx} className={styles.radioLabel} onClick={() => handleLabelClick(task._id, idx)}>
                                    <input
                                      type="checkbox"
                                      className={styles.boxes}
                                      checked={item.checked}
                                      readOnly
                                    />
                                    <div className={styles.inputvalues}>{item.item}</div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.actionbuttons}>
                          {task.date && (
                            <button className={`${styles.actiondate} ${isDateInPast(task.date) ? styles.datePast : styles.dateFuture}`}>
                              {formatDate(task.date)}
                            </button>
                          )}

                          {task.status && (
                            <div className={styles.sectionchangebuttons2}>
                              <button className={styles.actionbacklog} onClick={() => handleClick(task._id, 'backlog')}>BACKLOG</button>
                              <button className={styles.actiontodo} onClick={() => handleClick(task._id, 'to do')}>TO DO</button>
                              <button className={styles.actiondone} onClick={() => handleClick(task._id, 'done')}>DONE</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>



            <div className={styles.section1}>
              <div className={styles.backlogSection}>
                <p className={styles.backlog}>Done</p>
                <img src={Collapse} className={styles.collpaseicon} onClick={() => collapseAllChecklists("done")} alt="Collapse" />
              </div>

              {Array.isArray(taskData) && taskData.length > 0 && (
                taskData.map((task, index) => {
                  const userEmail = email;
                  if (task.status === 'done' && (task.userEmail === userEmail || task.Assign_to === userEmail)) {
                    return (
                      <div key={task._id} className={styles.tasksContainer}>
                        <div className={styles.row1}>
                          <img src={getPriorityImage(task.priority)} className={styles.priorityImage} />
                          <p className={styles.prioritytext}>{task.priority}</p>
                          <img src={More} className={styles.more} onClick={() => toggleMoreActions(task._id)} />
                        </div>
                        {task.Assign_to && task.Assign_to !== 'undefined' && (
                          <div className={styles.assigned} >
                            <p className={styles.assignToText}>
                              {task.Assign_to.slice(0, 2).toUpperCase()}
                            </p>
                            <img src={Ellipse} className={styles.ellipse} />
                          </div>
                        )}
                        <div className={styles.bigcontainer}>
                          {showMoreActions[task._id] && (
                            <div className={styles.moreDetails}>
                              <p className={styles.editpara} onClick={() => handleEditClick(task._id)}>Edit</p>
                              <p className={styles.sharepara} onClick={() => handleShareTask(task._id)}>Share</p>
                              <p className={styles.deletepara} onClick={() => handleDeleteClick(task._id)}>Delete</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.datatitle}><TruncatedTitle title={task.title} /></div>
                        <div className={styles.row2}>
                          <p className={styles.checklisttext}>Checklist
                            <span className={styles.checknumbers}>({task.checklist.filter(item => item.checked).length}/{task.checklist.length})</span>
                          </p>
                          <div className={styles.arrowdiv}>
                            <img src={Down_Arrow} className={styles.arrow} onClick={() => toggleChecklist(task._id)} />
                          </div>
                          <div className={styles.checklistInputarea}>
                            {showChecklists[task._id] && (
                              <div className={styles.checklistInput}>
                                {task.checklist.map((item, idx) => (
                                  <label key={idx} className={styles.radioLabel} onClick={() => handleLabelClick(task._id, idx)}>
                                    <input
                                      type="checkbox"
                                      className={styles.boxes}
                                      checked={item.checked}
                                      readOnly
                                    />
                                    <div className={styles.inputvalues}>{item.item}</div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles.actionbuttons}>
                          {task.date && (
                            <button className={styles.completeddate}>{formatDate(task.date)}</button>
                          )}

                          {task.status && (
                            <div className={styles.sectionchangebuttons3}>
                              <button className={styles.actionbacklog} onClick={() => handleClick(task._id, 'backlog')}>BACKLOG</button>
                              <button className={styles.actionprogress} onClick={() => handleClick(task._id, 'in progress')}>PROGRESS</button>
                              <button className={styles.actiontodo} onClick={() => handleClick(task._id, 'to do')}>TO DO</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null; // Render nothing if the task doesn't match the done status
                })
              )}
            </div>



          </div>
        </div>
      </div>

      {isDeleteOverlayVisible && (
        <DeleteOverlayComponent
          taskId={selectedTaskId}
          onClose={() => setIsDeleteOverlayVisible(false)}
          handleDeleteConfirmation={handleDeleteConfirmation}
        />
      )}

      {isOverlayVisible && (
        <OverlayComponent
          taskData={taskData}
          selectedPriority={selectedPriority}
          inputSections={inputSections}
          selectedDate={selectedDate}
          handleChange={handleChange}
          handleHighPriorityClick={handleHighPriorityClick}
          handleModeratePriorityClick={handleModeratePriorityClick}
          handleLowPriorityClick={handleLowPriorityClick}
          handleAddInputSection={handleAddInputSection}
          handleRemoveInputSection={handleRemoveInputSection}
          handleInputChange={handleInputChange}
          setSelectedDate={setSelectedDate}
          handleCloseOverlay={handleCloseOverlay}
          setTaskData={setTaskData}
          handleSubmit={handleSubmit}
          setIsOverlayVisible={setIsOverlayVisible}
          handleEditClick={handleEditClick}
          userEmails={userEmails}
          setInputSections={setInputSections}
          email={email}
        />
      )}

      {showOverlay && (
        <LogoutOverlay
          onClose={() => setShowOverlay(false)}
          onConfirm={handleLogout}
        />
      )}

      {addOverlayVisible && <AddPeopleOverlay onClose={toggleAddOverlay} onAddEmailSuccess={handleAddEmailSuccess} />}


      {showLinkCopiedImage && (
        <img src={Link_Copied} alt="Link Copied" className={styles.linkCopiedImage} />
      )}
    </div>
  );
}

export default DashBoard;

