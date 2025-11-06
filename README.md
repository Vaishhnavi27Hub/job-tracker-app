# 📋 Job Application Tracker

A full-stack web application to track job applications, interviews, notes, and reminders built with the MERN stack.

🔗 **Live Demo:** [https://job-tracker-app-amber.vercel.app](https://job-tracker-app-amber.vercel.app)

---

## 🚀 Features

- ✅ **Track Job Applications** - Manage multiple job applications with status updates
- 📝 **Interview Notes** - Record interview experiences, questions asked, and learnings
- 🔔 **Smart Alerts** - Set reminders for follow-ups, deadlines, and interview prep
- 📊 **Analytics Dashboard** - Visualize application statistics and success rates
- 👤 **User Profiles** - Secure authentication and personalized experience
- 📄 **Resume Upload** - Attach resumes to job applications (PDF format)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **CSS3** - Custom styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📁 Project Structure
```
job-tracker-app/
├── frontend/                      # React frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── App.css              # Styles
│   │   ├── App.js               # Main application component
│   │   ├── index.css
│   │   └── index.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
├── backend/                       # Express backend
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # Database configuration
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── authMiddleware.js
│   │   ├── models/              # MongoDB schemas
│   │   │   ├── Alert.js
│   │   │   ├── Job.js
│   │   │   ├── Note.js
│   │   │   └── User.js
│   │   ├── routes/              # API routes
│   │   │   ├── alertRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   └── profileRoutes.js
│   │   ├── utils/               # Helper functions
│   │   │   ├── alertScheduler.js
│   │   │   └── emailService.js
│   │   └── server.js            # Entry point
│   ├── uploads/                 # Resume storage (ephemeral)
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
├── .gitignore
├── render.yaml                   # Render deployment config
└── README.md
```

---

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vaishnavi27Hub/job-tracker-app.git
cd job-tracker-app
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
npm start
```
Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🎨 Features in Detail

### Dashboard
- Visual analytics with pie charts
- Application status distribution
- Success rate metrics
- Recent activity timeline

### Applications Page
- Drag-and-drop reordering
- Status-based filtering
- Pagination support
- Resume attachment

### Notes & Experience
- Collapsible interview notes
- Rating system (1-5 stars)
- Interview type categorization
- Questions tracking

### Alerts & Reminders
- Multiple alert types (follow-up, deadline, interview prep)
- Priority levels (low, medium, high)
- Browser notifications
- Completion tracking

---
