# Taskly - Modern Todo List Webapp

A modern, responsive todo list web application inspired by Todoist, built with React and Node.js.

## Features

### 🎨 Modern Design
- Clean, minimalist interface inspired by Todoist
- Red color scheme matching Todoist's branding
- Responsive design for mobile, tablet, and desktop
- Smooth animations and transitions

### 📱 Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Touch-friendly interface
- Optimized for all screen sizes

### ✅ Task Management
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Set task priorities (Low, Medium, High, Urgent)
- Add due dates and categories
- Tag system for organization
- Rich text descriptions

### 🔍 Advanced Features
- Search functionality
- Filter by date, priority, and status
- Today, Upcoming, and Important views
- Subtasks support
- File attachments
- Recurring tasks
- Task templates
- Keyboard shortcuts

### 🎯 Organization
- Project-based organization
- Team collaboration features
- Advanced filtering options
- Custom views and saved filters
- Drag and drop task reordering

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **React Quill** - Rich text editor
- **React Toastify** - Notifications
- **@dnd-kit** - Drag and drop functionality

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskly
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:
```bash
# Create .env file in the root directory
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development servers:

Backend:
```bash
npm start
```

Frontend (in a new terminal):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
taskly/
├── api/                 # API routes
├── conn/               # Database connection
├── models/             # Database models
├── routes/             # Express routes
├── frontend/           # React application
│   ├── public/         # Static assets
│   └── src/
│       ├── components/ # React components
│       ├── contexts/   # React contexts
│       ├── hooks/      # Custom hooks
│       ├── store/      # Redux store
│       └── config/     # Configuration
├── app.js              # Express app
└── package.json        # Dependencies
```

## Key Components

### Landing Page
- Modern hero section with task input demo
- Feature showcase
- Call-to-action buttons
- Responsive design

### Dashboard
- Sidebar navigation with project organization
- Main content area with task lists
- Search and filtering capabilities
- Mobile-responsive design

### Task Management
- Create/edit task modal
- Rich text descriptions
- Priority and due date settings
- Tag and category organization
- Subtask support

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login

### Tasks
- `GET /api/tasks/:userId` - Get user tasks
- `POST /api/tasks/add` - Create new task
- `DELETE /api/tasks/delete/:taskId` - Delete task
- `PATCH /api/tasks/toggle/:taskId` - Toggle task completion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Todoist's design and functionality
- Built with modern web technologies
- Focus on user experience and accessibility