# Employee Management System

A full-stack Employee Management System built using React.js, Node.js, Express.js, and PostgreSQL. This project demonstrates frontend development, REST API integration, database connectivity, and CRUD operations.

## Project Overview

The Employee Management System allows users to manage employee records through a web-based dashboard. It connects a React frontend to a Node.js and Express backend API, with PostgreSQL used for persistent data storage.

This project is being developed as a cloud computing and DevOps portfolio project, with plans to add Docker, Jenkins CI/CD, and AWS deployment.

## Features

- Add new employees
- View employee records
- Update employee details
- Delete employee records
- Search and filter employees
- Store employee data in PostgreSQL
- REST API integration between frontend and backend

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Connectivity | node-postgres (`pg`) |
| API | REST API |
| Version Control | Git and GitHub |

## Project Architecture

```text
User
  |
  v
React Frontend (Vite)
  |
  | HTTP Requests
  v
Node.js + Express REST API
  |
  | SQL Queries
  v
PostgreSQL Database
```

## Project Structure

```text
employee-management-3tier/
├── frontend/          # React application
├── backend/           # Express REST API
├── database/
│   └── schema.sql     # Database table definition
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Git

## Database Setup

1. Open PostgreSQL and create a database named `employee_db`.

2. Run the SQL script in `database/schema.sql` against the `employee_db` database to create the employees table.

Example using PowerShell:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h 127.0.0.1 -U postgres -d employee_db -f database/schema.sql
```

Adjust the PostgreSQL installation path if your version is different.

## Backend Setup

Open a terminal in the project root and run:

```powershell
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with your own local database settings:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_NAME=employee_db
```

Replace the placeholder with your own PostgreSQL password. Do not commit your `.env` file to GitHub.

Start the backend:

```powershell
node server.js
```

The API should be available at:

`http://localhost:5000`

## Frontend Setup

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

Keep both the frontend and backend terminals running while using the application.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | Retrieve all employees |
| GET | `/api/employees/:id` | Retrieve one employee |
| POST | `/api/employees` | Add an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

## Learning Objectives

- Build a full-stack web application
- Connect a React frontend to a REST API
- Implement CRUD operations using Express.js
- Connect a backend application to PostgreSQL
- Use Git and GitHub for version control
- Learn the foundations for containerization and CI/CD

## Future Enhancements

- Docker containerization
- Docker Compose for application services
- Jenkins CI/CD pipeline
- Automated build and testing
- AWS deployment
- Cloud networking and security configuration

## Author

**Tabish Mullani**

GitHub: [tabish-devops](https://github.com/tabish-devops)

This is a learning and portfolio project. Features and deployment configuration may evolve as development continues.