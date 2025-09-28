# TodoList Deployment Guide

## Issues Fixed for Deployment

### 1. API Configuration Issues
- **Problem**: Hardcoded incorrect deployment URL
- **Solution**: Updated to use environment variables

### 2. CORS Configuration
- **Problem**: CORS not configured for production domains
- **Solution**: Updated CORS to use environment variables

### 3. Environment Variables Setup

#### For Vercel Backend Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

#### For Vercel Frontend Deployment:
1. Go to your frontend Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variable:

```
REACT_APP_API_URL=https://your-backend-app.vercel.app
```

### 4. Database Setup
- **Required**: MongoDB Atlas database
- **Steps**:
  1. Create a MongoDB Atlas account
  2. Create a new cluster
  3. Get the connection string
  4. Add it as MONGODB_URI environment variable

### 5. Deployment Steps

#### Backend Deployment:
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

#### Frontend Deployment:
1. Update the API URL in `frontend/src/config/api.js` with your actual backend URL
2. Set REACT_APP_API_URL environment variable in Vercel
3. Deploy

### 6. Testing Deployment
After deployment, test the signup functionality:
1. Visit your frontend URL
2. Try to create a new account
3. Check browser console for any errors
4. Verify API calls are reaching the correct backend URL

### 7. Common Issues and Solutions

#### Issue: "Network Error" or "CORS Error"
- **Solution**: Update CORS configuration in `app.js` with correct frontend URL

#### Issue: "API not found" or "404 Error"
- **Solution**: Verify the API URL in `frontend/src/config/api.js` matches your backend deployment URL

#### Issue: "Database connection failed"
- **Solution**: Check MongoDB Atlas connection string and network access settings

### 8. Environment Variables Reference

#### Backend (.env or Vercel Environment Variables):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

#### Frontend (Vercel Environment Variables):
```
REACT_APP_API_URL=https://your-backend-app.vercel.app
```

### 9. URLs to Update
Replace the following placeholders with your actual deployment URLs:
- `https://your-backend-app.vercel.app` - Your backend Vercel URL
- `https://your-frontend-app.vercel.app` - Your frontend Vercel URL
