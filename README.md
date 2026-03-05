# PsyCare - Mental Health Platform

A premium, full-stack mental health platform built with React, Node.js, and MySQL.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, MySQL, JWT, Bcrypt
- **Database**: MySQL

## Quick Start

### 1. Database Setup
Ensure MySQL is running. The project is configured for:
- **Host**: localhost
- **User**: root
- **Password**: (empty)
- **Database**: psychology_care

### 2. Install Dependencies
Run in both `backend` and `frontend` folders:
```bash
npm install
```

### 3. Run the Servers
**Backend:**
```bash
cd backend
npm start (or node server.js)
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Test Accounts
The database has been seeded with the following accounts (Password for all: `password123`):
- **Admin**: `admin@psycare.com`
- **Doctor**: `doctor@psycare.com`
- **Customer**: `customer@psycare.com`

## Features
- **Role-Based Routing**: Automatic redirection based on user role.
- **Modern UI**: Blue/White medical aesthetic with glassmorphism and smooth transitions.
- **Secure Auth**: Password hashing and JWT token management.
- **Premium Dashboards**: Custom interfaces for Doctors and Admins.
