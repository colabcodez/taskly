// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://todo-list-sage-omega.vercel.app' // Use Vercel deployment URL
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
  }
};

export default API_ENDPOINTS;
