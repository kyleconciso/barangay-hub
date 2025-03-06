@echo off
REM ==================================================
REM Create React Client Project Structure - my-barangay-app
REM ==================================================

REM Create project root folder
mkdir my-barangay-app
cd my-barangay-app

REM Create public directory and files
mkdir public
cd public
type nul > index.html
type nul > favicon.ico
type nul > manifest.json
cd ..

REM Create src directory
mkdir src
cd src

REM ------------------------------
REM Create components directory and subdirectories/files
REM ------------------------------
mkdir components
cd components

  mkdir Auth
  cd Auth
  type nul > LoginForm.jsx
  type nul > RegisterForm.jsx
  cd ..

  mkdir Chat
  cd Chat
  type nul > ChatWindow.jsx
  cd ..

  mkdir Forms
  cd Forms
  type nul > FormList.jsx
  type nul > FormItem.jsx
  type nul > FormManagement.jsx
  type nul > FormDisplay.jsx
  cd ..

  mkdir Layout
  cd Layout
  type nul > Navbar.jsx
  type nul > Footer.jsx
  cd ..

  mkdir News
  cd News
  type nul > ArticleList.jsx
  type nul > ArticleItem.jsx
  type nul > ArticlePageManagement.jsx
  cd ..

  mkdir Pages
  cd Pages
  type nul > PageDisplay.jsx
  type nul > GeneralPageManagement.jsx
  type nul > MarkdownEditor.jsx
  cd ..

  mkdir Settings
  cd Settings
  type nul > SettingsForm.jsx
  cd ..

  mkdir Tickets
  cd Tickets
  type nul > TicketList.jsx
  type nul > TicketItem.jsx
  type nul > TicketForm.jsx
  type nul > TicketDetails.jsx
  type nul > TicketManagement.jsx
  cd ..

  mkdir Users
  cd Users
  type nul > UserList.jsx
  type nul > UserItem.jsx
  type nul > UserDetails.jsx
  type nul > UserManagement.jsx
  cd ..

  mkdir UI
  cd UI
  type nul > Loader.jsx
  type nul > Modal.jsx
  type nul > ErrorMessage.jsx
  type nul > PrivateRoute.jsx
  cd ..

cd ..

REM ------------------------------
REM Create pages directory and files
REM ------------------------------
mkdir pages
cd pages
type nul > Home.jsx
type nul > Officials.jsx
type nul > NewsPage.jsx
type nul > FormsPage.jsx
type nul > SubmitTicket.jsx
type nul > SignIn.jsx
type nul > Register.jsx
type nul > AccountManagement.jsx
type nul > TicketManagementPage.jsx
type nul > UserManagementPage.jsx
type nul > ArticlePageManagementPage.jsx
type nul > GeneralPageManagementPage.jsx
type nul > FormsManagementPage.jsx
type nul > SiteSettingsManagement.jsx
cd ..

REM ------------------------------
REM Create services directory and files
REM ------------------------------
mkdir services
cd services
type nul > auth.service.js
type nul > chat.service.js
type nul > forms.service.js
type nul > messages.service.js
type nul > pages.service.js
type nul > settings.service.js
type nul > tickets.service.js
type nul > users.service.js
cd ..

REM ------------------------------
REM Create context directory and files
REM ------------------------------
mkdir context
cd context
type nul > AuthContext.jsx
cd ..

REM ------------------------------
REM Create styles directory and files
REM ------------------------------
mkdir styles
cd styles
type nul > global.css
type nul > theme.js
type nul > variables.css
cd ..


type nul > App.jsx
type nul > index.jsx
type nul > firebase.js
type nul > utils.js
type nul > .env
type nul > .gitignore
type nul > package.json
type nul > package-lock.json
type nul > README.md

cd ..

echo Project structure created successfully in my-barangay-app folder.
pause