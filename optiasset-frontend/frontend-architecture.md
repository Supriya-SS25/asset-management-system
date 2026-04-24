# OptiAsset Frontend Architecture

## Role: IT Administrator (Full access to manage inventory and users)

### Page: /dashboard (The main landing page after login)
- Component: <Sidebar /> - Navigation links (Dashboard, Assets, Users, Reports, Assignments)
- Component: <TopNavbar /> - Shows logged-in user profile, notifications, and logout button
- Component: <StatCards /> - 4 blocks showing Total Assets, Deployed Assets, Maintenance Required, Available Assets
- Component: <RecentAssignmentsTable /> - Mini-table showing last 5 asset assignments with status
- Component: <QuickActions /> - Buttons for Add Asset, Add User, Generate Report, Bulk Import

### Page: /inventory (The page to manage all company assets)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <InventoryDataTable /> - Large table with search, filter, sort, and pagination
- Component: <AddAssetModal /> - Popup form with validation for adding new asset
- Component: <BulkImportButton /> - Import assets from CSV/Excel files
- Component: <AssetActions /> - Edit, Delete, Assign, Maintenance buttons for each row
- Component: <AssetFilters /> - Filter by category, status, department, date range

### Page: /users (The page to manage all employees)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <UsersDataTable /> - Large table with search, filter, sort, and pagination
- Component: <AddUserModal /> - Popup form with validation for adding new user
- Component: <UserActions /> - Edit, Delete, Deactivate, Reset Password buttons for each row
- Component: <UserFilters /> - Filter by department, role, status, date range

### Page: /assignments (The page to manage asset assignments)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <AssignmentsDataTable /> - Large table with search, filter, sort, and pagination
- Component: <AssignAssetModal /> - Popup form for assigning asset to user
- Component: <ReturnAssetModal /> - Popup form for returning asset from user
- Component: <AssignmentFilters /> - Filter by user, asset, status, date range

### Page: /reports (The page for analytics and reporting)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <ReportFilters /> - Date range and filter options
- Component: <AssetReportChart /> - Asset utilization chart with statistics
- Component: <AssignmentReportTable /> - Assignment summary table
- Component: <MaintenanceReportTable /> - Maintenance history and costs
- Component: <ExportButtons /> - Export to PDF, Excel, CSV

## Role: Department Manager (Department-level access)

### Page: /dashboard (Department overview page)
- Component: <Sidebar /> - Navigation links (Dashboard, Department Assets, Team Assignments, Reports)
- Component: <TopNavbar /> - Shows logged-in user profile, notifications, and logout button
- Component: <DepartmentStatCards /> - 3 blocks showing Department Assets, Deployed Assets, Pending Requests
- Component: <TeamAssignmentsTable /> - Mini-table showing team member assignments
- Component: <RequestAssetButton /> - Button to request new assets for department

### Page: /department-assets (Department asset management)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <DepartmentAssetsTable /> - Table showing department assets only
- Component: <AssignToTeamModal /> - Assign assets to team members
- Component: <DepartmentAssetFilters /> - Filter by category, status, availability

### Page: /team-assignments (Team member assignments)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <TeamAssignmentsTable /> - Team member assignment details
- Component: <BulkAssignModal /> - Assign multiple assets to team
- Component: <AssignmentHistory /> - Historical assignments for team

### Page: /reports (Department reports)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <DepartmentReportFilters /> - Department-specific filters
- Component: <DepartmentUtilizationChart /> - Department asset utilization
- Component: <TeamPerformanceTable /> - Team asset management performance
- Component: <ExportDepartmentButtons /> - Export department reports

## Role: Standard Employee (Personal asset view only)

### Page: /my-gear (Their personal landing page)
- Component: <TopNavbar /> - Shows logged-in user profile, notifications, and logout button
- Component: <MyAssetCards /> - Grid of cards showing assets currently assigned to them
- Component: <AssetDetailsModal /> - Popup showing detailed asset information
- Component: <ReportIssueButton /> - Button that opens ticket form for broken assets
- Component: <RequestMaintenanceButton /> - Button to request maintenance for assigned assets

### Page: /my-assignments (Personal assignment history)
- Component: <TopNavbar /> - (Reused from my-gear)
- Component: <MyAssignmentsList /> - List of current and past assignments
- Component: <AssignmentHistory /> - Detailed history of asset assignments
- Component: <ReturnRequestButton /> - Button to request return of assigned asset
- Component: <AssignmentStatus /> - Status indicators for current assignments

### Page: /profile (User profile management)
- Component: <TopNavbar /> - (Reused from my-gear)
- Component: <ProfileForm /> - Form to edit personal information
- Component: <PasswordChange /> - Form to change password
- Component: <NotificationSettings /> - Settings for email and system notifications
- Component: <ContactInfo /> - Display and edit contact information

## Role: HR Administrator (Employee management only)

### Page: /dashboard (HR overview page)
- Component: <Sidebar /> - Navigation links (Dashboard, Employees, Departments, Onboarding)
- Component: <TopNavbar /> - Shows logged-in user profile, notifications, and logout button
- Component: <HRStatCards /> - 4 blocks showing Total Employees, New Hires, Active Assignments, Pending Onboarding
- Component: <NewHiresTable /> - Mini-table showing recent new hires
- Component: <OnboardingChecklist /> - Asset assignment checklist for new employees

### Page: /employees (Employee management)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <EmployeesDataTable /> - Large table with search, filter, sort, and pagination
- Component: <AddEmployeeModal /> - Popup form with validation for adding new employee
- Component: <EmployeeActions /> - Edit, Deactivate, Transfer, Assign Assets buttons
- Component: <EmployeeFilters /> - Filter by department, role, status, hire date

### Page: /departments (Department management)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <DepartmentsTable /> - Table showing all departments
- Component: <AddDepartmentModal /> - Popup form for adding new department
- Component: <DepartmentActions /> - Edit, Merge, Deactivate department buttons
- Component: <DepartmentStats /> - Employee count and asset allocation per department

### Page: /onboarding (New employee onboarding)
- Component: <Sidebar /> - (Reused from dashboard)
- Component: <TopNavbar /> - (Reused from dashboard)
- Component: <OnboardingQueue /> - List of employees pending onboarding
- Component: <OnboardingChecklist /> - Asset assignment checklist for each employee
- Component: <BulkAssignModal /> - Assign standard assets to multiple new hires
- Component: <OnboardingStatus /> - Status tracking for onboarding process
