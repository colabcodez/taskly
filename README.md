# Taskly - Task Management Application

A full-stack task management application built with React frontend and Express.js backend.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Task Management**: Create, read, update, and delete tasks
- **Drag & Drop**: Reorder tasks with drag and drop functionality
- **Rich Text Editor**: Create detailed task descriptions with rich text formatting
- **File Attachments**: Attach files to tasks
- **Subtasks**: Break down tasks into smaller subtasks
- **Recurring Tasks**: Set up recurring tasks with different frequencies
- **Task Templates**: Create and use task templates for common workflows
- **Advanced Filters**: Filter tasks by various criteria
- **Notifications**: Get notified about task deadlines and updates
- **Dark/Light Theme**: Toggle between dark and light themes
- **Keyboard Shortcuts**: Use keyboard shortcuts for quick actions

## Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- React Quill for rich text editing
- @dnd-kit for drag and drop functionality
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- CORS for cross-origin requests
- Multer for file uploads

## Project Structure

```
Taskly/
├── api/                    # API endpoints
├── conn/                   # Database connection
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── store/         # Redux store
├── models/                # MongoDB models
├── routes/                # Express routes
└── app.js                 # Main server file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Shree-ux/Taskly.git
cd Taskly
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Set up environment variables:
Create a `.env` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
PORT=1000
```

5. Start the backend server:
```bash
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:1000

## API Endpoints

### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/signin` - User login

### Tasks
- `GET /api/v2/tasks` - Get all tasks
- `POST /api/v2/tasks` - Create a new task
- `PUT /api/v2/tasks/:id` - Update a task
- `DELETE /api/v2/tasks/:id` - Delete a task

## Deployment

The project is configured for deployment on Vercel with the included `vercel.json` configuration file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## License

This project is licensed under the ISC License.
