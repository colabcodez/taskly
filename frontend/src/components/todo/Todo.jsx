import React, { useEffect, useState, useCallback } from "react";
import "./todo.css";
import TodoCards from "./TodoCards";
import Update from "./Update";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiPlus,
  FiSearch,
  FiInbox,
  FiCalendar,
  FiFilter,
  FiUser,
  FiCheckCircle,
  FiHome,
  FiList,
  FiChevronDown,
  FiHelpCircle,
  FiUsers,
  FiX,
  FiMenu,
  FiBell,
  FiGrid,
  FiSettings,
  FiMoreHorizontal,
  FiLogOut,
  FiArrowRight,
  FiStar,
  FiClock,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { authActions } from "../../store";
import { API_ENDPOINTS } from "../../config/api";

const Todo = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const history = useNavigate();

  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
  });
  const [Array, setArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [toUpdateArray, setToUpdateArray] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeSection, setActiveSection] = useState("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFiltersLabels, setShowFiltersLabels] = useState(false);

  const id = sessionStorage.getItem("id");

  const show = () => {
    document.getElementById("todo-update").style.display = "block";
  };

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async () => {
    if (Inputs.title.trim() === "" || Inputs.body.trim() === "") {
      toast.error("Title and body cannot be empty");
      return;
    }

    if (!id) {
      toast.error("Please sign in to save your tasks");
      return;
    }

        try {
          await axios.post(API_ENDPOINTS.TASKS.ADD, {
            title: Inputs.title.trim(),
            body: Inputs.body.trim(),
            id: id,
          });

        setInputs({ title: "", body: "" });
      setShowAddTask(false);
      toast.success("Task added successfully");
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const del = async (Cardid) => {
    if (!id) {
      toast.error("Please sign in first");
      return;
    }

    setIsDeleting(Cardid);
        try {
          await axios.delete(API_ENDPOINTS.TASKS.DELETE(Cardid), {
          data: { id: id },
          });

      toast.success("Task deleted successfully");
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleCompletion = async (taskId, currentStatus) => {
    if (!id) {
      toast.error("Please sign in first");
      return;
    }

        try {
          await axios.patch(API_ENDPOINTS.TASKS.TOGGLE(taskId), {
            completed: !currentStatus,
          });

      toast.success(`Task ${!currentStatus ? 'completed' : 'uncompleted'} successfully`);
      await fetchTasks();
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  const dis = (value) => {
    document.getElementById("todo-update").style.display = value;
  };

  const update = (value) => {
    setToUpdateArray(Array[value]);
    show();
  };

  const fetchTasks = useCallback(async () => {
    if (!id) {
      setArray([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS.GET(id));
      setArray(response.data.list || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) {
      history("/signin");
    } else {
      fetchTasks();
    }
  }, [isLoggedIn, fetchTasks, history]);

  const logout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
    history("/signin");
  };

  const filteredTasks = Array.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    
    switch (selectedFilter) {
      case "search":
        matchesFilter = true; // Show all tasks when searching
        break;
      case "inbox":
        matchesFilter = true; // All tasks are in inbox by default
        break;
      case "today":
        const today = new Date();
        const taskDate = new Date(task.createdAt);
        matchesFilter = taskDate.toDateString() === today.toDateString();
        break;
      case "upcoming":
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const taskDateUpcoming = new Date(task.createdAt);
        matchesFilter = taskDateUpcoming > new Date();
        break;
      case "important":
        matchesFilter = task.title.toLowerCase().includes("important") || 
                       task.body.toLowerCase().includes("important") ||
                       task.title.toLowerCase().includes("urgent") ||
                       task.body.toLowerCase().includes("urgent");
        break;
      case "completed":
        matchesFilter = task.completed || false;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigationClick = (section) => {
    setActiveSection(section);
    setSelectedFilter(section);
    if (section === 'filters') {
      setShowFiltersLabels(true);
    } else {
      setShowFiltersLabels(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateHeader = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} · Today · ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} · Tomorrow · ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    } else {
      return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} · ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }
  };

  const getTasksForDate = (date) => {
    return Array.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
          });
      };

  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  // Filters & Labels data
  const filters = [
    { id: 1, name: "Assigned to me", icon: "droplet", used: true },
    { id: 2, name: "Priority 1", icon: "droplet", used: true },
  ];

  const labels = [
    { id: 1, name: "read", icon: "tag", count: 2 },
  ];

  // Calculate task counts for each section
  const getTaskCount = (section) => {
    switch (section) {
      case "inbox":
        return Array.length;
      case "today":
        const today = new Date();
        return Array.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toDateString() === today.toDateString();
        }).length;
      case "upcoming":
        return Array.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate > new Date();
        }).length;
      case "important":
        return Array.filter(task => {
          return task.title.toLowerCase().includes("important") || 
                 task.body.toLowerCase().includes("important") ||
                 task.title.toLowerCase().includes("urgent") ||
                 task.body.toLowerCase().includes("urgent");
        }).length;
      case "completed":
        return Array.filter(task => task.completed || false).length;
      default:
        return 0;
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="todoist-app">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <Link to="/" className="logo">
              <FiCheckCircle className="logo-icon" />
              <span className="logo-text">Taskly</span>
            </Link>
          </div>
          
          <div className="header-center">
            <button className="dashboard-btn">
              <FiCheckCircle className="btn-icon" />
              Dashboard
            </button>
          </div>
          
          <div className="header-right">
            <div className="user-menu">
              <FiUser className="user-icon" />
              <span className="user-name">User</span>
              <FiArrowRight className="arrow-icon" />
            </div>
            <button className="logout-btn" onClick={logout}>
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-layout">
          {/* Left Sidebar - Navigation */}
          <aside className={`projects-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="user-profile">
                <div className="user-avatar">P</div>
                <div className="user-info">
                  <span className="user-name">Peachs</span>
                  <FiChevronDown className="dropdown-icon" />
                </div>
              </div>
              <div className="header-icons">
                <button className="header-icon">
                  <FiBell />
                </button>
                <button className="header-icon">
                  <FiGrid />
            </button>
          </div>
        </div>

            <div className="sidebar-content">
              <button className="add-task-btn" onClick={() => setShowAddTask(true)}>
                <FiPlus />
                Add task
              </button>

              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${activeSection === 'search' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('search')}
                >
                  <FiSearch />
                  <span>Search</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'inbox' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('inbox')}
                >
                  <FiInbox />
                  <span>Inbox</span>
                  <span className="badge">{getTaskCount('inbox')}</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'today' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('today')}
                >
                  <FiCalendar />
                  <span>Today</span>
                  <span className="badge">{getTaskCount('today')}</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'upcoming' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('upcoming')}
                >
                  <FiClock />
                  <span>Upcoming</span>
                  <span className="badge">{getTaskCount('upcoming')}</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'important' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('important')}
                >
                  <FiStar />
                  <span>Important</span>
                  <span className="badge">{getTaskCount('important')}</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'filters' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('filters')}
                >
                  <FiFilter />
                  <span>Filters & Labels</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'completed' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('completed')}
                >
                  <FiCheckCircle />
                  <span>Completed</span>
                  <span className="badge">{getTaskCount('completed')}</span>
                </button>
              </nav>

              <div className="sidebar-section">
                <h4>My Projects</h4>
                <button className="project-item">
                  <span className="project-hash">#</span>
                  <span>Home</span>
                  <span className="home-emoji">🏠</span>
                  <span className="badge">4</span>
                </button>
              </div>

              <div className="sidebar-footer">
                <button className="footer-item">
                  <FiUsers />
                  <span>Add a team</span>
                </button>
                <button className="footer-item">
                  <FiHelpCircle />
                  <span>Help & resources</span>
                  <span className="notification-dot"></span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={`content-area ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <div className="content-header">
              <button className="sidebar-toggle" onClick={toggleSidebar}>
                <FiMenu />
              </button>
            </div>
            
            <div className="content-body">
              {activeSection === 'search' && (
                <div className="search-section">
                  <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'filters' ? (
                <div className="filters-labels-view">
                  <div className="filters-section">
                    <div className="section-header">
                      <div className="section-title">
                        <FiChevronDown className="chevron-icon" />
                        <span>Filters</span>
                        <span className="used-counter">USED: 2/3</span>
                      </div>
                      <button className="add-button">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="section-content">
                      {filters.map((filter) => (
                        <div key={filter.id} className="filter-item">
                          <div className="filter-icon">
                            <div className="droplet-icon"></div>
                          </div>
                          <span className="filter-name">{filter.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="labels-section">
                    <div className="section-header">
                      <div className="section-title">
                        <FiChevronDown className="chevron-icon" />
                        <span>Labels</span>
                      </div>
                      <button className="add-button">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="section-content">
                      {labels.map((label) => (
                        <div key={label.id} className="label-item">
                          <div className="label-icon">
                            <div className="tag-icon"></div>
                          </div>
                          <span className="label-name">{label.name}</span>
                          <span className="label-count">{label.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeSection === 'upcoming' ? (
                <div className="upcoming-view">
                  <div className="upcoming-header">
                    <h1 className="upcoming-title">Upcoming</h1>
                    <div className="date-navigation">
                      <button className="nav-arrow">
                        <FiArrowRight className="rotate-180" />
                      </button>
                      <span className="today-label">Today</span>
                      <button className="nav-arrow">
                        <FiArrowRight />
                      </button>
                    </div>
                    <div className="date-bar">
                      {getUpcomingDays().slice(0, 7).map((date, index) => (
                        <div key={index} className={`date-item ${index === 0 ? 'active' : ''}`}>
                          <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="day-number">{date.getDate()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="upcoming-content">
                    {getUpcomingDays().map((date, index) => {
                      const dayTasks = getTasksForDate(date);
                      return (
                        <div key={index} className="day-section">
                          <div className="day-header">
                            <h3 className="day-title">{formatDateHeader(date)}</h3>
                          </div>
                          
                          {dayTasks.length > 0 ? (
                            <div className="day-tasks">
                              {dayTasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="upcoming-task">
                                  <div className="task-checkbox">
                                    <input type="checkbox" />
                                  </div>
                                  <div className="task-content">
                                    <div className="task-title">{task.title}</div>
                                    {task.body && <div className="task-subtitle">{task.body}</div>}
                                  </div>
                                  <div className="task-project">
                                    <FiInbox className="project-icon" />
                                    <span>Inbox</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          
                          <button className="add-task-day-btn" onClick={() => setShowAddTask(true)}>
                            <FiPlus />
                            Add task
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>Loading tasks...</span>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-content">
                    <FiCheckCircle className="empty-icon" />
                    <h3>
                      {activeSection === 'search' ? 'No tasks found' : 
                       activeSection === 'today' ? 'No tasks for today' :
                       activeSection === 'important' ? 'No important tasks' :
                       activeSection === 'completed' ? 'No completed tasks' :
                       'No tasks yet'}
                    </h3>
                    <p>
                      {activeSection === 'search' ? 'Try a different search term' :
                       activeSection === 'today' ? 'Add a task for today' :
                       activeSection === 'important' ? 'Add an important task' :
                       activeSection === 'completed' ? 'Complete some tasks first' :
                       'Create your first task to get started'}
                    </p>
                    <button className="add-task-btn" onClick={() => setShowAddTask(true)}>
                      <FiPlus />
                      {activeSection === 'search' ? 'Add a task' : 'Add your first task'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tasks-container">
                  <div className="tasks-header">
                    <h2>
                      {activeSection === 'search' ? 'Search Results' :
                       activeSection === 'inbox' ? 'Inbox' :
                       activeSection === 'today' ? 'Today' :
                       activeSection === 'important' ? 'Important' :
                       activeSection === 'completed' ? 'Completed' :
                       'Your Tasks'}
                    </h2>
                    <button className="add-task-btn" onClick={() => setShowAddTask(true)}>
                      <FiPlus />
                      Add Task
                    </button>
                  </div>
                  
                  <div className="tasks-list">
                    {filteredTasks.map((item, index) => (
                    <TodoCards
                        key={item._id || index}
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      delid={del}
                      display={dis}
                      updateId={index}
                      toBeUpdate={update}
                        isDeleting={isDeleting === item._id}
                        completed={item.completed || false}
                        onToggleCompletion={toggleCompletion}
                    />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Task</h3>
              <button className="close-btn" onClick={() => setShowAddTask(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={Inputs.title}
                onChange={change}
                className="task-input"
              />
              <textarea
                name="body"
                placeholder="Task description"
                value={Inputs.body}
                onChange={change}
                className="task-textarea"
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddTask(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={submit}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {toUpdateArray && (
        <div className="todo-update" id="todo-update">
          <Update
            display={dis}
            update={toUpdateArray}
          />
        </div>
      )}
    </>
  );
};

export default Todo;