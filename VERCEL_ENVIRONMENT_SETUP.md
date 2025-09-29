# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel dashboard under Settings → Environment Variables:

### For Frontend (React App)
```
REACT_APP_API_URL = https://todo-list-eta-gold.vercel.app
```

### For Backend (Node.js App)
```
FRONTEND_URL = https://todo-list-eta-gold.vercel.app
MONGODB_URI = your-mongodb-connection-string
NODE_ENV = production
```

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the correct value
5. Make sure to set them for **Production** environment
6. Redeploy your application after adding variables

## Testing Your Setup:

1. **Test Backend API**: Visit `https://todo-list-eta-gold.vercel.app/api/v1/test`
   - Should return: `{"message": "Auth API is working", "timestamp": "..."}`

2. **Test Frontend**: Visit your frontend URL and try the signup form
   - Check browser console for any errors
   - Use the "Test API Connection" button in development mode

## Common Issues:

- **Network Error**: Usually means wrong API URL or CORS issues
- **404 Error**: Backend not deployed or wrong endpoint
- **CORS Error**: Frontend URL not allowed in backend CORS settings
- **500 Error**: Database connection or server error

## Quick Fixes:

1. Make sure both frontend and backend are deployed to Vercel
2. Set all environment variables correctly
3. Check that your MongoDB connection string is valid
4. Redeploy after making changes
