import React, { useEffect, useState, useCallback } from "react";
import "./todo.css";
import TodoCards from "./TodoCards";
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
  FiChevronDown,
  FiHelpCircle,
  FiUsers,
  FiX,
  FiMenu,
  FiBell,
  FiGrid,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiStar,
  FiRepeat,
  FiFileText,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { authActions } from "../../store";
import { API_ENDPOINTS } from "../../config/api";
// import ThemeToggle from "../theme/ThemeToggle";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
// import { useTheme } from "../../contexts/ThemeContext";
import KeyboardShortcuts from "../help/KeyboardShortcuts";
import DragDropList from "../dragdrop/DragDropList";
import RecurringTaskModal from "./RecurringTaskModal";
import RichTextEditor from "./RichTextEditor";
// import FileAttachments from "./FileAttachments";
import TaskTemplates from "./TaskTemplates";
import AdvancedFilters from "./AdvancedFilters";
import Notifications from "./Notifications";

const Todo = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const history = useNavigate();
  // const { toggleTheme } = useTheme();

  const [Inputs, setInputs] = useState({
    title: "",
    body: "",
    priority: "medium",
    dueDate: "",
    category: "general",
    tags: "",
  });
  const [Array, setArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeSection, setActiveSection] = useState("today");
  // const [showFiltersLabels, setShowFiltersLabels] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [savedViews, setSavedViews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  const id = sessionStorage.getItem("id");


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
          const tagsArray = Inputs.tags ? Inputs.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
          
          await axios.post(API_ENDPOINTS.TASKS.ADD, {
            title: Inputs.title.trim(),
            body: Inputs.body.trim(),
            id: id,
            priority: Inputs.priority,
            dueDate: Inputs.dueDate,
            category: Inputs.category,
            tags: tagsArray,
          });

        setInputs({ 
          title: "", 
          body: "", 
          priority: "medium", 
          dueDate: "", 
          category: "general", 
          tags: "" 
        });
      setShowAddTask(false);
      toast.success("Task added successfully");
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  const del = async (Cardid) => {
    console.log("Delete function called with ID:", Cardid);
    if (!id) {
      toast.error("Please sign in first");
      return;
    }

    setIsDeleting(Cardid);
        try {
      console.log("Attempting to delete task:", Cardid);
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
    console.log("Toggle completion called with:", taskId, currentStatus);
    if (!id) {
      toast.error("Please sign in first");
      return;
    }

        try {
      console.log("Attempting to toggle task completion:", taskId);
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

  // Subtask functions
  const addSubtask = async (taskId, text) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS.ADD_SUBTASK(taskId), { text });
      
      if (response.status === 200) {
        // Update the task in the local state
        setArray(prevArray => 
          prevArray.map(task => 
            task._id === taskId 
              ? { ...task, subtasks: [...(task.subtasks || []), response.data.subtask] }
              : task
          )
        );
        
        toast.success("Subtask added successfully");
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast.error(error.response?.data?.message || "Failed to add subtask");
    }
  };

  const toggleSubtask = async (taskId, subtaskId, completed) => {
    try {
      const response = await axios.put(API_ENDPOINTS.TASKS.TOGGLE_SUBTASK(taskId, subtaskId));
      
      if (response.status === 200) {
        // Update the subtask in the local state
        setArray(prevArray => 
          prevArray.map(task => 
            task._id === taskId 
              ? { 
                  ...task, 
                  subtasks: (task.subtasks || []).map(subtask => 
                    subtask.id === subtaskId 
                      ? { ...subtask, completed: !completed }
                      : subtask
                  )
                }
              : task
          )
        );
        
        toast.success(completed ? "Subtask marked as incomplete" : "Subtask marked as complete");
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
      toast.error(error.response?.data?.message || "Failed to update subtask");
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const response = await axios.delete(API_ENDPOINTS.TASKS.DELETE_SUBTASK(taskId, subtaskId));
      
      if (response.status === 200) {
        // Remove the subtask from the local state
        setArray(prevArray => 
          prevArray.map(task => 
            task._id === taskId 
              ? { 
                  ...task, 
                  subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId)
                }
              : task
          )
        );
        
        toast.success("Subtask deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error(error.response?.data?.message || "Failed to delete subtask");
    }
  };

  // Recurring task functions
  const createRecurringTask = async (taskData) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS.CREATE_RECURRING, {
        ...taskData,
        user: id
      });
      
      if (response.status === 200) {
        // Add the new recurring task to the local state
        setArray(prevArray => [...prevArray, response.data.task]);
        toast.success("Recurring task created successfully");
        setShowRecurringModal(false);
      }
    } catch (error) {
      console.error("Error creating recurring task:", error);
      toast.error(error.response?.data?.message || "Failed to create recurring task");
    }
  };

  // File attachment functions
  const addAttachment = (attachment) => {
    setArray(prevArray => 
      prevArray.map(task => 
        task._id === attachment.taskId 
          ? { 
              ...task, 
              attachments: [...(task.attachments || []), attachment]
            }
          : task
      )
    );
  };

  const deleteAttachment = (attachmentId) => {
    setArray(prevArray => 
      prevArray.map(task => 
        task._id === attachmentId 
          ? { 
              ...task, 
              attachments: (task.attachments || []).filter(att => att.id !== attachmentId)
            }
          : task
      )
    );
  };

  // Template functions
  const applyTemplate = async (template) => {
    try {
      const tasks = template.tasks.map(task => ({
        title: task.title,
        body: '',
        user: id,
        priority: task.priority,
        category: template.category,
        tags: [],
        completed: false
      }));

      for (const taskData of tasks) {
        const response = await axios.post(API_ENDPOINTS.TASKS.ADD, taskData);
        if (response.status === 200) {
          setArray(prevArray => [...prevArray, response.data.list]);
        }
      }

      toast.success(`Created ${tasks.length} tasks from template`);
      setShowTemplatesModal(false);
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to create tasks from template");
    }
  };

  const createFromTemplate = (template) => {
    // Set the first task from template as the current task
    const firstTask = template.tasks[0];
    setInputs({
      title: firstTask.title,
      body: '',
      priority: firstTask.priority,
      dueDate: '',
      category: template.category,
      tags: []
    });
    setShowAddTask(true);
    setShowTemplatesModal(false);
  };

  // Advanced filtering functions
  const applyAdvancedFilters = (filters) => {
    setCurrentFilters(filters);
    // The filtering logic will be applied in the filteredTasks calculation
  };

  const saveView = (view) => {
    setSavedViews(prev => [...prev, view]);
    toast.success("View saved successfully");
  };

  const loadView = (view) => {
    setCurrentFilters(view.filters);
    toast.success(`Loaded view: ${view.name}`);
  };

  const deleteView = (viewId) => {
    setSavedViews(prev => prev.filter(view => view.id !== viewId));
    toast.success("View deleted successfully");
  };

  // Notification functions
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  // const addNotification = (notification) => {
  //   const newNotification = {
  //     id: Date.now().toString(),
  //     ...notification,
  //     read: false,
  //     createdAt: new Date()
  //   };
  //   setNotifications(prev => [newNotification, ...prev]);
  // };

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
      case "overdue":
        const now = new Date();
        matchesFilter = task.dueDate && new Date(task.dueDate) < now && !task.completed;
        break;
      case "high-priority":
        matchesFilter = task.priority === 'high' || task.priority === 'urgent';
        break;
      default:
        matchesFilter = true;
    }
    
    // Apply advanced filters
    let matchesAdvancedFilters = true;
    
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      matchesAdvancedFilters = matchesAdvancedFilters && (
        task.title.toLowerCase().includes(searchTerm) ||
        task.body.toLowerCase().includes(searchTerm) ||
        (task.category && task.category.toLowerCase().includes(searchTerm)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }
    
    if (currentFilters.priority) {
      matchesAdvancedFilters = matchesAdvancedFilters && task.priority === currentFilters.priority;
    }
    
    if (currentFilters.category) {
      matchesAdvancedFilters = matchesAdvancedFilters && (
        task.category && task.category.toLowerCase().includes(currentFilters.category.toLowerCase())
      );
    }
    
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      matchesAdvancedFilters = matchesAdvancedFilters && (
        task.tags && currentFilters.tags.some(tag => 
          task.tags.some(taskTag => taskTag.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }
    
    if (currentFilters.dueDate && (currentFilters.dueDate.start || currentFilters.dueDate.end)) {
      if (!task.dueDate) {
        matchesAdvancedFilters = false;
      } else {
        const taskDueDate = new Date(task.dueDate);
        const startDate = currentFilters.dueDate.start ? new Date(currentFilters.dueDate.start) : null;
        const endDate = currentFilters.dueDate.end ? new Date(currentFilters.dueDate.end) : null;
        
        if (startDate && taskDueDate < startDate) matchesAdvancedFilters = false;
        if (endDate && taskDueDate > endDate) matchesAdvancedFilters = false;
      }
    }
    
    if (currentFilters.createdDate && (currentFilters.createdDate.start || currentFilters.createdDate.end)) {
      const taskCreatedDate = new Date(task.createdAt);
      const startDate = currentFilters.createdDate.start ? new Date(currentFilters.createdDate.start) : null;
      const endDate = currentFilters.createdDate.end ? new Date(currentFilters.createdDate.end) : null;
      
      if (startDate && taskCreatedDate < startDate) matchesAdvancedFilters = false;
      if (endDate && taskCreatedDate > endDate) matchesAdvancedFilters = false;
    }
    
    if (currentFilters.completed === "completed") {
      matchesAdvancedFilters = matchesAdvancedFilters && task.completed;
    } else if (currentFilters.completed === "pending") {
      matchesAdvancedFilters = matchesAdvancedFilters && !task.completed;
    }
    
    return matchesSearch && matchesFilter && matchesAdvancedFilters;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigationClick = (section) => {
    setActiveSection(section);
    setSelectedFilter(section);
    // if (section === 'filters') {
    //   setShowFiltersLabels(true);
    // } else {
    //   setShowFiltersLabels(false);
    // }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      case "overdue":
        const now = new Date();
        return Array.filter(task => task.dueDate && new Date(task.dueDate) < now && !task.completed).length;
      case "high-priority":
        return Array.filter(task => task.priority === 'high' || task.priority === 'urgent').length;
      default:
        return 0;
    }
  };

  // Keyboard shortcuts
  const shortcuts = [
    {
      keys: 'ctrl+n',
      action: () => setShowAddTask(true),
      description: 'Add new task'
    },
    {
      keys: 'ctrl+/',
      action: () => setActiveSection('search'),
      description: 'Focus search'
    },
    {
      keys: 'ctrl+1',
      action: () => handleNavigationClick('inbox'),
      description: 'Go to Inbox'
    },
    {
      keys: 'ctrl+2',
      action: () => handleNavigationClick('today'),
      description: 'Go to Today'
    },
    {
      keys: 'ctrl+3',
      action: () => handleNavigationClick('upcoming'),
      description: 'Go to Upcoming'
    },
    {
      keys: 'ctrl+4',
      action: () => handleNavigationClick('important'),
      description: 'Go to Important'
    },
    {
      keys: 'ctrl+5',
      action: () => handleNavigationClick('completed'),
      description: 'Go to Completed'
    },
    // {
    //   keys: 'ctrl+shift+t',
    //   action: () => toggleTheme(),
    //   description: 'Toggle theme'
    // },
    {
      keys: 'escape',
      action: () => {
        setShowAddTask(false);
        setShowKeyboardShortcuts(false);
      },
      description: 'Close modals'
    },
    {
      keys: 'ctrl+?',
      action: () => setShowKeyboardShortcuts(true),
      description: 'Show keyboard shortcuts'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  const handleReorder = (reorderedItems) => {
    setArray(reorderedItems);
    // Here you could also save the new order to the backend
    // For now, we'll just update the local state
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
            {/* <ThemeToggle /> */}
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
                <button 
                  className={`nav-item ${activeSection === 'overdue' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('overdue')}
                >
                  <FiClock />
                  <span>Overdue</span>
                  <span className="badge">{getTaskCount('overdue')}</span>
                </button>
                <button 
                  className={`nav-item ${activeSection === 'high-priority' ? 'active' : ''}`}
                  onClick={() => handleNavigationClick('high-priority')}
                >
                  <FiStar />
                  <span>High Priority</span>
                  <span className="badge">{getTaskCount('high-priority')}</span>
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
                <button className="footer-item" onClick={() => setShowKeyboardShortcuts(true)}>
                  <FiHelpCircle />
                  <span>Keyboard Shortcuts</span>
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
                       activeSection === 'overdue' ? 'Overdue Tasks' :
                       activeSection === 'high-priority' ? 'High Priority Tasks' :
                       'Your Tasks'}
                    </h2>
                    <div className="add-task-buttons">
                    <button className="add-task-btn" onClick={() => setShowAddTask(true)}>
                      <FiPlus />
                      Add Task
                    </button>
                      <button className="add-recurring-btn" onClick={() => setShowRecurringModal(true)}>
                        <FiRepeat />
                        Recurring
                      </button>
                      <button className="add-template-btn" onClick={() => setShowTemplatesModal(true)}>
                        <FiFileText />
                        Templates
                      </button>
                      <button className="advanced-filters-btn" onClick={() => setShowAdvancedFilters(true)}>
                        <FiFilter />
                        Filters
                      </button>
                      <button className="notifications-btn" onClick={() => setShowNotifications(true)}>
                        <FiBell />
                        Notifications
                        {notifications.filter(n => !n.read).length > 0 && (
                          <span className="notification-badge">
                            {notifications.filter(n => !n.read).length}
                          </span>
                        )}
                    </button>
                    </div>
                  </div>
                  
                  <div className="tasks-list">
                    <DragDropList
                      items={filteredTasks}
                      onReorder={handleReorder}
                      disabled={loading}
                    >
                      {(item, index) => (
                    <TodoCards
                        key={item._id || index}
                      title={item.title}
                      body={item.body}
                      id={item._id}
                      delid={del}
                        isDeleting={isDeleting === item._id}
                        completed={item.completed || false}
                        onToggleCompletion={toggleCompletion}
                          priority={item.priority || 'medium'}
                          dueDate={item.dueDate}
                          category={item.category || 'general'}
                          tags={item.tags || []}
                          subtasks={item.subtasks || []}
                          onAddSubtask={addSubtask}
                          onToggleSubtask={toggleSubtask}
                          onDeleteSubtask={deleteSubtask}
                          attachments={item.attachments || []}
                          onAddAttachment={addAttachment}
                          onDeleteAttachment={deleteAttachment}
                        />
                      )}
                    </DragDropList>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Task Modal - Modern Design */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content modern-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Task</h3>
              <button className="close-btn" onClick={() => setShowAddTask(false)}>
                <FiX />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Task Title Input */}
              <div className="task-title-section">
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={Inputs.title}
                  onChange={change}
                  className="modern-task-input"
                  autoFocus
                />
              </div>

              {/* Task Description */}
              <div className="task-description-section">
                <RichTextEditor
                  value={Inputs.body}
                  onChange={(content) => setInputs(prev => ({ ...prev, body: content }))}
                  placeholder="Description"
                  height="100px"
                />
              </div>

              {/* Task Details Section */}
              <div className="task-details-section">
                {/* Row 1 */}
                <div className="details-row">
                  <div className="detail-group">
                    <label className="detail-label">DUE DATE</label>
                    <div className="date-picker-container">
                      <input
                        type="date"
                        name="dueDate"
                        value={Inputs.dueDate}
                        onChange={change}
                        className="detail-date-picker"
                      />
                      <FiCalendar className="date-icon" />
                    </div>
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">PRIORITY</label>
                    <select
                      name="priority"
                      value={Inputs.priority}
                      onChange={change}
                      className="detail-priority-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="details-row">
                  <div className="detail-group">
                    <label className="detail-label">CATEGORY</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="general"
                      value={Inputs.category}
                      onChange={change}
                      className="detail-category-input"
                    />
                  </div>

                  <div className="detail-group">
                    <label className="detail-label">TAGS</label>
                    <input
                      type="text"
                      name="tags"
                      placeholder="e.g., urgent, meeting"
                      value={Inputs.tags}
                      onChange={change}
                      className="detail-tags-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer reference-footer">
              <div className="footer-left">
                <select className="reference-list-selector">
                  <option value="inbox">Inbox</option>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              <div className="footer-right">
                <button className="reference-cancel-btn" onClick={() => setShowAddTask(false)}>
                  Cancel
                </button>
                <button className="reference-add-btn" onClick={submit}>
                  Add task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        shortcuts={shortcuts}
      />

      {/* Recurring Task Modal */}
      <RecurringTaskModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSubmit={createRecurringTask}
      />

      {/* Task Templates Modal */}
      <TaskTemplates
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onApplyTemplate={applyTemplate}
        onCreateFromTemplate={createFromTemplate}
      />

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApplyFilters={applyAdvancedFilters}
        onSaveView={saveView}
        savedViews={savedViews}
        onLoadView={loadView}
        onDeleteView={deleteView}
      />

      {/* Notifications Modal */}
      <Notifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearAllNotifications}
      />
    </>
  );
};

export default Todo;