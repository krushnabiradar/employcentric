
# EmployCentric - Human Resource Management System

EmployCentric is a comprehensive HRMS (Human Resource Management System) built with the MERN stack (MongoDB, Express, React, Node.js), featuring JWT-based authentication and Google Single Sign-On (SSO).

## Features

- **Authentication**
  - JWT-based authentication
  - Google Single Sign-On (SSO) integration using Passport.js
  - Role-based access control (Admin, HR, Manager, Employee)

- **Employee Management**
  - Employee profiles and directory
  - Department and position management
  - Employee documents and records

- **Attendance Tracking**
  - Check-in/check-out tracking
  - Real-time attendance monitoring
  - Monthly attendance reports

- **Leave Management**
  - Leave request submission
  - Approval workflows
  - Leave balance tracking
  - Different leave types (annual, sick, personal)

- **Payroll Processing**
  - Salary generation and payslips
  - Tax calculations and deductions
  - Payment history

- **Recruitment**
  - Job posting management
  - Candidate tracking
  - Recruitment pipeline
  - Interview scheduling

## Technology Stack

### Frontend
- React with TypeScript
- React Router for routing
- Tailwind CSS for styling
- shadcn/ui for UI components
- Tanstack Query (React Query) for data fetching
- Zustand for state management

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose ODM
- JWT for authentication
- Passport.js for auth strategies
- Express-validator for request validation

## Installation & Setup

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Environment Variables

Create `.env` file in the backend directory:

```
# Server configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/employcentric

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (optional for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@employcentric.com
FROM_NAME=EmployCentric
```

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/employcentric.git
cd employcentric
```

2. Install dependencies for frontend and backend
```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

3. Run the application
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm run dev
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Authenticate a user
- **GET /api/auth/logout** - Logout current user
- **GET /api/auth/me** - Get current user
- **POST /api/auth/forgot-password** - Request password reset
- **PUT /api/auth/reset-password** - Reset password
- **GET /api/auth/google** - Authenticate with Google
- **GET /api/auth/google/callback** - Google auth callback

### Employees

- **GET /api/employees** - Get all employees
- **POST /api/employees** - Create a new employee
- **GET /api/employees/:id** - Get a single employee
- **PUT /api/employees/:id** - Update an employee
- **DELETE /api/employees/:id** - Delete an employee

### Attendance

- **POST /api/attendance/check-in** - Record check-in
- **PUT /api/attendance/check-out** - Record check-out
- **GET /api/attendance** - Get attendance records
- **GET /api/attendance/report** - Generate attendance report

### Leave

- **GET /api/leave** - Get all leave requests
- **POST /api/leave** - Submit a leave request
- **GET /api/leave/:id** - Get a single leave request
- **PUT /api/leave/:id** - Update a leave request
- **PUT /api/leave/:id/approve** - Approve a leave request
- **PUT /api/leave/:id/reject** - Reject a leave request

### Payroll

- **GET /api/payroll** - Get all payroll records
- **POST /api/payroll/generate** - Generate payroll
- **GET /api/payroll/:id** - Get a single payroll record
- **GET /api/payroll/:id/slip** - Generate payslip

### Recruitment

- **GET /api/jobs** - Get all job postings
- **POST /api/jobs** - Create a new job posting
- **GET /api/jobs/:id** - Get a single job posting
- **PUT /api/jobs/:id** - Update a job posting
- **DELETE /api/jobs/:id** - Delete a job posting
- **GET /api/candidates** - Get all candidates
- **POST /api/candidates** - Add a new candidate
- **PUT /api/candidates/:id/status** - Update candidate status

## Project Structure

```
employcentric/
├── backend/             # Backend API with Express and MongoDB
│   ├── config/          # Configuration files
│   ├── controllers/     # API controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── app.js           # Express app
│   └── server.js        # Entry point
├── frontend/            # React frontend
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── contexts/    # React contexts
│       ├── hooks/       # Custom hooks
│       ├── lib/         # Utilities
│       ├── pages/       # Page components
│       ├── App.tsx      # Main app component
│       └── main.tsx     # Entry point
└── README.md            # Project documentation
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
