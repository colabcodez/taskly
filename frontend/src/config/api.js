// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://todo-list-eta-gold.vercel.app' // Updated with your actual Vercel URL
  : 'http://localhost:1000'; // Use localhost in development

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/v1/register`,
    SIGNIN: `${API_BASE_URL}/api/v1/signin`,
  },
  TASKS: {
    ADD: `${API_BASE_URL}/api/v2/addTask`,
    UPDATE: (id) => `${API_BASE_URL}/api/v2/updateTask/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/v2/deleteTask/${id}`,
    GET: (id) => `${API_BASE_URL}/api/v2/getTasks/${id}`,
    TOGGLE: (id) => `${API_BASE_URL}/api/v2/toggleTask/${id}`,
    CATEGORIES: (id) => `${API_BASE_URL}/api/v2/categories/${id}`,
    BY_PRIORITY: (id, priority) => `${API_BASE_URL}/api/v2/tasksByPriority/${id}/${priority}`,
    OVERDUE: (id) => `${API_BASE_URL}/api/v2/overdueTasks/${id}`,
    ADD_SUBTASK: (taskId) => `${API_BASE_URL}/api/v2/addSubtask/${taskId}`,
        TOGGLE_SUBTASK: (taskId, subtaskId) => `${API_BASE_URL}/api/v2/toggleSubtask/${taskId}/${subtaskId}`,
        DELETE_SUBTASK: (taskId, subtaskId) => `${API_BASE_URL}/api/v2/deleteSubtask/${taskId}/${subtaskId}`,
        CREATE_RECURRING: `${API_BASE_URL}/api/v2/createRecurringTask`,
        UPLOAD_ATTACHMENT: `${API_BASE_URL}/api/v2/uploadAttachment`,
        DOWNLOAD_ATTACHMENT: (attachmentId) => `${API_BASE_URL}/api/v2/downloadAttachment/${attachmentId}`,
        DELETE_ATTACHMENT: (attachmentId) => `${API_BASE_URL}/api/v2/deleteAttachment/${attachmentId}`,
  }
};

export default API_ENDPOINTS;
