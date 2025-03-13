# Barangay San Antonio Information Hub - Server

This is the backend for the Barangay San Antonio website. It's built with Node.js, Express, and Firebase.

## What It Does

- **REST API:** Provides links (endpoints) for managing website information (pages, news, forms, tickets, messages, users, settings).
- **Firebase Authentication:** Handles user logins using Firebase.
- **Firestore Database:** Stores website data in Firestore, a NoSQL document database.
- **Authentication and Authorization:** Checks who is logged in and their allowed actions (admin, employee, or regular user).
- **Data Validation:** Checks if data is correct (e.g., a valid email address).
- **Genkit Chatbot:** Includes a chat feature using Genkit.
- **Error Handling:** Sends back error messages if something goes wrong.

## API Endpoints

- Authentication
  - `POST /api/v1/auth/register`: Register.
  - `GET /api/v1/auth/me`: Get user info.
- Pages
  - `GET /api/v1/pages`: Get all pages.
  - `POST /api/v1/pages`: Create page (admin/employee).
  - `GET /api/v1/pages/:id`: Get one page.
  - `PUT /api/v1/pages/:id`: Update page (admin/employee).
  - `DELETE /api/v1/pages/:id`: Delete page (admin/employee).
- Articles (same as Pages)
- Forms (same as Pages but no content)
- Tickets
  - Includes links for residents, employees, and admins.
  - Residents can only manage their own tickets.
- Messages (same as Tickets with access rules)
- Users
  - `GET /api/v1/users`: Get all users (admin/employee). Employees can only see residents.
  - `GET /api/v1/users/officials`: Get users who are barangay officials.
  - `POST /api/v1/users`: Create user (admin/employee).
  - `GET /api/v1/users/:id`: Get one user (admin/employee).
  - `PUT /api/v1/users/:id`: Update user (admin/employee, with limits).
  - `DELETE /api/v1/users/:id`: Delete user (admin/employee).
- Settings
  - `GET /api/v1/settings`: Get settings. Regular users see limited settings.
  - `PUT /api/v1/settings`: Update settings (admin only).
- Chat
  - `/api/v1/chat`: Communicate with the chatbot.

## How to Run

See the instructions in the main README.md file.
