# Team Task Manager 🚀

Hey there! Welcome to the **Team Task Manager**. This is a full-stack web application I built using the MERN stack (MongoDB, Express, React, Node.js). 

It's designed to help teams stay organized, manage projects, and track tasks without the clutter of heavy enterprise tools. Whether you're an Admin setting up a new project or a Member knocking out tasks on the Kanban board, this app keeps everything synced, secure, and easy to use.

## ✨ What's Inside?

- **Role-Based Access (RBAC)**: 
  - **Admins** run the show. They can create, edit, and delete projects, assign team members, and manage any task.
  - **Members** get a focused view. They only see the projects they've been invited to and can update the status of their assigned tasks.
- **Kanban Board**: A clean, visual board (To Do, In Progress, Done) to easily track where tasks are at.
- **Project Management**: Creating a project is super simple, and assigning team members is just a matter of checking a few boxes.
- **Live Dashboard**: Get a quick glance at your workload, including a breakdown of tasks by status and a heads-up on anything that's overdue.
- **Sleek UI**: I went with a modern, glassmorphic design built completely from scratch with Vanilla CSS—no heavy CSS frameworks here!

## 🛠️ Built With

- **Frontend:** React, React Router, Axios, Lucide React (for those crisp icons), and pure Vanilla CSS.
- **Backend:** Node.js and Express.
- **Database:** MongoDB Atlas paired with Mongoose.
- **Security:** JWT (JSON Web Tokens) for authentication and bcryptjs for keeping passwords safe.

## 🚀 Getting Started

Want to run this locally? Here's how to get it up and running in a few minutes.

### Prerequisites
Make sure you have Node.js installed on your machine and a MongoDB Atlas account (or a local MongoDB instance running).

### 1. Clone the Repo
\`\`\`bash
git clone <your-repo-url>
cd Ethara.AI_Assessment
\`\`\`

### 2. Boot up the Backend
Head over to the \`backend\` folder and install the dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

You'll need to set up your environment variables. Create a \`.env\` file in the \`backend\` directory and add these lines:
\`\`\`env
# Drop your MongoDB Atlas connection string right here
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
\`\`\`

Now, start the server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Spin up the Frontend
Open a new terminal window, navigate to the \`frontend\` folder, and install the dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

Start the React development server:
\`\`\`bash
npm run dev
\`\`\`

Boom! 💥 The app should now be running locally at \`http://localhost:5173\`. 

## 🗺️ How it's Structured

If you want to poke around the code, here's a quick map of how I laid things out:

\`\`\`
Ethara.AI_Assessment/
│
├── backend/                # Where the server lives
│   ├── config/             # Database connection setup
│   ├── controllers/        # The brains behind the API routes
│   ├── middleware/         # Auth and Role checks (keeping things secure)
│   ├── models/             # Mongoose schemas (User, Project, Task)
│   ├── routes/             # API routing
│   └── server.js           # The main entry point
│
└── frontend/               # The React UI
    ├── src/
    │   ├── components/     # Reusable UI bits (Navbar, etc.)
    │   ├── context/        # React Context for managing Auth state
    │   ├── pages/          # The main views (Dashboard, Projects, Login, etc.)
    │   ├── services/       # Axios API helper
    │   ├── App.jsx         # App routing logic
    │   └── index.css       # All the custom styles
    └── package.json
\`\`\`

## 🔌 API Endpoints

In case you need to interact directly with the backend:

**Authentication (\`/api/auth\`)**
*   \`POST /register\` - Sign up a new user
*   \`POST /login\` - Log in and grab a JWT
*   \`GET /users\` - Fetch all users (Admin only)

**Projects (\`/api/projects\`)**
*   \`GET /\` - Fetch projects (auto-filters based on who is logged in)
*   \`POST /\` - Create a new project (Admin only)
*   \`GET /:id\` - Grab details for a specific project
*   \`PUT /:id\` - Edit a project (Admin only)
*   \`DELETE /:id\` - Delete a project and its linked tasks (Admin only)

**Tasks (\`/api/tasks\`)**
*   \`GET /\` - Fetch tasks for a specific project
*   \`POST /\` - Create a new task (Admin only)
*   \`PUT /:id\` - Edit task details (Admin) or just the status (Member)
