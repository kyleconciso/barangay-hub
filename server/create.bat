@echo off
REM ============================================
REM Create Project Structure for my-express-server
REM ============================================

REM Create project root folder and navigate into it
mkdir my-express-server
cd my-express-server

REM Create root-level files
echo {} > package.json
type nul > .env
echo # Project Overview > README.md
echo // Entry point: Bootstraps the app and starts the server > server.js
echo // Configures global middleware, routes, and error handling > app.js

REM Create src directory
mkdir src
cd src

REM ------------------------------
REM Create config directory and files
REM ------------------------------
mkdir config
cd config
echo // Application-wide settings (port, API rate limits, etc.) > app.config.js
echo // Firebase Admin SDK and Firestore configuration > firebase.config.js
cd ..

REM ------------------------------
REM Create controllers directory and files
REM ------------------------------
mkdir controllers
cd controllers
echo // Handles sign-up, login, and Firebase token verification > auth.controller.js
echo // CRUD operations for pages > pages.controller.js
echo // CRUD operations for forms > forms.controller.js
echo // CRUD operations for tickets with ownership checks > tickets.controller.js
echo // CRUD operations for messages linked to tickets > messages.controller.js
echo // CRUD operations for users with role-based access control > users.controller.js
echo // CRUD operations for settings > settings.controller.js
echo // Chat endpoint: integrates with Gemini and compiles the system prompt from news > chat.controller.js
cd ..

REM ------------------------------
REM Create routes directory and files
REM ------------------------------
mkdir routes
cd routes
echo // Routes for authentication (email-password sign-up/sign-in) > auth.routes.js
echo // Routes for pages CRUD > pages.routes.js
echo // Routes for forms CRUD > forms.routes.js
echo // Routes for tickets CRUD > tickets.routes.js
echo // Routes for messages CRUD > messages.routes.js
echo // Routes for user CRUD > users.routes.js
echo // Routes for settings CRUD > settings.routes.js
echo // Route for the Gemini chatbot chat endpoint > chat.routes.js
cd ..

REM ------------------------------
REM Create middlewares directory and files
REM ------------------------------
mkdir middlewares
cd middlewares
echo // Validates Firebase ID tokens on protected routes > auth.middleware.js
echo // Checks user roles (RESIDENT, EMPLOYEE, ADMIN) for authorization > role.middleware.js
echo // Validates incoming request data (using express-validator or Joi) > validate.middleware.js
echo // Global error handling middleware > error.middleware.js
cd ..

REM ------------------------------
REM Create models directory and files
REM ------------------------------
mkdir models
cd models
echo // Firestore operations for pages > page.model.js
echo // Firestore operations for forms > form.model.js
echo // Firestore operations for tickets > ticket.model.js
echo // Firestore operations for messages > message.model.js
echo // Firestore operations for users > user.model.js
echo // Firestore operations for settings > settings.model.js
cd ..

REM ------------------------------
REM Create services directory and files
REM ------------------------------
mkdir services
cd services
echo // Initializes Firebase Admin SDK and exposes Firestore and Auth utilities > firebase.service.js
echo // Integrates with the Gemini chatbot API > chat.service.js
echo // Retrieves (and optionally caches) the last 10 news articles for chat prompt > news.service.js
cd ..

REM ------------------------------
REM Create utils directory and files
REM ------------------------------
mkdir utils
cd utils
echo // Custom logging functionality (using Winston or similar) > logger.js
echo // Standardizes API responses across endpoints > responseFormatter.js
echo // Centralized error handling logic and custom error classes > errorHandler.js
cd ..

REM ------------------------------
REM Create tests directory with unit and integration subdirectories
REM ------------------------------
mkdir tests
cd tests
mkdir unit
mkdir integration
cd ..

REM Go back to the root folder
cd ..
cd ..

echo Project structure created successfully.
pause
