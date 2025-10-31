# TaskFlow Frontend - Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher (comes with Node.js)
- **Git**: For version control

### Installation & Running

#### **Option 1: Direct npm commands**

```bash
# Navigate to frontend directory
cd frontend

# Install all dependencies (first time only)
npm install

# Start the development server
npm start
```

The application will automatically open in your browser at **http://localhost:3000**

#### **Option 2: Using npm scripts**

```bash
# From the root directory (SRS)
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Or run in production mode
npm run build
npm install -g serve
serve -s build
```

## 🔑 Login Credentials

Once the application starts, use these demo credentials:

### **Project Manager (Full Access)**
- **Email**: `pm@example.com`
- **Password**: `password123`

### **Frontend Developer (Limited Access)**
- **Email**: `dev@example.com`
- **Password**: `password123`

## 📋 Available Scripts

### **npm start**
Starts the development server and opens the app in your browser.
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled (changes reflect immediately)
- **Port**: 3000 (change with PORT environment variable)

### **npm run build**
Creates an optimized production build.
- **Output**: `build/` directory
- **Optimization**: Minified and optimized for production

### **npm test**
Runs the test suite.
- **Framework**: Jest (if configured)
- **Coverage**: Test coverage reports

### **npm run eject**
Ejects from Create React App (one-way operation).
- **Warning**: Cannot be undone
- **Purpose**: Full configuration control

## 🛠️ Troubleshooting

### **Port Already in Use**
```bash
# Option 1: Kill the process using port 3000
npx kill-port 3000

# Option 2: Use a different port
PORT=3001 npm start
```

### **Dependencies Not Installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### **TypeScript Errors**
```bash
# Rebuild TypeScript
npm run type-check

# Or reinstall TypeScript
npm install --save-dev typescript @types/react @types/react-dom
```

### **Module Not Found Errors**
```bash
# Install missing dependencies
npm install [package-name]

# Or reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```


## 🎯 Features Overview

### **Authentication**
- JWT-based authentication
- Role-based access control
- Session persistence
- Secure token storage

### **Task Management**
- Kanban board with drag-and-drop
- Task filtering by role
- Task details modal
- Priority and due date management

### **Calendar**
- Month, Week, Day, and Agenda views
- Sprint tracking
- Event management
- Deadline reminders

### **User Management**
- Role-based permissions
- User role management
- Permission override capabilities

## 📝 Environment Variables

Create a `.env` file in the frontend directory for configuration:

```env
# API Configuration (for future backend)
REACT_APP_API_URL=http://localhost:8000

# Feature Flags
REACT_APP_ENABLE_AI=false
REACT_APP_ENABLE_ANALYTICS=false

# Development
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

## 🔧 Development Tips

### **Hot Reload**
- Changes to code automatically reload the browser
- No need to manually refresh
- State is preserved during hot reload

### **Debugging**
```bash
# Open Chrome DevTools
F12 or Ctrl+Shift+I

# Inspect React components
Install React DevTools browser extension

# View network requests
Check Network tab in DevTools
```

### **Code Formatting**
```bash
# Install Prettier (if using)
npm install --save-dev prettier

# Format code
npx prettier --write "src/**/*.{ts,tsx}"
```

## 🚨 Common Issues

### **"Module not found" Errors**
```bash
npm install
```

### **"Port 3000 already in use"**
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use different port
PORT=3001 npm start
```

### **TypeScript Errors**
```bash
npm run type-check

# Or install types
npm install --save-dev @types/node
```

### **Build Errors**
```bash
# Clean and rebuild
rm -rf build node_modules
npm install
npm run build
```

## 📚 Additional Resources

- **React Documentation**: https://react.dev
- **TypeScript Documentation**: https://www.typescriptlang.org
- **Material Icons**: https://fonts.google.com/icons
- **Project README**: See main README.md

## 🆘 Need Help?

1. Check the main README.md for project overview
2. Review the documentation in `/docs` folder
3. Check the issues tracker in `/issues`
4. Review the milestones in `/milestones`

## ✅ Success Checklist

- [ ] Node.js installed (v16+)
- [ ] npm installed (v7+)
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm start`)
- [ ] Browser opened to http://localhost:3000
- [ ] Login successful with demo credentials
- [ ] Can see Kanban board
- [ ] Can navigate between pages

---

**Happy Coding!** 🚀

For more information, see the main README.md or check the `/docs` folder for detailed documentation.
