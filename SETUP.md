# Hospital Smart Billing System - Setup Guide

## Overview
A comprehensive hospital billing system built with React, TypeScript, Tailwind CSS, and Supabase. Features include billable items management, treatment packages, invoice creation, patient management, and role-based access control.

## Features Implemented

### Admin Panel
- **Billable Items Management**: Add, edit, and deactivate hospital products and services with pricing, categories, and tax rates
- **Packages Management**: Create treatment packages with fixed or itemized pricing
- **Treatments & Procedures**: Define medical procedures with auto-linked billable items

### Billing Interface
- **Patient Management**: Register and manage patient records
- **Invoice Creation**: Create invoices with mixed billable items and packages
- **Invoice Management**: View, search, and filter all invoices by status
- **Real-time Calculations**: Automatic subtotal, tax, discount, and total calculations

### Core Features
- **Package Support**: Both fixed-price and itemized packages with detailed breakdowns
- **Discount Management**: Pre-approved discount reasons with percentage limits
- **Role-Based Access**: Admin, Doctor, and Billing Clerk roles with appropriate permissions
- **Audit Logging**: Track all changes to billables, packages, and invoices
- **Responsive Design**: Clean, professional interface with hospital-appropriate styling

## Getting Started

### 1. Authentication Setup

To use the system, you need to create a user account with Supabase Auth:

#### Option A: Using Supabase Dashboard (Recommended for First Admin)
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User" or "Invite User"
4. Enter email and password
5. After user is created, go to SQL Editor in Supabase
6. Run this query to assign admin role:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('USER_ID_HERE', 'admin');
   ```
   Replace USER_ID_HERE with the actual user ID from the auth.users table

#### Option B: Using Supabase CLI (If available)
```bash
supabase auth signup --email admin@hospital.com --password yourpassword
```

### 2. Initial Data Setup

After logging in as admin, set up your billing system:

1. **Add Billable Items** (Admin Panel > Billable Items)
   - Drugs (e.g., Paracetamol, Antibiotics)
   - Nursing services (e.g., Nursing Fee, IV Administration)
   - Procedures (e.g., Blood Test, X-Ray)
   - Room charges

2. **Create Packages** (Admin Panel > Packages)
   - Maternity Package
   - Surgery Bundle
   - Dental Checkup
   - Full Body Checkup

3. **Define Treatments** (Admin Panel > Treatments)
   - Link common procedures to their required billables
   - Set default quantities

4. **Register Patients** (Patients)
   - Add patient records before creating invoices

### 3. User Roles

The system supports three roles:

- **Admin**: Full access to all features including system configuration
- **Doctor**: Can create invoices, manage patients, view reports
- **Billing Clerk**: Can create invoices and manage patients

To add more users:
1. Have them sign up through Supabase Auth
2. As admin, assign their role in the user_roles table

## Database Schema

The system uses the following main tables:
- `billable_items`: Products and services
- `packages`: Treatment bundles
- `package_items`: Items within packages
- `treatments`: Medical procedures
- `treatment_billables`: Auto-added items for treatments
- `patients`: Patient records
- `invoices`: Patient invoices
- `invoice_items`: Line items on invoices
- `discount_reasons`: Pre-approved discounts
- `audit_logs`: System activity tracking
- `user_roles`: Role assignments

## Workflow

### Creating an Invoice
1. Navigate to "Create Invoice"
2. Select a patient (or register a new one)
3. Add billable items or packages
4. Apply discounts if needed
5. Add notes
6. Save as draft or finalize

### Package Behavior
- **Fixed Price Packages**: Display as single line item with total price
- **Itemized Packages**: Show package header with expandable item breakdown
- Both types calculate taxes and discounts correctly

## Key Concepts

- **Billables**: Individual sellable items (drugs, services, procedures)
- **Packages**: Bundles of billables with special pricing
- **Treatments**: Medical procedures that auto-add related billables
- **Invoice Status**: Draft → Finalized → Paid → (Cancelled)

## Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Security**: Row Level Security (RLS) policies

## Security Features

- Role-based access control
- Row-level security on all tables
- Audit logging for all changes
- Secure authentication with Supabase

## Notes

- All prices are in USD but can be customized
- Tax rates are configurable per item
- Discount reasons are pre-configured but can be modified by admins
- Invoice numbers are auto-generated
- Patient codes are auto-generated if not provided

## Support

For issues or questions, refer to the inline code documentation or check the Supabase logs for debugging.
