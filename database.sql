-- AssetTrack Pro Database Schema
-- PostgreSQL Database Dump
-- Designed for 1000 employees with HR department
-- Task #2 - Client Meeting #2 Deliverable

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS asset_assignments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS asset_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ========================================
-- TABLE CREATION
-- ========================================

-- Departments Table (HR, IT, Finance, etc.)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Employees)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    employee_id VARCHAR(20) UNIQUE,
    department_id INTEGER,
    role VARCHAR(50) DEFAULT 'Employee',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Categories Table
CREATE TABLE asset_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets Table (Physical items)
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    asset_tag VARCHAR(50) UNIQUE,
    category_id INTEGER,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    warranty_expiry DATE,
    status VARCHAR(50) DEFAULT 'Available',
    condition VARCHAR(50) DEFAULT 'Good',
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Assignments Table (Who has what)
CREATE TABLE asset_assignments (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_by INTEGER,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    returned_date TIMESTAMP,
    return_condition VARCHAR(50),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Logs Table
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    performed_by INTEGER,
    maintenance_type VARCHAR(100),
    description TEXT,
    cost DECIMAL(10,2),
    performed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_maintenance_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- DATA INSERTION (Dummy Data)
-- ========================================

-- Insert Departments
INSERT INTO departments (name, description) VALUES 
('Human Resources', 'Manages employee relations, payroll, and benefits'),
('Information Technology', 'Handles all technology infrastructure and support'),
('Finance', 'Manages company finances and accounting'),
('Marketing', 'Handles marketing and sales activities'),
('Operations', 'Manages day-to-day operations'),
('Customer Support', 'Handles customer service and support'),
('Administration', 'General administrative tasks'),
('Research & Development', 'Product development and innovation');

-- Insert Asset Categories
INSERT INTO asset_categories (name, description) VALUES 
('Laptops', 'Company laptop computers'),
('Desktop Computers', 'Desktop computer systems'),
('Monitors', 'Computer monitors and displays'),
('Mobile Phones', 'Company mobile devices'),
('Printers', 'Office printing equipment'),
('Furniture', 'Office furniture and fixtures'),
('Network Equipment', 'Routers, switches, and networking gear'),
('Software Licenses', 'Software and license keys'),
('Vehicles', 'Company vehicles'),
('Tools', 'Maintenance and repair tools'),
('Other Equipment', 'Miscellaneous equipment');

-- Insert Users (Sample employees)
INSERT INTO users (first_name, last_name, email, phone, employee_id, department_id, role) VALUES 
('John', 'Smith', 'john.smith@company.com', '555-0101', 'EMP001', 1, 'HR Manager'),
('Sarah', 'Johnson', 'sarah.johnson@company.com', '555-0102', 'EMP002', 1, 'HR Specialist'),
('Michael', 'Chen', 'michael.chen@company.com', '555-0103', 'EMP003', 2, 'IT Manager'),
('Emily', 'Davis', 'emily.davis@company.com', '555-0104', 'EMP004', 2, 'IT Support'),
('David', 'Wilson', 'david.wilson@company.com', '555-0105', 'EMP005', 3, 'Finance Manager'),
('Lisa', 'Brown', 'lisa.brown@company.com', '555-0106', 'EMP006', 3, 'Accountant'),
('James', 'Taylor', 'james.taylor@company.com', '555-0107', 'EMP007', 4, 'Marketing Manager'),
('Jennifer', 'Martinez', 'jennifer.martinez@company.com', '555-0108', 'EMP008', 4, 'Marketing Specialist'),
('Robert', 'Anderson', 'robert.anderson@company.com', '555-0109', 'EMP009', 5, 'Operations Manager'),
('Maria', 'Garcia', 'maria.garcia@company.com', '555-0110', 'EMP010', 6, 'Support Lead'),
('William', 'Thomas', 'william.thomas@company.com', '555-0111', 'EMP011', 7, 'Admin Assistant'),
('Patricia', 'Jackson', 'patricia.jackson@company.com', '555-0112', 'EMP012', 8, 'R&D Manager'),
('Christopher', 'White', 'christopher.white@company.com', '555-0113', 'EMP013', 2, 'System Administrator'),
('Nancy', 'Harris', 'nancy.harris@company.com', '555-0114', 'EMP014', 1, 'Recruiter'),
('Daniel', 'Martin', 'daniel.martin@company.com', '555-0115', 'EMP015', 3, 'Financial Analyst'),
('Betty', 'Thompson', 'betty.thompson@company.com', '555-0116', 'EMP016', 4, 'Content Creator'),
('Richard', 'Garcia', 'richard.garcia@company.com', '555-0117', 'EMP017', 5, 'Logistics Coordinator'),
('Karen', 'Martinez', 'karen.martinez@company.com', '555-0118', 'EMP018', 6, 'Support Agent'),
('Steven', 'Robinson', 'steven.robinson@company.com', '555-0119', 'EMP019', 7, 'Office Manager'),
('Dorothy', 'Clark', 'dorothy.clark@company.com', '555-0120', 'EMP020', 8, 'Research Engineer');

-- Insert Assets (Sample company assets)
INSERT INTO assets (name, serial_number, asset_tag, category_id, purchase_date, purchase_cost, warranty_expiry, status, condition, location) VALUES 
('Dell Latitude 7420', 'DL7420-001', 'TAG001', 1, '2023-01-15', 1299.99, '2025-01-15', 'Available', 'Excellent', 'IT Storage'),
('Dell Latitude 7420', 'DL7420-002', 'TAG002', 1, '2023-01-15', 1299.99, '2025-01-15', 'Assigned', 'Good', 'User: John Smith'),
('HP EliteDesk 800', 'HPED800-001', 'TAG003', 2, '2023-02-20', 899.99, '2025-02-20', 'Available', 'Good', 'IT Storage'),
('Dell UltraSharp 27"', 'DU27-001', 'TAG004', 3, '2023-03-10', 449.99, '2025-03-10', 'Assigned', 'Excellent', 'User: Sarah Johnson'),
('iPhone 14 Pro', 'IP14P-001', 'TAG005', 4, '2023-04-05', 999.99, '2024-04-05', 'Assigned', 'Good', 'User: Michael Chen'),
('HP LaserJet Pro', 'HPLJ-001', 'TAG006', 5, '2023-05-12', 399.99, '2025-05-12', 'Available', 'Good', 'Office Area'),
('Ergonomic Office Chair', 'EOC-001', 'TAG007', 6, '2023-06-08', 299.99, '2026-06-08', 'Assigned', 'Good', 'User: Emily Davis'),
('Cisco Router 2921', 'CR2921-001', 'TAG008', 7, '2023-07-15', 1599.99, '2026-07-15', 'Available', 'Excellent', 'Server Room'),
('Microsoft Office 365', 'MSO365-001', 'TAG009', 8, '2023-08-01', 149.99, '2024-08-01', 'Available', 'N/A', 'Digital'),
('Toyota Camry 2023', 'TC2023-001', 'TAG010', 9, '2023-09-10', 25000.00, '2028-09-10', 'Assigned', 'Excellent', 'User: David Wilson'),
('Tool Kit Deluxe', 'TKD-001', 'TAG011', 10, '2023-10-05', 199.99, '2025-10-05', 'Available', 'Good', 'Maintenance Room'),
('Projector Epson 4K', 'PE4K-001', 'TAG012', 11, '2023-11-12', 1299.99, '2025-11-12', 'Available', 'Excellent', 'Conference Room'),
('MacBook Pro 16"', 'MBP16-001', 'TAG013', 1, '2023-12-01', 2499.99, '2025-12-01', 'Assigned', 'Excellent', 'User: Lisa Brown'),
('Surface Pro 9', 'SP9-001', 'TAG014', 1, '2024-01-15', 1199.99, '2026-01-15', 'Available', 'Good', 'IT Storage'),
('Samsung Galaxy S23', 'SGS23-001', 'TAG015', 4, '2024-02-10', 899.99, '2025-02-10', 'Assigned', 'Excellent', 'User: James Taylor');

-- Insert Asset Assignments (Sample assignments)
INSERT INTO asset_assignments (asset_id, user_id, assigned_by, due_date, status) VALUES 
(2, 1, 3, '2024-06-30', 'Active'),
(4, 2, 3, '2024-06-30', 'Active'),
(5, 3, 3, '2024-06-30', 'Active'),
(7, 4, 3, '2024-06-30', 'Active'),
(10, 5, 3, '2024-12-31', 'Active'),
(13, 6, 3, '2024-06-30', 'Active'),
(15, 7, 3, '2024-06-30', 'Active');

-- Insert Maintenance Logs (Sample maintenance records)
INSERT INTO maintenance_logs (asset_id, performed_by, maintenance_type, description, cost, next_maintenance_date) VALUES 
(2, 3, 'Routine Check', 'Monthly system check and updates', 0.00, '2024-03-15'),
(5, 3, 'Screen Replacement', 'Replaced cracked screen', 199.99, '2024-05-15'),
(10, 3, 'Oil Change', 'Regular vehicle maintenance', 45.00, '2024-04-10'),
(6, 3, 'Toner Replacement', 'Replaced toner cartridge', 89.99, '2024-06-12');

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_assets_serial_number ON assets(serial_number);
CREATE INDEX idx_assets_asset_tag ON assets(asset_tag);
CREATE INDEX idx_assets_category_id ON assets(category_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assignments_asset_id ON asset_assignments(asset_id);
CREATE INDEX idx_assignments_user_id ON asset_assignments(user_id);
CREATE INDEX idx_assignments_status ON asset_assignments(status);
CREATE INDEX idx_maintenance_asset_id ON maintenance_logs(asset_id);

-- ========================================
-- SAMPLE QUERIES (For Testing)
-- ========================================

-- Query to find all assets assigned to a specific user
-- SELECT a.name, a.serial_number, aa.assigned_date, aa.due_date 
-- FROM assets a 
-- JOIN asset_assignments aa ON a.id = aa.asset_id 
-- WHERE aa.user_id = 1 AND aa.status = 'Active';

-- Query to find all assets in a specific category
-- SELECT name, serial_number, status FROM assets WHERE category_id = 1;

-- Query to find all users in a specific department
-- SELECT first_name, last_name, email, role FROM users WHERE department_id = 2;

-- Query to find overdue assignments
-- SELECT u.first_name, u.last_name, a.name, aa.due_date 
-- FROM users u 
-- JOIN asset_assignments aa ON u.id = aa.user_id 
-- JOIN assets a ON a.id = aa.asset_id 
-- WHERE aa.due_date < CURRENT_DATE AND aa.status = 'Active';

-- ========================================
-- DATABASE STATISTICS
-- ========================================

-- Total records inserted
-- Departments: 8
-- Asset Categories: 11
-- Users: 20
-- Assets: 15
-- Asset Assignments: 7
-- Maintenance Logs: 4

-- Database is ready for AssetTrack Pro application
-- Supports 1000+ employees with scalable design
-- Includes HR department and all major company functions
