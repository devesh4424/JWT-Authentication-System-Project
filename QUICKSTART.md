# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (local or use MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- OpenAI API Key - [Get it here](https://platform.openai.com/api-keys)
- Git (optional)

## Step 1: Clone/Download the Project

If you haven't already, ensure all project files are in place.

## Step 2: Set Up Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example` if it exists, or create manually):
```bash
# Copy the template
cp .env.example .env
# OR create .env file manually
```

4. Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
OPENAI_API_KEY=sk-your-openai-api-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

5. Start MongoDB (if using local MongoDB):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

6. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The backend should now be running on `http://localhost:5000`

## Step 3: Set Up Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
# Copy the template
cp .env.example .env
# OR create .env file manually
```

4. Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the React development server:
```bash
npm start
```

The frontend should now open in your browser at `http://localhost:3000`

## Step 4: Test the Application

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Fill in name, email, and password
   - You'll see AI-powered password strength feedback

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Use your registered credentials
   - On error, you'll see AI-powered error explanations

3. **View Profile:**
   - After login, you'll be redirected to your profile
   - Or navigate to `http://localhost:3000/profile`

4. **Test Password Reset:**
   - Click "Forgot password?" on login page
   - Enter your email
   - Check your email for reset link
   - Click the link and reset your password

## Important Notes

### MongoDB Setup
- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`

### OpenAI API Key
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- The system will work without it, but ChatGPT features won't function
- Without API key, you'll get default responses

### Email Configuration (Gmail)
1. Enable 2-Step Verification on your Google account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in `EMAIL_PASS`

### Without Email Setup
- Password reset functionality won't work
- Other features will function normally
- You can test the rest of the application

## Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongosh` or check service status
- Verify `MONGODB_URI` in `.env` is correct
- For Atlas, ensure your IP is whitelisted

### "ChatGPT API Error"
- Verify your `OPENAI_API_KEY` is correct
- Check your OpenAI account has credits
- The app will continue to work with default responses

### "Email not sending"
- For Gmail, use App Password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Verify SMTP settings are correct

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check both servers are running

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI to match your brand
- Add more features as needed

## Support

If you encounter any issues:
1. Check the [README.md](README.md) troubleshooting section
2. Verify all environment variables are set correctly
3. Check server logs for error messages
4. Ensure all dependencies are installed

Happy coding! 🚀

