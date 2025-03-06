@echo off
REM ============================================
REM Create Project Structure for barangay-client
REM ============================================

REM Create project root folder and navigate into it
mkdir barangay-client
cd barangay-client

REM Create root-level files
echo {} > package.json
type nul > .env
echo # Barangay Client > README.md
type nul > .gitignore

REM Create src directory
mkdir src
cd src

REM ------------------------------
REM Create components directory and subdirectories
REM ------------------------------
mkdir components
cd components

mkdir Forms
cd Forms
echo // Fetches and displays a list of forms. "Add Form" button. > FormList.jsx
echo // Renders a single form. Edit/Delete callbacks. > FormItem.jsx
echo // MUI Dialog: create/edit forms. Manages form state. > FormDialog.jsx
echo // Reusable form fields (controlled components). > FormFields.jsx
cd ..

mkdir Tickets
cd Tickets
echo // Displays list of tickets. "Add Ticket" button. > TicketList.jsx
echo // Renders a single ticket. Edit/Delete, view messages. > TicketItem.jsx
echo // MUI Dialog: create/edit tickets. Includes initial message field. > TicketDialog.jsx
echo // Reusable ticket fields, *including initial message field*. > TicketFields.jsx
cd ..

mkdir Users
cd Users
echo // Displays users. "Add User" (Admin). Edit/Delete (Admin/Employee on Residents). > UserList.jsx
echo // Renders a single user. Edit/Delete (conditional). > UserItem.jsx
echo // MUI Dialog: create/edit users (Admin/Employee). > UserDialog.jsx
echo // Reusable user fields (controlled components). > UserFields.jsx
cd ..

mkdir Pages
cd Pages
echo // Displays list of pages. > PageList.jsx
echo // Renders a *single* page. Sanitizes/displays rich text. > PageItem.jsx
echo // MUI Dialog: create/edit pages. Rich text editor. > PageDialog.jsx
echo // Reusable fields, *including React Quill*. > PageFields.jsx
cd ..

mkdir Auth
cd Auth
echo // Login form. > Login.jsx
echo // Signup form. > Signup.jsx
echo // Reusable form structure (Login/Signup). > AuthForm.jsx
cd ..

mkdir Layout
cd Layout
echo // Top navigation. Role-based links. Includes ChatbotWidget. > Navbar.jsx
echo // Protects routes (authentication + role). > PrivateRoute.jsx
cd ..

mkdir UI
cd UI
echo // Loading indicator. > LoadingSpinner.jsx
echo // Error message display. > ErrorMessage.jsx
echo // Confirmation dialog (delete actions). > ConfirmDialog.jsx
echo // AI chatbot widget. > ChatbotWidget.jsx
cd ..

mkdir Dashboard
cd Dashboard
echo // Resident: account, tickets. > ResidentDashboard.jsx
echo // Employee: manage residents, pages, forms. > EmployeeDashboard.jsx
echo // Admin: manage all users, pages, forms, settings. > AdminDashboard.jsx
cd ..

echo // Public landing: news excerpts (truncated), links. > Home.jsx

cd ..

REM ------------------------------
REM Create services directory
REM ------------------------------
mkdir services
cd services
echo // Axios configuration, auth interceptor. > api.js
echo // API: /api/auth (login, signup, profile). > authService.js
echo // API: /api/forms. > formService.js
echo // API: /api/tickets (*handles initial message*). > ticketService.js
echo // API: /api/users. > userService.js
echo // API: /api/pages. > pageService.js
echo // API: /api/chat. > chatService.js
cd ..

REM ------------------------------
REM Create contexts directory
REM ------------------------------
mkdir contexts
cd contexts
echo // Authentication state (user, token, role, isLoggedIn). > AuthContext.jsx
cd ..

REM ------------------------------
REM Create routes directory
REM ------------------------------
mkdir routes
cd routes
    echo // Centralized file for route management. > index.js
cd ..

REM ------------------------------
REM Create utils directory
REM ------------------------------
mkdir utils
cd utils
    echo // localStorage/sessionStorage utilities. > storage.js
cd ..

REM ------------------------------
REM Create root-level files within src
REM ------------------------------
echo // Main app component. Uses routes from src/routes/index.js. > App.jsx
echo // Entry point. Renders App. > index.js
echo // Constants (API_BASE_URL). > config.js
echo // Global styles (minimal). > styles.css




REM Go back to the root folder
cd ..
cd ..

echo Project structure created successfully.
pause