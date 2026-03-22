# Elite Event Planner Website - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file has been created with default values. You can modify these if needed:

```env
MONGODB_URI=mongodb://localhost:27017/elite-event-planner
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

### 3. Database Setup
Make sure MongoDB is running on your system, then run:

```bash
# Create admin user and demo data
node setup-admin.js

# Test the setup
node test-server.js
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Access the Website
- **Main Website**: http://localhost:3000
- **Registration**: http://localhost:3000/register.html
- **Login**: http://localhost:3000/login.html
- **Admin Panel**: http://localhost:3000/admin.html

## 🔐 Default Login Credentials

### Admin Access
- **Email**: admin@nextera.com
- **Password**: admin123

### Demo User
- **Email**: demo@nextera.com
- **Password**: demo123

## 🛠️ Features Fixed

### ✅ Registration System
- **Online Mode**: Connects to MongoDB database
- **Offline Mode**: Falls back to localStorage if server is down
- **Form Validation**: Real-time validation with password strength indicator
- **Error Handling**: Graceful error handling with user feedback

### ✅ Login System
- **Online Mode**: JWT-based authentication
- **Offline Mode**: Local storage fallback for registered users
- **Security**: Password validation and user status checking
- **User Feedback**: Clear success/error messages

### ✅ Admin Panel
- **Authentication**: Secure admin login with role-based access
- **Dashboard**: Overview of events, contacts, and users
- **Data Management**: View and manage all website data
- **Offline Support**: Works even when server is down (with fallback credentials)

## 🔧 Troubleshooting

### Server Won't Start
1. Check if MongoDB is running: `mongod --version`
2. Verify .env file exists with correct values
3. Run `npm install` to ensure all dependencies are installed
4. Check port 3000 is not in use by another application

### Database Connection Issues
1. Make sure MongoDB is installed and running
2. Check MONGODB_URI in .env file
3. Try connecting manually: `mongosh mongodb://localhost:27017/elite-event-planner`

### Authentication Problems
1. Run `node setup-admin.js` to create admin user
2. Check JWT_SECRET is set in .env file
3. Clear browser localStorage if experiencing token issues

### Registration/Login Not Working
1. Check browser console for errors
2. Verify server is running on port 3000
3. Test with offline mode (fallback functionality)

## 📁 Project Structure

```
Elite_event_planner_website/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── *.html             # HTML pages
│   └── images/            # Static images
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   ├── events.js          # Event management
│   ├── contact.js         # Contact form handling
│   └── testimonials.js    # Testimonial management
├── models/                # Database models
│   └── User.js            # User schema
├── middleware/            # Express middleware
│   └── auth.js            # Authentication middleware
├── server.js              # Main server file
├── setup-admin.js         # Admin user setup script
├── test-server.js         # Server testing script
├── .env                   # Environment variables
└── package.json           # Dependencies and scripts
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Only
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/users/:id/status` - Update user status

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Contact
- `GET /api/contact` - Get contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id` - Update contact status

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production` in .env
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas or production database
4. Use PM2 or similar process manager
5. Set up reverse proxy (nginx)

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elite-event-planner
JWT_SECRET=your-very-strong-secret-key-here
JWT_EXPIRES_IN=24h
PORT=3000
```

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check the .env file configuration

## 🎉 Success!

Once everything is set up correctly, you should be able to:
- Register new users on the website
- Login with existing credentials
- Access the admin panel
- Manage events, contacts, and users
- Use the system both online and offline

The system now includes robust error handling and fallback functionality to ensure it works even when the server is temporarily unavailable.








