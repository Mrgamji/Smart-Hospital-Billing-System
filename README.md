markdown
# 🏥 Smart Hospital Billing System

A comprehensive, modern hospital billing and management system built with React, TypeScript, Node.js, and SQLite. This system streamlines hospital billing operations, patient management, and financial tracking with an intuitive interface and robust backend.

## ✨ Features

### 📊 Core Features
- **Patient Management**: Complete patient registration and records management
- **Billable Items Catalog**: Manage medical services, drugs, and procedures
- **Package Management**: Create treatment packages with itemized or fixed pricing
- **Invoice Generation**: Create, edit, and finalize patient invoices
- **PDF Export**: Professional invoice generation with automatic PDF download
- **Doctor Management**: Track doctors, their patients, and performance metrics

### 💰 Billing & Financials
- **Real-time Calculations**: Automatic tax and discount calculations
- **Multi-tier Pricing**: Support for both individual items and package pricing
- **Discount Management**: Configurable discount reasons with approval workflows
- **Tax Configuration**: Per-item tax rates with automatic calculation
- **Revenue Tracking**: Comprehensive financial reporting and analytics

### 🔐 Security & Administration
- **Role-Based Access Control**: Admin, Doctor, and Billing Clerk roles
- **Audit Logging**: Complete audit trail of all system changes
- **User Management**: Add, edit, and manage system users
- **Data Validation**: Comprehensive input validation and error handling

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Instant feedback and data synchronization
- **Intuitive Interface**: Clean, modern UI with easy navigation
- **Search & Filter**: Advanced search across all data entities

## 🏗️ System Architecture

### Frontend (React + TypeScript + Vite)
- **React 18**: Modern component-based architecture
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Modern icon library
- **Context API**: State management with React Context

### Backend (Node.js + Express + SQLite)
- **Node.js**: JavaScript runtime for backend services
- **Express.js**: Fast, minimalist web framework
- **SQLite**: Lightweight, file-based database
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Clean, structured API endpoints

### Database Schema
├── users (system users: admin, doctors, billing clerks)
├── patients (patient information and records)
├── billable_items (medical services and products)
├── packages (treatment packages with items)
├── invoices (patient billing invoices)
├── invoice_items (line items within invoices)
├── discount_reasons (discount configurations)
└── audit_logs (system audit trail)

text

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mrgamji/Smart-Hospital-Billing-System.git
   cd Smart-Hospital-Billing-System
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env
Edit .env with your configuration:

env
PORT=3001
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
Start the development servers

bash
# Start backend server (port 3001)
npm run server

# Start frontend dev server (port 5173)
npm run dev
Access the application

Frontend: http://localhost:5173

Backend API: http://localhost:3001

Health check: http://localhost:3001/health

Default Login Credentials
After first run, the system seeds these default users:

Admin: admin@hospital.com / 123456

Doctor: dr.smith@hospital.com / 123456

Billing Clerk: clerk@hospital.com / 123456

📁 Project Structure
text
Smart-Hospital-Billing-System/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── billing/            # Billing-related components
│   │   └── shared/             # Shared/reusable components
│   ├── contexts/               # React Context providers
│   ├── lib/                    # Utility functions and API client
│   └── App.tsx                 # Main application component
├── backend/                     # Backend source code
│   ├── models/                 # Database models
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Express middleware
│   ├── controllers/            # Business logic controllers
│   └── index.ts                # Main server file
├── public/                      # Static assets
├── package.json                 # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
🔧 API Documentation
Authentication Endpoints
text
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
GET    /api/auth/profile        # Get user profile
Patient Management
text
GET    /api/patients            # List all patients
GET    /api/patients/:id        # Get specific patient
POST   /api/patients            # Create new patient
PUT    /api/patients/:id        # Update patient
DELETE /api/patients/:id        # Delete patient
GET    /api/patients/recent     # Get recent patients
Billing Management
text
GET    /api/billables           # List billable items
POST   /api/billables           # Create billable item
GET    /api/packages            # List treatment packages
POST   /api/packages            # Create package
GET    /api/invoices            # List invoices
POST   /api/invoices            # Create invoice
GET    /api/invoices/stats      # Dashboard statistics
Admin Endpoints
text
GET    /api/doctors             # List all doctors
POST   /api/doctors             # Add new doctor
GET    /api/audit               # View audit logs
GET    /api/discounts           # Manage discount reasons
💻 Development
Available Scripts
bash
# Development
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run dev:full     # Start both frontend and backend

# Building
npm run build        # Build frontend for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run lint         # Lint code

# Database
npm run db:reset     # Reset database (development)
Database Operations
The system uses SQLite with automatic seeding:

Database file: hospital.db

Auto-creates on first run

Seeds default users and sample data

Includes audit logging

Adding New Features
Create backend route in backend/routes/

Implement controller logic in backend/controllers/

Update API client in src/lib/api.ts

Create React components in src/components/

Add to navigation if needed

🛡️ Security Features
JWT Authentication: Token-based authentication with expiry

Password Hashing: bcrypt password encryption

SQL Injection Protection: Parameterized queries

XSS Protection: Input sanitization and output encoding

CORS Configuration: Restricted cross-origin requests

Rate Limiting: Protection against brute force attacks

Audit Logging: Complete system change tracking

📈 Performance Optimizations
Code Splitting: Dynamic imports for faster initial load

Image Optimization: Automatic image compression

Caching Strategy: Intelligent API response caching

Database Indexing: Optimized query performance

Lazy Loading: Components load only when needed

Bundle Optimization: Tree shaking and minification

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request